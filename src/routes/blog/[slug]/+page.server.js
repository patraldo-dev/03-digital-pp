import { error } from '@sveltejs/kit';
import { getBlogPosts, getBlogPost } from '$lib/blog/loader.js';

// Simple markdown-like parser (in production, use a proper markdown parser like marked or remark)
function parseMarkdown(content) {
    // FIRST: Extract code blocks before any other processing
    const codeBlocks = [];
    let index = 0;
    
    // Extract mermaid blocks
    content = content.replace(/`{3}mermaid\n([\s\S]*?)\n`{3}/g, (match, code) => {
        codeBlocks[index] = `<div class="mermaid">${code}</div>`;
        return `%%CODE_BLOCK_${index}%%`;
    });
    
    // Extract other code blocks
    content = content.replace(/`{3}(.*?)\n([\s\S]*?)\n`{3}/g, (match, lang, code) => {
        codeBlocks[index] = `<pre><code class="language-${lang}">${code}</code></pre>`;
        return `%%CODE_BLOCK_${index}%%`;
    });
    
    // NOW: Process remaining markdown
    let html = content
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>')
        .replace(/<\/ul>\s*<ul>/g, '')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|u|p])/gm, '<p>')
        .replace(/$/g, '</p>')
        .replace(/<p><\/p>/g, '');
    
    // FINALLY: Restore code blocks
    codeBlocks.forEach((block, i) => {
        html = html.replace(`%%CODE_BLOCK_${i}%%`, block);
    });
    
    return html;
}

export async function load({ params, locals }) {
    const { slug } = params;
    const locale = locals.lang || 'en';

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
