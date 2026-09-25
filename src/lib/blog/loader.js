// src/lib/blog/loader.js

/** @type {string[]} */
const SUPPORTED_LOCALES = ['en', 'fr', 'es'];

/**
 * @typedef {Object} BlogPost
 * @property {string} slug - The post slug
 * @property {string} title - The post title
 * @property {string} date - The post date
 * @property {string} author - The post author
 * @property {string} excerpt - The post excerpt
 * @property {string[]} tags - The post tags
 * @property {string} source_lang - The source language from folder
 * @property {string} original_lang - The original language (explicit or source)
 * @property {boolean} translated - Whether this is a translation
 * @property {string} content - Flat content for legacy consumers
 * @property {Array<{title: string, content: string}>} [sections] - Sections if present
 */

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
 * Derive a locale code from a glob path like './en/foo.json' → 'en'
 * @param {string} path - The file path
 * @returns {string} - The locale code
 */
function localeFromPath(path) {
    for (const loc of SUPPORTED_LOCALES) {
        if (path.includes(`/${loc}/`)) return loc;
    }
    return 'en';
}

/**
 * Build the internal content string from a raw post object.
 * Preserves sections for the client renderer; also provides a flat
 * `content` fallback for legacy consumers.
 * @param {any} mod - The imported module
 * @param {string} path - The file path
 * @returns {BlogPost | null} - The built post object or null if invalid
 */
function buildPost(mod, path) {
    const post = /** @type {BlogPost} */ (mod.default || mod);
    if (!post || !post.slug) return null;
    const sourceLang = localeFromPath(path);
    return {
        ...post,
        // The folder the file lives in (en/fr/es)
        source_lang: sourceLang,
        // Explicit frontmatter field if present, else the folder
        original_lang: post.original_lang || sourceLang,
        // Machine-translation flag (set by publish-time translation)
        translated: post.translated || false,
        // Flat content for legacy/preview consumers
        content: post.sections
            ? post.sections.map((/** @type {{title: string, content: string}} */ s) => `## ${s.title}\n\n${s.content}`).join('\n\n')
            : post.content || ''
    };
}

/**
 * Get all blog posts across all locales. The reader's locale only
 * affects UI chrome (labels), not which posts are visible — a post
 * written in English is shown to Spanish and French readers too,
 * with its original language surfaced via the `original_lang` field.
 *
 * If the same slug exists in the reader's locale, that version wins
 * (genuine translations). Otherwise the first copy found is used.
 *
 * @param {string} locale - The reader's locale (affects dedupe priority only)
 * @returns {Promise<BlogPost[]>} - Blog post objects
 */
export async function getBlogPosts(locale = 'en') {
    const resolvedLocale = resolveLocale(locale);
    const modules = import.meta.glob('./**/*.json', { eager: true });

    /** @type {Map<string, BlogPost>} */
    const bySlug = new Map();
    for (const [path, mod] of Object.entries(modules)) {
        const post = buildPost(mod, path);
        if (!post) continue;
        const existing = bySlug.get(post.slug);
        if (!existing) {
            bySlug.set(post.slug, post);
        } else {
            // Prefer the reader's locale when a genuine translation exists.
            if (post.source_lang === resolvedLocale) {
                bySlug.set(post.slug, post);
            }
        }
    }

    return Array.from(bySlug.values());
}

/**
 * Get a single blog post by slug for a given locale. Falls back across
 * locales if the requested locale doesn't have a copy.
 *
 * @param {string} slug - The post slug
 * @param {string} locale - The reader's locale (preferred, then fallback)
 * @returns {Promise<BlogPost | null>}
 */
export async function getBlogPost(slug, locale = 'en') {
    const resolvedLocale = resolveLocale(locale);
    const modules = import.meta.glob('./**/*.json', { eager: true });

    /** @type {BlogPost | null} */
    let fallback = null;
    for (const [path, mod] of Object.entries(modules)) {
        const post = buildPost(mod, path);
        if (!post || post.slug !== slug) continue;

        if (post.source_lang === resolvedLocale) {
            return post; // exact locale match wins
        }
        if (!fallback) {
            fallback = post; // keep first cross-locale copy as fallback
        }
    }

    return fallback;
}

export { SUPPORTED_LOCALES, resolveLocale };
