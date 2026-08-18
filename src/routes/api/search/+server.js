// src/routes/api/search/+server.js
//
// Hybrid blog search: lexical (tf-idf) + semantic (bge-base-en-v1.5
// embeddings over Vectorize), fused with Reciprocal Rank Fusion, then
// cross-encoder reranked (bge-reranker-base) when available. Every AI
// dependency degrades gracefully: no AI binding or empty Vectorize →
// lexical-only; reranker failure → RRF order stands. The response
// always reports which stages actually ran.
//
// The index self-heals: if Vectorize reports zero vectors (fresh
// deploy, index rebuild), the first search bootstraps it once per
// isolate instead of returning degraded results forever.

import { json } from '@sveltejs/kit';
import {
    getCorpus,
    lexicalSearch,
    makeSnippet
} from '$lib/blog/search-core.js';

const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5';
const RERANK_MODEL = '@cf/baai/bge-reranker-base';
const RRF_K = 60; // standard reciprocal-rank constant
const VECTOR_TOP_K = 24;
const FINAL_POSTS = 6;

// Per-stage deadlines. A stuck Workers AI / Vectorize subrequest can
// hang for minutes; racing it means the (instant) lexical stage
// always answers instead. The losing call keeps running server-side —
// wasted compute, but a bounded wait for the reader.
const EMBED_TIMEOUT_MS = 4000;
const VECTOR_TIMEOUT_MS = 3000;
const RERANK_TIMEOUT_MS = 2500;

function withTimeout(promise, ms, label) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
        )
    ]);
}

/** In-isolate query cache — repeated queries cost nothing. */
const cache = new Map();
const CACHE_MAX = 64;

/** Embedding texts in batches; returns null on any failure. */
async function embed(env, texts) {
    if (!env.AI) return null;
    try {
        const out = [];
        for (let i = 0; i < texts.length; i += 96) {
            const res = await withTimeout(
                env.AI.run(EMBED_MODEL, { text: texts.slice(i, i + 96) }),
                EMBED_TIMEOUT_MS,
                'embed'
            );
            const rows = res?.data || res?.result?.data || res?.result;
            if (!Array.isArray(rows)) return null;
            out.push(...rows);
        }
        return out;
    } catch (e) {
        console.error('[search] embed failed:', e?.message);
        return null;
    }
}

/** One-time-per-isolate bootstrap lock for the empty-index case. */
let bootstrapPromise = null;

async function ensureIndexed(env) {
    if (!env.VECTORIZE || !env.AI) return;
    try {
        const info = await env.VECTORIZE.describe();
        if ((info?.vectorCount || 0) > 0) return;
        if (!bootstrapPromise) {
            const { buildAndUpsertIndex } = await import(
                '$lib/blog/search-reindex.js'
            );
            bootstrapPromise = buildAndUpsertIndex(env).finally(() => {
                bootstrapPromise = null;
            });
        }
        await bootstrapPromise;
    } catch (e) {
        console.error('[search] bootstrap check failed:', e?.message);
    }
}

export async function GET({ url, platform, setHeaders }) {
    const started = Date.now();
    const q = (url.searchParams.get('q') || '').trim();
    setHeaders({
        'content-type': 'application/json',
        'cache-control': 'no-store'
    });

    if (q.length < 2) {
        return json({ query: q, results: [], stages: {}, took: 0 });
    }

    const env = platform?.env || {};
    const cacheKey = q.toLowerCase();
    const hit = cache.get(cacheKey);
    if (hit) return json(hit);

    await ensureIndexed(env);
    const corpus = await getCorpus();
    const byId = new Map(corpus.map((c) => [c.id, c]));

    // ── Stage 1a: lexical ranking ──
    const lexical = await lexicalSearch(q);

    // ── Stage 1b: semantic ranking via Vectorize ──
    let semantic = [];
    let embedded = false;
    if (env.VECTORIZE) {
        const vectors = await embed(env, [q]);
        if (vectors?.[0]) {
            try {
                const res = await withTimeout(
                    env.VECTORIZE.query(vectors[0], {
                        topK: VECTOR_TOP_K,
                        returnMetadata: 'all'
                    }),
                    VECTOR_TIMEOUT_MS,
                    'vector query'
                );
                for (const m of res?.matches || []) {
                    // Self-heal: skip vectors whose chunk is gone
                    if (!byId.has(m.id)) continue;
                    semantic.push({ chunk: byId.get(m.id), score: m.score });
                }
                embedded = true;
            } catch (e) {
                console.error('[search] vector query failed:', e?.message);
            }
        }
    }

    // ── Stage 2: Reciprocal Rank Fusion ──
    // Rank-based, so lexical tf-idf magnitudes and cosine similarities
    // never have to be normalized against each other.
    const fused = new Map();
    for (const [rank, { chunk }] of lexical.entries()) {
        const f = fused.get(chunk.id) || { chunk, score: 0, lexicalRank: rank };
        f.score += 1 / (RRF_K + rank + 1);
        fused.set(chunk.id, f);
    }
    for (const [rank, { chunk }] of semantic.entries()) {
        const f = fused.get(chunk.id) || { chunk, score: 0, semanticRank: rank };
        f.score += 1 / (RRF_K + rank + 1);
        fused.set(chunk.id, f);
    }
    let candidates = [...fused.values()].sort((a, b) => b.score - a.score);
    if (!candidates.length) {
        const empty = {
            query: q,
            results: [],
            stages: { lexical: lexical.length > 0, semantic: embedded, rerank: false },
            took: Date.now() - started
        };
        return json(empty);
    }

    // ── Stage 3: cross-encoder rerank of the fused top slice ──
    let rerank = false;
    let reranked = null;
    if (env.AI) {
        try {
            const slice = candidates.slice(0, 8);
            const res = await withTimeout(
                env.AI.run(RERANK_MODEL, {
                    query: q,
                    contexts: slice.map((c) => ({ text: c.chunk.searchText.slice(0, 700) })),
                    top_k: slice.length
                }),
                RERANK_TIMEOUT_MS,
                'rerank'
            );
            // Response shape varies by runtime version — accept the known ones.
            const rows =
                res?.response?.results || res?.response || res?.results || res?.data;
            if (Array.isArray(rows) && rows.length) {
                const scored = rows
                    .map((r, i) => ({
                        entry: slice[r?.index ?? i] || slice[i],
                        rscore: typeof r?.score === 'number' ? r.score : null
                    }))
                    .filter((r) => r.entry && r.rscore !== null)
                    .sort((a, b) => b.rscore - a.rscore);
                if (scored.length) {
                    reranked = scored;
                    rerank = true;
                }
            }
        } catch (e) {
            console.error('[search] rerank failed (RRF order stands):', e?.message);
        }
    }

    const ordered = rerank
        ? reranked.map((r) => ({ chunk: r.entry.chunk, relevance: r.rscore }))
        : candidates.map((c) => ({
              chunk: c.chunk,
              relevance: null,
              rrf: c.score
          }));

    // ── Group by post, best chunk wins; relative % for display ──
    // Reranker scores vary in scale between model revisions (logits
    // vs probabilities), so the display is calibrated RELATIVE to the
    // top hit: best match = 99%, everything else a share of it.
    const seen = new Set();
    const results = [];
    const topRerank = rerank ? Math.max(ordered[0]?.relevance ?? 0, 1e-6) : 1;
    for (const { chunk, relevance, rrf } of ordered) {
        const key = `${chunk.lang}:${chunk.slug}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const { snippet, terms } = makeSnippet(chunk, q);
        let pct;
        if (rerank && relevance !== null && relevance !== undefined) {
            const share = Math.max(relevance, 0) / topRerank;
            pct = Math.max(1, Math.min(99, Math.round(share * 99)));
        } else {
            const top = ordered[0]?.rrf || rrf || 1;
            pct = Math.max(30, Math.min(99, Math.round((rrf / top) * 99)));
        }
        results.push({
            slug: chunk.slug,
            lang: chunk.lang,
            title: chunk.title,
            date: chunk.date,
            speaker: chunk.speaker || null,
            snippet,
            terms,
            match: pct
        });
        if (results.length >= FINAL_POSTS) break;
    }

    const payload = {
        query: q,
        results,
        stages: {
            lexical: lexical.length > 0,
            semantic: embedded,
            rerank
        },
        took: Date.now() - started
    };

    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
    cache.set(cacheKey, payload);
    return json(payload);
}
