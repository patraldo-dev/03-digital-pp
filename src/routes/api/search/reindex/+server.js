// src/routes/api/search/reindex/+server.js
//
// POST /api/search/reindex
// Authorization: Bearer <SEARCH_ADMIN_TOKEN secret>
//
// Rebuilds the Vectorize index from the bundled post corpus:
// chunk → embed (bge-base-en-v1.5, batches of 96) → upsert (batches
// of 50). Idempotent — chunk ids are stable, so re-running replaces
// content-in-place. Orphaned vectors (deleted posts) are ignored at
// query time by the search route.

import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
    const env = platform?.env || {};
    const auth = (request.headers.get('authorization') || '').replace(
        /^Bearer\s+/i,
        ''
    );
    if (!env.SEARCH_ADMIN_TOKEN) {
        return json(
            { ok: false, error: 'SEARCH_ADMIN_TOKEN secret not set' },
            { status: 503 }
        );
    }
    if (auth !== env.SEARCH_ADMIN_TOKEN) {
        return json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    if (!env.AI || !env.VECTORIZE) {
        return json(
            { ok: false, error: 'AI or VECTORIZE binding missing' },
            { status: 503 }
        );
    }

    const { buildAndUpsertIndex } = await import('$lib/blog/search-reindex.js');
    try {
        const stats = await buildAndUpsertIndex(env);
        return json({ ok: true, ...stats });
    } catch (e) {
        console.error('[search] reindex failed:', e?.message);
        return json({ ok: false, error: e?.message }, { status: 500 });
    }
}
