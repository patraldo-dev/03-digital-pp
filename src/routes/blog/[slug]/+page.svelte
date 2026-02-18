<script>
    import { page } from '$app/stores';

    // Svelte 5: Get props
    let { data } = $props();
    
    // Get translations from page data
    let t = $derived($page.data?.t || {});
</script>

<svelte:head>
    <title>{data.post?.title} - ¡Pinche Poutine!</title>
    <meta name="description" content={data.post?.excerpt} />
</svelte:head>

<article class="blog-post">
    <div class="container">
        <header class="post-header">
            <a href="/blog" class="back-link">← {t.blog_post_back || 'Back to Blog'}</a>
            <h1>{data.post?.title}</h1>
            <div class="post-meta">
                <span class="post-date">{new Date(data.post?.date).toLocaleDateString()}</span>
                <span class="post-author">by {data.post?.author}</span>
            </div>
            {#if data.post?.tags && data.post.tags.length > 0}
                <div class="post-tags">
                    {#each data.post.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            {/if}
        </header>

        <div class="post-content">
            {@html data.post?.htmlContent}
        </div>

        <footer class="post-footer">
            {#if data.previousPost || data.nextPost}
                <nav class="post-navigation">
                    {#if data.previousPost}
                        <a href="/blog/{data.previousPost.slug}" class="nav-link prev">
                            <span class="nav-label">← {t.blog_post_prev || 'Previous'}</span>
                            <span class="nav-title">{data.previousPost.title}</span>
                        </a>
                    {/if}
                    {#if data.nextPost}
                        <a href="/blog/{data.nextPost.slug}" class="nav-link next">
                            <span class="nav-label">{t.blog_post_next || 'Next'} →</span>
                            <span class="nav-title">{data.nextPost.title}</span>
                        </a>
                    {/if}
                </nav>
            {/if}
        </footer>
    </div>
</article>

<style>
    .blog-post {
        padding: 2rem 0 4rem;
        min-height: calc(100vh - 200px);
    }

    .post-header {
        max-width: 800px;
        margin: 0 auto 3rem;
        padding: 0 1rem;
    }

    .back-link {
        display: inline-block;
        color: #666;
        text-decoration: none;
        margin-bottom: 2rem;
        transition: color 0.3s ease;
    }

    .back-link:hover {
        color: #007cba;
    }

    .post-header h1 {
        font-size: 2.5rem;
        line-height: 1.2;
        color: #2c3e50;
        margin: 0 0 1.5rem 0;
    }

    .post-meta {
        display: flex;
        gap: 1.5rem;
        color: #666;
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
    }

    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tag {
        background: #f1f3f4;
        color: #5f6368;
        padding: 0.35rem 0.85rem;
        border-radius: 16px;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .post-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
        line-height: 1.8;
        color: #333;
    }

    .post-content :global(h1),
    .post-content :global(h2),
    .post-content :global(h3) {
        color: #2c3e50;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.3;
    }

    .post-content :global(h1) {
        font-size: 2rem;
        border-bottom: 2px solid #eee;
        padding-bottom: 0.5rem;
    }

    .post-content :global(h2) {
        font-size: 1.5rem;
    }

    .post-content :global(h3) {
        font-size: 1.25rem;
    }

    .post-content :global(p) {
        margin-bottom: 1.5rem;
    }

    .post-content :global(ul),
    .post-content :global(ol) {
        margin-bottom: 1.5rem;
        padding-left: 2rem;
    }

    .post-content :global(li) {
        margin-bottom: 0.5rem;
    }

    .post-content :global(pre) {
        background: #f6f8fa;
        padding: 1.5rem;
        border-radius: 8px;
        overflow-x: auto;
        margin-bottom: 1.5rem;
    }

    .post-content :global(code) {
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.9em;
    }

    .post-content :global(p code) {
        background: #f6f8fa;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
    }

    .post-content :global(a) {
        color: #007cba;
        text-decoration: none;
    }

    .post-content :global(a:hover) {
        text-decoration: underline;
    }

    .post-content :global(blockquote) {
        border-left: 4px solid #007cba;
        padding-left: 1.5rem;
        margin: 1.5rem 0;
        color: #666;
        font-style: italic;
    }

    .post-footer {
        max-width: 800px;
        margin: 4rem auto 0;
        padding: 0 1rem;
    }

    .post-navigation {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        border-top: 1px solid #eee;
        padding-top: 2rem;
    }

    .nav-link {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border-radius: 8px;
        background: #f8f9fa;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .nav-link:hover {
        background: #e9ecef;
    }

    .nav-link.prev {
        align-items: flex-start;
    }

    .nav-link.next {
        align-items: flex-end;
        text-align: right;
    }

    .nav-label {
        font-size: 0.85rem;
        color: #666;
        margin-bottom: 0.5rem;
    }

    .nav-title {
        font-weight: 600;
        color: #2c3e50;
        font-size: 1rem;
    }

    @media (max-width: 768px) {
        .post-header h1 {
            font-size: 1.75rem;
        }

        .post-meta {
            flex-direction: column;
            gap: 0.5rem;
        }

        .post-navigation {
            grid-template-columns: 1fr;
        }

        .post-content :global(h1) {
            font-size: 1.5rem;
        }

        .post-content :global(h2) {
            font-size: 1.25rem;
        }
    }
</style>
