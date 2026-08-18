// src/lib/blog/search-reindex.js
//
// Shared by the guarded reindex endpoint and the search route's
// empty-index bootstrap: chunk the corpus, embed in batches, upsert
// into Vectorize.

import { getCorpus } from './search-core.js';

const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5';
const EMBED_BATCH = 96;
const UPSERT_BATCH = 50;

/**
 * @param {object} env - worker env with AI + VECTORIZE bindings
 * @returns {Promise<{chunks: number, upserted: number}>}
 */
export async function buildAndUpsertIndex(env) {
    const corpus = await getCorpus();
    const vectors = [];

    for (let i = 0; i < corpus.length; i += EMBED_BATCH) {
        const batch = corpus.slice(i, i + EMBED_BATCH);
        const res = await env.AI.run(EMBED_MODEL, {
            text: batch.map((c) => c.searchText)
        });
        const rows = res?.data || res?.result?.data || res?.result;
        if (!Array.isArray(rows) || rows.length !== batch.length) {
            throw new Error(
                `embedding batch ${i / EMBED_BATCH} returned ${rows?.length ?? 'non-array'} rows`
            );
        }
        rows.forEach((vec, j) => {
            vectors.push({
                id: batch[j].id,
                values: vec,
                metadata: {
                    slug: batch[j].slug,
                    lang: batch[j].lang,
                    title: batch[j].title,
                    date: batch[j].date
                }
            });
        });
    }

    let upserted = 0;
    for (let i = 0; i < vectors.length; i += UPSERT_BATCH) {
        const res = await env.VECTORIZE.upsert(vectors.slice(i, i + UPSERT_BATCH));
        upserted += res?.upsertedCount ?? vectors.slice(i, i + UPSERT_BATCH).length;
    }

    console.log(`[search] index built: ${corpus.length} chunks, ${upserted} upserted`);
    return { chunks: corpus.length, upserted };
}
