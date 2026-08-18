// src/routes/api/admin/subscribers/+server.js
//
// GET  /api/admin/subscribers        — list subscribers
// POST /api/admin/subscribers        — { action: 'export_csv' | 'bulk_unsubscribe' }
// Authorization: Bearer <SEARCH_ADMIN_TOKEN secret>
//
// Lives under /api so it no longer shadows the /admin/subscribers page
// (a +server.js next to a +page.svelte makes GET return the endpoint).

import { json } from '@sveltejs/kit';

/**
 * Bearer-token check against the SEARCH_ADMIN_TOKEN worker secret
 * @param {Request} request - The request object
 * @param {Object} env - Worker environment bindings
 * @returns {boolean} Whether the request is authorized
 */
function isAuthorized(request, env) {
    const auth = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    return !!env.SEARCH_ADMIN_TOKEN && auth === env.SEARCH_ADMIN_TOKEN;
}

/**
 * Handle GET requests to fetch all subscribers (admin only)
 * @param {Object} params - SvelteKit request parameters
 * @param {Request} params.request - The request object
 * @param {Object} params.platform - Cloudflare platform object
 * @returns {Promise<Response>} JSON response with subscribers
 */
export async function GET({ request, platform }) {
    try {
        const env = platform?.env || {};

        if (!isAuthorized(request, env)) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!env.DB) {
            return json({ error: 'Service temporarily unavailable' }, { status: 500 });
        }

        const subscribers = await env.DB
            .prepare(`
                SELECT id, email, type, created_at, active
                FROM subscribers
                ORDER BY created_at DESC
            `)
            .all();

        return json({
            subscribers: subscribers.results || []
        });

    } catch (error) {
        console.error('Admin subscribers fetch error:', error);
        return json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}

/**
 * Escape one CSV field (RFC 4180: quote, double embedded quotes)
 * @param {string|boolean|number} value - Raw field value
 * @returns {string} Safe CSV cell
 */
function csvCell(value) {
    const s = String(value ?? '');
    return `"${s.replace(/"/g, '""')}"`;
}

/**
 * Handle POST requests for admin actions (bulk operations, etc.)
 * @param {Object} params - SvelteKit request parameters
 * @param {Request} params.request - The request object
 * @param {Object} params.platform - Cloudflare platform object
 * @returns {Promise<Response>} JSON response
 */
export async function POST({ request, platform }) {
    try {
        const env = platform?.env || {};

        if (!isAuthorized(request, env)) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!env.DB) {
            return json({ error: 'Service temporarily unavailable' }, { status: 500 });
        }

        /** @type {{action: string, data: any}} */
        const { action, data } = await request.json();

        switch (action) {
            case 'export_csv': {
                const subscribers = await env.DB
                    .prepare('SELECT email, type, created_at, active FROM subscribers ORDER BY created_at DESC')
                    .all();

                const csvHeaders = 'Email,Type,Created At,Active\n';
                const csvRows = (subscribers.results || []).map(sub =>
                    [sub.email, sub.type, sub.created_at, sub.active].map(csvCell).join(',')
                ).join('\n');

                return new Response(csvHeaders + csvRows, {
                    headers: {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': 'attachment; filename="subscribers.csv"'
                    }
                });
            }

            case 'bulk_unsubscribe': {
                /** @type {string[]} */
                const emails = data.emails;

                if (!Array.isArray(emails) || emails.length === 0) {
                    return json({ error: 'Invalid email list' }, { status: 400 });
                }

                const placeholders = emails.map(() => '?').join(',');
                const result = await env.DB
                    .prepare(`UPDATE subscribers SET active = false WHERE email IN (${placeholders})`)
                    .bind(...emails)
                    .run();

                return json({
                    success: true,
                    message: `Unsubscribed ${result.changes} subscribers`
                });
            }

            default:
                return json({ error: 'Unknown action' }, { status: 400 });
        }

    } catch (error) {
        console.error('Admin action error:', error);
        return json({ error: 'Failed to process admin action' }, { status: 500 });
    }
}
