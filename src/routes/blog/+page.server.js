// src/routes/blog/+page.server.js

import { getBlogPosts } from '$lib/blog/loader.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
    const lang = url.searchParams.get('lang') || 'en';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = 10;
    
    const allPosts = await getBlogPosts(lang);
    
    // Sort posts by date (newest first)
    const sortedPosts = allPosts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    });

    // Pagination
    const totalPosts = sortedPosts.length;
    const totalPages = Math.ceil(totalPosts / pageSize);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedPosts = sortedPosts.slice(start, end);

    return {
        allPosts: sortedPosts,
        posts: paginatedPosts,
        pagination: {
            currentPage,
            totalPages,
            totalPosts
        },
        lang
    };
}
