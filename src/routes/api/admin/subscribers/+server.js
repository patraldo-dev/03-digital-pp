// src/routes/api/admin/subscribers/+server.js

import { json } from '@sveltejs/kit';

/**
 * Check if request has valid admin token
 * @param {Request} request - The request object
 * @param {App.Platform['env']} env - Environment variables
 * @returns {boolean}
 */
function isAuthorized(request, env) {
    const auth = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    return !!env.SEARCH_ADMIN_TOKEN && auth === env.SEARCH_ADMIN_TOKEN;
}

/**
 * GET subscribers list (admin only)
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ request, platform }) {
    if (!platform?.env) {
        return json({ error: 'Platform environment not available' }, { status: 500 });
    }

    const env = platform.env;
    if (!isAuthorized(request, env)) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const subscribers = await env.DB
            .prepare('SELECT * FROM subscribers ORDER BY created_at DESC')
            .all();

        /** @type {(s: any) => string} */
        const csvCell = (s) => `"${String(s || '').replace(/"/g, '""')}"`;
        
        const csvHeaders = 'Email,Type,Created At,Active\n';
        const csvRows = (subscribers.results || []).map((/** @type {any} */ sub) =>
            [sub.email, sub.type, sub.created_at, sub.active].map(csvCell).join(',')
        ).join('\n');

        return json({
            subscribers: subscribers.results,
            csv: csvHeaders + csvRows,
            count: subscribers.results?.length || 0
        });
    } catch (error) {
        console.error('Failed to fetch subscribers:', error);
        return json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}
