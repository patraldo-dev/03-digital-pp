// src/lib/blog/search-reindex.js

import { getCorpus } from './search-core.js';

const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5';
const EMBED_BATCH = 50;
const UPSERT_BATCH = 100;

/**
 * @typedef {Object} VectorRecord
 * @property {string} id
 * @property {number[]} values
 * @property {Record<string, any>} metadata
 */

/**
 * @typedef {Object} EmbeddingResponse
 * @property {number[][]} data
 */

/**
 * @typedef {Object} VectorizeResponse
 * @property {number} count
 * @property {number} [upsertedCount]
 */

/**
 * Build and upsert vector embeddings for all blog posts
 * @param {App.Platform['env']} env - Cloudflare environment
 * @returns {Promise<{ upserted: number }>}
 */
export async function buildAndUpsertIndex(env) {
    if (!env.AI || !env.VECTORIZE) {
        throw new Error('AI or VECTORIZE binding not available');
    }

    const corpus = await getCorpus();
    /** @type {VectorRecord[]} */
    const vectors = [];

    // Process corpus in batches for embedding
    for (let i = 0; i < corpus.length; i += EMBED_BATCH) {
        const batch = corpus.slice(i, i + EMBED_BATCH);
        const res = await env.AI.run(EMBED_MODEL, {
            text: batch.map((/** @type {{ searchText: string }} */ c) => c.searchText)
        });

        // Workers AI returns { data: number[][] } 
        /** @type {number[][]} */
        const embeddings = /** @type {EmbeddingResponse} */ (res)?.data || [];
        if (!embeddings.length) {
            throw new Error(`Failed to embed batch ${i / EMBED_BATCH + 1}`);
        }

        for (let j = 0; j < batch.length && j < embeddings.length; j++) {
            const chunk = batch[j];
            const embedding = embeddings[j];
            if (!embedding) continue;

            vectors.push({
                id: chunk.id,
                values: embedding,
                metadata: {
                    slug: chunk.slug,
                    lang: chunk.lang,
                    title: chunk.title,
                    date: chunk.date,
                    speaker: chunk.speaker || '',
                    text: chunk.text.slice(0, 200)
                }
            });
        }
    }

    // Upsert in batches
    let upserted = 0;
    for (let i = 0; i < vectors.length; i += UPSERT_BATCH) {
        const batch = vectors.slice(i, i + UPSERT_BATCH);
        const res = await env.VECTORIZE.upsert(batch);
        // Vectorize returns { count: number } 
        const result = /** @type {VectorizeResponse} */ (res);
        upserted += (result?.count || result?.upsertedCount || batch.length);
    }

    console.log(`[search] Upserted ${upserted} vectors`);
    return { upserted };
}
