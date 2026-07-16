// src/lib/blog/loader.js

const SUPPORTED_LOCALES = ['en', 'fr', 'es'];

/**
 * Resolves a locale to a supported locale, defaulting to 'en'
 * @param {string} locale - The locale code to resolve
 * @returns {string} - A supported locale code
 */
function resolveLocale(locale) {
    if (!locale) return 'en';
    const baseLang = locale.split('-')[0].toLowerCase();
    if (SUPPORTED_LOCALES.includes(baseLang)) {
        return baseLang;
    }
    return 'en';
}

/**
 * Get all blog posts for a given locale
 * @param {string} locale - The locale code (en, fr, es)
 * @returns {Promise<Array>} - Array of blog post objects
 */
export async function getBlogPosts(locale = 'en') {
    const resolvedLocale = resolveLocale(locale);
    
    // Import all posts for this locale
    const modules = import.meta.glob('./**/*.json', { eager: true });
    
    const posts = [];
    for (const [path, mod] of Object.entries(modules)) {
        // Only include posts from the correct locale folder
        if (!path.includes(`/${resolvedLocale}/`)) continue;
        
        const post = mod.default || mod;
        if (post && post.slug) {
            posts.push({
                ...post,
                // Build the content from sections if available
                content: post.sections 
                    ? post.sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n')
                    : post.content || ''
            });
        }
    }
    
    return posts;
}

/**
 * Get a single blog post by slug for a given locale
 * @param {string} slug - The post slug
 * @param {string} locale - The locale code (en, fr, es)
 * @returns {Promise<Object|null>} - Blog post object or null if not found
 */
export async function getBlogPost(slug, locale = 'en') {
    const resolvedLocale = resolveLocale(locale);
    
    // Try to import the specific post file
    try {
        const modules = import.meta.glob('./**/*.json', { eager: true });
        
        for (const [path, mod] of Object.entries(modules)) {
            if (!path.includes(`/${resolvedLocale}/`)) continue;
            
            const post = mod.default || mod;
            if (post && post.slug === slug) {
                return {
                    ...post,
                    // Build the content from sections if available
                    content: post.sections 
                        ? post.sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n')
                        : post.content || ''
                };
            }
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
    }
    
    return null;
}

export { SUPPORTED_LOCALES, resolveLocale };
