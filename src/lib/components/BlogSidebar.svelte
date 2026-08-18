<script>
    import { browser } from '$app/environment';

    /**
     * Full post index — the sidebar listing every blog post title.
     * `posts` is the newest-first sorted list ({slug, title, date}).
     * `currentSlug` highlights the open post (post pages only).
     *
     * Mobile: renders as a collapsible <details> above the content.
     * Desktop (≥1024px): the summary is hidden and the list stays
     * visible; a matchMedia guard re-opens the details if it was
     * collapsed on mobile before rotating/resizing up.
     */
    let { posts = [], currentSlug = '', t = {} } = $props();

    let detailsEl = $state(null);

    $effect(() => {
        if (!browser) return;
        const mq = window.matchMedia('(min-width: 1024px)');
        const forceOpen = () => {
            if (mq.matches && detailsEl && !detailsEl.open) detailsEl.open = true;
        };
        mq.addEventListener('change', forceOpen);
        forceOpen();
        return () => mq.removeEventListener('change', forceOpen);
    });
</script>

<details class="blog-index" bind:this={detailsEl} open>
    <summary>{t.blog_index_open || 'Post index'} · {posts.length}</summary>
    <nav class="index-nav" aria-label={t.blog_index_title || 'All posts'}>
        <span class="index-heading">{t.blog_index_title || 'All Posts'}</span>
        <ul>
            {#each posts as post (post.slug)}
                <li class:current={post.slug === currentSlug}>
                    <a href="/blog/{post.slug}" aria-current={post.slug === currentSlug ? 'page' : undefined}>
                        <span class="idx-date">{new Date(post.date).toLocaleDateString()}</span>
                        <span class="idx-title">{post.title}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
</details>

<style>
    .blog-index {
        background: rgba(255, 255, 255, 0.65);
        border: 1px solid rgba(141, 163, 153, 0.25);
        border-radius: 16px;
        box-shadow: 0 5px 20px rgba(45, 58, 54, 0.05);
        overflow: hidden;
    }

    .blog-index summary {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.85rem 1.1rem;
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: #6B7C76;
        cursor: pointer;
        list-style: none;
        border-bottom: 1px solid rgba(141, 163, 153, 0.18);
    }

    .blog-index summary::-webkit-details-marker {
        display: none;
    }

    .blog-index summary::after {
        content: '▾';
        margin-left: auto;
        font-size: 0.7rem;
    }

    .blog-index[open] summary::after {
        content: '▴';
    }

    .index-nav {
        max-height: calc(100vh - 6rem);
        overflow-y: auto;
        padding: 0.9rem 0.6rem 1rem;
    }

    @media (min-width: 1024px) {
        .blog-index {
            position: sticky;
            top: 1.5rem;
        }

        .blog-index summary {
            display: none;
        }

        .blog-index[open] summary {
            display: none;
        }
    }

    .index-heading {
        display: block;
        padding: 0 0.5rem 0.6rem;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        color: var(--color-sage, #8DA399);
    }

    .index-nav ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .index-nav li {
        margin: 0;
        border-left: 3px solid transparent;
        border-radius: 0 10px 10px 0;
    }

    .index-nav a {
        display: block;
        padding: 0.5rem 0.65rem;
        text-decoration: none;
        transition: background 0.2s ease;
    }

    .index-nav a:hover {
        background: rgba(141, 163, 153, 0.12);
    }

    .idx-date {
        display: block;
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        color: var(--color-sage, #8DA399);
    }

    .idx-title {
        display: block;
        font-size: 0.84rem;
        font-weight: 500;
        line-height: 1.35;
        color: var(--color-text, #2D3A36);
    }

    .index-nav li.current {
        border-left-color: var(--color-brick, #A53D28);
        background: rgba(201, 76, 53, 0.07);
    }

    .index-nav li.current .idx-title {
        font-weight: 700;
        color: var(--color-brick, #A53D28);
    }
</style>
