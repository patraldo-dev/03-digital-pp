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
export async function load({ params, locals }) {
    const { slug } = params;
    const locale = locals.lang || 'en';

    const post = await getBlogPost(slug, locale);

    if (!post) {
        throw error(404, 'Post not found');
    }

    // Build prev/next navigation across the locale's posts (newest first).
    const allPosts = await getBlogPosts(locale);
    const sortedPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentIndex = sortedPosts.findIndex((p) => p.slug === slug);

    const previousPost =
        currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

    return {
        post,
        previousPost,
        nextPost
    };
}
