// src/routes/sitemap.xml/+server.js
//
// Builds the sitemap from the static routes plus every published post
// across all supported locales (deduped by URL).

import { getBlogPosts, SUPPORTED_LOCALES } from '$lib/blog/loader.js';

const BASE_URL = 'https://pinchepoutine.digital';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const paths = new Set(['', '/blog', '/contact']);

    for (const locale of SUPPORTED_LOCALES) {
        const posts = await getBlogPosts(locale);
        for (const post of posts) {
            paths.add(`/blog/${post.slug}`);
        }
    }

    const urls = [...paths]
        .sort()
        .map(
            (path) =>
                `  <url><loc>${BASE_URL}${path}</loc>${
                    path === '' ? '<changefreq>weekly</changefreq><priority>1.0</priority>' : ''
                }</url>`
        )
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
        }
    });
}
