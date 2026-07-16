import { getBlogPosts } from '$lib/blog/loader.js';

const POSTS_PER_PAGE = 6;

export async function load({ url, locals }) {
    const page = parseInt(url.searchParams.get('page') || '1');
    const offset = (page - 1) * POSTS_PER_PAGE;
    const locale = locals.lang || 'en';

    // Get all posts for the current locale
    const allPosts = await getBlogPosts(locale);

    // Sort posts by date (newest first)
    const sortedPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get posts for current page
    const posts = sortedPosts.slice(offset, offset + POSTS_PER_PAGE);

    // Calculate pagination info
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    return {
        posts,
        pagination: {
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}
