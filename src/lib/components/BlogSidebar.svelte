<script>
    // src/lib/components/BlogSidebar.svelte
    
    let { lang = 'en', posts = [], currentSlug = undefined, t = {} } = $props();
    
    /** @type {{ en: string; es: string; fr: string }} */
    const DATE_LOCALES = { en: 'en-US', es: 'es-MX', fr: 'fr-FR' };
    
    /**
     * @param {string | Date} d
     * @returns {string}
     */

const fmtDate = (d) => {
    const langKey = /** @type {keyof typeof DATE_LOCALES} */ (lang);
    const locale = DATE_LOCALES[langKey] || 'en-US';
    return new Date(d).toLocaleDateString(locale);
};
    
    /** @type {HTMLDetailsElement | null} */
    let detailsEl = $state(null);
    
    /** @type {MediaQueryList | null} */
    let mq = $state(null);
    
    $effect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(max-width: 768px)');
            mq = mediaQuery;
            
            const forceOpen = () => {
                if (mediaQuery.matches && detailsEl && !detailsEl.open) {
                    detailsEl.open = true;
                }
            };
            
            mediaQuery.addEventListener('change', forceOpen);
            forceOpen();
            
            return () => {
                mediaQuery.removeEventListener('change', forceOpen);
            };
        }
    });
</script>

<details class="blog-index" bind:this={detailsEl} open>
    <summary>{t.blog_index_open || 'Post index'} · {posts.length}</summary>
    <ul>
        {#each posts as post}
            <li>
                <a href="/blog/{post.slug}?lang={lang}" class:active={post.slug === currentSlug}>
                    {post.title}
                    <span class="post-date">{fmtDate(post.date)}</span>
                </a>
            </li>
        {/each}
    </ul>
</details>

<style>
    .blog-index {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 0.5rem 1rem;
    }
    .blog-index summary {
        cursor: pointer;
        font-weight: 600;
        padding: 0.5rem 0;
        color: #2c3e50;
    }
    .blog-index summary:hover {
        color: #1a252f;
    }
    .blog-index ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .blog-index li {
        padding: 0.25rem 0;
        border-top: 1px solid #e9ecef;
    }
    .blog-index li:first-child {
        border-top: none;
    }
    .blog-index a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-decoration: none;
        color: #495057;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: background 0.2s;
    }
    .blog-index a:hover {
        background: #e9ecef;
    }
    .blog-index a.active {
        background: #d4edda;
        color: #155724;
        font-weight: 500;
    }
    .blog-index .post-date {
        font-size: 0.75rem;
        color: #868e96;
        white-space: nowrap;
        margin-left: 0.5rem;
    }
</style>
