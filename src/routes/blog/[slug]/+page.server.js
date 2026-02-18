import { error } from '@sveltejs/kit';
import { getBlogPosts, getBlogPost } from '$lib/blog/loader.js';

// Simple markdown-like parser (in production, use a proper markdown parser like marked or remark)
function parseMarkdown(content) {
    return content
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\\`\\`\\`mermaid\n([\s\S]*?)\n\\`\\`\\`/g, '<div class="mermaid">$1</div>')
        .replace(/\\`\\`\\`bash\n([\s\S]*?)\n\\`\\`\\`/g, '<pre><code class="language-bash">$1</code></pre>')
        .replace(/\\`\\`\\`(.*?)\n([\s\S]*?)\n\\`\\`\\`/g, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>')
        .replace(/<\/ul>\s*<ul>/g, '')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|u|p])/gm, '<p>')
        .replace(/$/g, '</p>')
        .replace(/<p><\/p>/g, '');
}

export async function load({ params, locals }) {
    const { slug } = params;
    const locale = locals.lang || 'en-us';

    // Get the post by slug for the current locale
    const post = await getBlogPost(slug, locale);

    if (!post) {
        throw error(404, 'Post not found');
    }

    // Get all posts for navigation
    const allPosts = await getBlogPosts(locale);
    const sortedPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentIndex = sortedPosts.findIndex(p => p.slug === slug);

    // Get previous and next posts
    const previousPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

    // Parse markdown content to HTML
    const htmlContent = parseMarkdown(post.content);

    return {
        post: {
            ...post,
            htmlContent
        },
        previousPost,
        nextPost
    };
}
