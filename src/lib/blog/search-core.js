// src/lib/blog/search-core.js
//
// Server-side corpus plumbing for the hybrid blog search.
//
// The corpus is the post set the loader already globs (bundled JSON —
// no D1/R2 needed). Each section ("turn") of each post becomes one
// chunk with a stable id, so reindex upserts are idempotent and a
// stale vector whose chunk no longer exists is simply ignored at
// query time (self-healing against orphaned vectors).

import { getBlogPosts } from './loader.js';

/** Embedding chunks longer than this get truncated — bge-base's
 *  effective context is ~500 tokens; 1600 chars is a safe ceiling. */
const MAX_CHUNK_CHARS = 1600;
/** Sections shorter than this carry no retrieval signal. */
const MIN_CHUNK_CHARS = 40;

/** Per-isolate corpus cache — posts are static per deploy. */
let _corpus = null;
let _corpusPromise = null;

/** Strip markdown noise so embeddings and lexical tokens see prose. */
export function plainText(md) {
    return (md || '')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`[^`]*`/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#>*_~|]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Split a section into chunks if it exceeds the ceiling (rare). */
function splitLengths(text) {
    if (text.length <= MAX_CHUNK_CHARS) return [text];
    const parts = [];
    let rest = text;
    while (rest.length > MAX_CHUNK_CHARS) {
        // cut at a sentence/space boundary near the ceiling
        let cut = rest.lastIndexOf(' ', MAX_CHUNK_CHARS);
        if (cut < MAX_CHUNK_CHARS / 2) cut = MAX_CHUNK_CHARS;
        parts.push(rest.slice(0, cut));
        rest = rest.slice(cut).trim();
    }
    if (rest) parts.push(rest);
    return parts;
}

/**
 * Build the full chunk corpus (deduped posts, both locales' copies).
 * @returns {Promise<Array>} chunks: {id, slug, lang, title, date,
 *   speaker, text, searchText}
 */
export async function getCorpus() {
    if (_corpus) return _corpus;
    if (_corpusPromise) return _corpusPromise;
    _corpusPromise = (async () => {
        // '' → loader resolves per-path locale; we want every copy
        // (en + genuine fr/es translations) as its own chunks.
        const posts = await getBlogPosts('en');
        const chunks = [];
        for (const post of posts) {
            const lang = post.source_lang || 'en';
            // Overview chunk: title + excerpt + tags. Terms that only
            // live in the excerpt (summaries often say what the body
            // dances around — "CSS", "billing", …) must be retrievable.
            const overview = plainText(
                [post.title, post.excerpt, (post.tags || []).join(', ')]
                    .filter(Boolean)
                    .join('. ')
            );
            if (overview.length >= MIN_CHUNK_CHARS) {
                chunks.push({
                    id: `${lang}:${post.slug}:ov`,
                    slug: post.slug,
                    lang,
                    title: post.title,
                    date: post.date,
                    speaker: '',
                    text: overview,
                    searchText: overview
                });
            }
            const sections = post.sections?.length
                ? post.sections
                : [{ title: '', content: post.content || '' }];
            sections.forEach((sec, i) => {
                const speaker = /:$/.test((sec.title || '').trim())
                    ? (sec.title || '').trim().replace(/:\s*$/, '')
                    : '';
                const body = plainText(sec.content);
                if (body.length < MIN_CHUNK_CHARS) return;
                splitLengths(body).forEach((part, j) => {
                    chunks.push({
                        id: `${lang}:${post.slug}:${i}:${j}`,
                        slug: post.slug,
                        lang,
                        title: post.title,
                        date: post.date,
                        speaker,
                        text: part,
                        // title + speaker included in the embedded text so
                        // queries like "patrouch bisect" hit the right turns
                        searchText: `${post.title}\n${speaker ? speaker + ': ' : ''}${part}`
                    });
                });
            });
        }
        _corpus = chunks;
        return chunks;
    })();
    return _corpusPromise;
}

/* ── Lexical pass ───────────────────────────────────────────────
   Tiny tf-idf over the chunk corpus with accent folding. The corpus
   is a few hundred chunks — brute-force scoring per query is well
   under a millisecond and needs no external index. */

const STOPWORDS = new Set(('the a an and or of to in on for with is are was were be been ' +
    'it its this that these those as at by from not no but if then than so such can could ' +
    'we you i they he she them our your their my me us do does did have has had will would ' +
    'la le les de des du un une et ou dans sur pour avec est sont était être ce cette ces ' +
    'que qui quoi dont où pas plus mais comme si donc tel aux au à se sa son ses leur ne ' +
    'el los las de del y o en para con es son era ser este esta estos estas que por lo ' +
    'los un una su sus les le me te se no más mas pero como si ya').split(/\s+/));

/** Lowercase, fold accents, keep letters/digits (unicode-aware). */
export function tokenize(text) {
    const folded = (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
    const out = [];
    for (const m of folded.matchAll(/[\p{L}\p{N}]+/gu)) {
        if (m[0].length < 2 || STOPWORDS.has(m[0])) continue;
        out.push(m[0]);
    }
    return out;
}

/**
 * tf-idf lexical search over the corpus.
 * @returns {Array} top-N [{chunk, score}] best first
 */
export async function lexicalSearch(query, topN = 24) {
    const corpus = await getCorpus();
    const terms = tokenize(query);
    if (!terms.length) return [];

    // document frequency per term
    const df = new Map();
    for (const c of corpus) {
        const seen = new Set(tokenize(c.searchText));
        for (const t of terms) if (seen.has(t)) df.set(t, (df.get(t) || 0) + 1);
    }
    const N = corpus.length;
    const idf = (t) => Math.log(1 + N / (1 + (df.get(t) || 0)));

    const scored = [];
    for (const c of corpus) {
        const tokens = tokenize(c.searchText);
        const tf = new Map();
        for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
        let score = 0;
        for (const t of terms) {
            const f = tf.get(t) || 0;
            if (!f) continue;
            score += (1 + Math.log(f)) * idf(t);
        }
        // title term hits are strong priors
        const titleTokens = new Set(tokenize(c.title));
        for (const t of terms) if (titleTokens.has(t)) score += 2.5 * idf(t);
        if (score > 0) scored.push({ chunk: c, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topN);
}

/**
 * Windowed snippet around the first query-term hit in a chunk.
 * @returns {{snippet: string, terms: string[]}}
 */
export function makeSnippet(chunk, query, radius = 130) {
    const terms = tokenize(query);
    const text = chunk.text;
    const folded = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
    let at = -1;
    for (const t of terms) {
        const i = folded.indexOf(t);
        if (i >= 0 && (at < 0 || i < at)) at = i;
    }
    if (at < 0) return { snippet: text.slice(0, radius * 2), terms };
    const start = Math.max(0, at - radius);
    const end = Math.min(text.length, at + radius);
    return {
        snippet:
            (start > 0 ? '…' : '') +
            text.slice(start, end).trim() +
            (end < text.length ? '…' : ''),
        terms
    };
}
