// src/routes/api/search/reindex/+server.js

import { json } from '@sveltejs/kit';
import { buildAndUpsertIndex } from '$lib/blog/search-reindex.js';

/**
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request, platform }) {
    if (!platform?.env) {
        return json({ error: 'Platform environment not available' }, { status: 500 });
    }

    const env = platform.env;
    
    // Check authorization
    const auth = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!env.SEARCH_ADMIN_TOKEN) {
        return json({ ok: false, error: 'Admin token not configured' }, { status: 500 });
    }
    
    if (auth !== env.SEARCH_ADMIN_TOKEN) {
        return json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check for required bindings
    if (!env.AI || !env.VECTORIZE) {
        return json({ 
            ok: false, 
            error: 'AI or VECTORIZE binding not available' 
        }, { status: 500 });
    }
    
    try {
        const result = await buildAndUpsertIndex(env);
        return json({ 
            ok: true, 
            ...result 
        });
    } catch (/** @type {unknown} */ error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('[search] reindex failed:', err.message);
        return json({ 
            ok: false, 
            error: err.message 
        }, { status: 500 });
    }
}
