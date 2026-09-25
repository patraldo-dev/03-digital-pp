// src/routes/blog/[slug]/+page.server.js

import { getBlogPosts, getBlogPost } from '$lib/blog/loader.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
    const slug = params.slug;
    const locale = url.searchParams.get('lang') || 'en';
    
    const post = await getBlogPost(slug, locale);
    if (!post) {
        throw new Error(`Post not found: ${slug}`);
    }

    const allPosts = await getBlogPosts(locale);
    const sortedPosts = allPosts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    });
    
    const currentIndex = sortedPosts.findIndex((p) => p.slug === slug);
    const latestPost = sortedPosts[0] || null;
    const oldestPost = sortedPosts[sortedPosts.length - 1] || null;
    
    const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

    return {
        post,
        allPosts: sortedPosts,
        latestPost,
        oldestPost,
        previousPost: prevPost,
        nextPost,
        lang: locale
    };
}
