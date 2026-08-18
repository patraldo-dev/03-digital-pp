import { error } from '@sveltejs/kit';
import { getBlogPosts, getBlogPost } from '$lib/blog/loader.js';

/**
 * Single blog post loader.
 *
 * Returns the raw post (with sections intact) so the client renders
 * each section with `marked` + DOMPurify. We also compute a plain
 * `htmlContent` fallback for legacy posts that carry a single `content`
 * string instead of a sections[] array.
 */
export async function load({ params, locals, url }) {
    const { slug } = params;
    // Allow ?lang= override so the "View original" link can force the
    // original-language version regardless of the reader's locale cookie.
    const queryLang = url.searchParams.get('lang');
    const locale = queryLang || locals.lang || 'en';

    const post = await getBlogPost(slug, locale);

    if (!post) {
        throw error(404, 'Post not found');
    }

    // Navigation across the locale's posts (newest first): prev/next
    // neighbours, the full title index for the sidebar, and the two
    // ends of the timeline so the reader can jump to the very first
    // post or straight back to the latest.
    const allPosts = await getBlogPosts(locale);
    const sortedPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentIndex = sortedPosts.findIndex((p) => p.slug === slug);

    const previousPost =
        currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

    return {
        post,
        previousPost,
        nextPost,
        // Sidebar index (slim — titles only, no bodies)
        allPosts: sortedPosts.map((p) => ({
            slug: p.slug,
            title: p.title,
            date: p.date
        })),
        // Timeline ends: sortedPosts[0] is the newest, last is the oldest.
        latestPost: sortedPosts.length > 1 ? sortedPosts[0] : null,
        oldestPost: sortedPosts.length > 1 ? sortedPosts[sortedPosts.length - 1] : null
    };
}
