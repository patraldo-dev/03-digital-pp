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
    // Date-only strings ("2026-09-24") parse as UTC midnight and drift
    // a day west of Greenwich; anchor them to local midnight instead.
    const dt = typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
        ? new Date(d + 'T00:00:00')
        : new Date(d);
    return dt.toLocaleDateString(locale);
};
    
    /** @type {HTMLDetailsElement | null} */
    let detailsEl = $state(null);
    
    /** @type {MediaQueryList | null} */
    let mq = $state(null);
    
    $effect(() => {
        if (typeof window !== 'undefined') {
            // 1023px is where the post page's grid stacks this sidebar
            // above the article. Past that line the index becomes a
            // roll-out menu: it seats itself closed on small screens,
            // open as a sidebar column on wide ones. Re-seating only
            // happens on mount and on breakpoint crossings — a
            // reader's manual toggle is never fought.
            const mediaQuery = window.matchMedia('(max-width: 1023px)');
            mq = mediaQuery;

            const seat = () => {
                if (detailsEl) detailsEl.open = !mediaQuery.matches;
            };

            mediaQuery.addEventListener('change', seat);
            seat();

            return () => {
                mediaQuery.removeEventListener('change', seat);
            };
        }
    });
</script>

<details class="blog-index" bind:this={detailsEl}>
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
