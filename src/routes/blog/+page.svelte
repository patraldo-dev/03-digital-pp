<script>
    import { page } from '$app/stores';
    import SubscribeForm from '$lib/components/SubscribeForm.svelte';

    // Svelte 5: Get props
    let { data } = $props();
    
    // Get translations from page data
    let t = $derived($page.data?.t || {});
</script>

<svelte:head>
    <title>{t.blog_page_title || 'Our Blog'} - ¡Pinche Poutine!</title>
    <meta name="description" content={t.blog_page_subtitle || ''} />
</svelte:head>

<div class="page-header">
    <div class="container">
        <h1>{t.blog_page_title || 'Our Blog'}</h1>
        <p>{t.blog_page_subtitle || 'Insights on web development, design, and digital marketing'}</p>
    </div>
</div>

<div class="container">
    <section class="blog-content">
        {#if data.posts && data.posts.length > 0}
            <div class="posts-grid">
                {#each data.posts as post}
                    <article class="post-card">
                        <div class="post-header">
                            <h2><a href="/blog/{post.slug}">{post.title}</a></h2>
                            <div class="post-meta">
                                <span class="post-date">{new Date(post.date).toLocaleDateString()}</span>
                                <span class="post-author">by {post.author}</span>
                            </div>
                        </div>
                        <div class="post-content">
                            <p class="post-excerpt">{post.excerpt}</p>
                            <a href="/blog/{post.slug}" class="read-more">{t.blog_read_more || 'Read More'} →</a>
                        </div>
                        {#if post.tags && post.tags.length > 0}
                            <div class="post-tags">
                                {#each post.tags as tag}
                                    <span class="tag">{tag}</span>
                                {/each}
                            </div>
                        {/if}
                    </article>
                {/each}
            </div>

            <!-- Pagination -->
            {#if data.pagination && data.pagination.totalPages > 1}
                <div class="pagination">
                    {#if data.pagination.currentPage > 1}
                        <a href="/blog?page={data.pagination.currentPage - 1}" class="pagination-link">← {t.blog_pagination_prev || 'Previous'}</a>
                    {/if}

                    <span class="pagination-info">
                        {t.blog_pagination_page || 'Page'} {data.pagination.currentPage} {t.blog_pagination_of || 'of'} {data.pagination.totalPages}
                    </span>

                    {#if data.pagination.currentPage < data.pagination.totalPages}
                        <a href="/blog?page={data.pagination.currentPage + 1}" class="pagination-link">{t.blog_pagination_next || 'Next'} →</a>
                    {/if}
                </div>
            {/if}
        {:else}
            <div class="no-posts">
                <h2>{t.blog_no_posts_title || 'Coming Soon!'}</h2>
                <p>{t.blog_no_posts_text || 'We\'re working on some great content. Check back soon for our latest insights and articles.'}</p>
                <a href="/contact" class="btn">{t.blog_no_posts_btn || 'Stay Updated'}</a>
            </div>
        {/if}
    </section>

    <!-- Newsletter signup -->
    <section class="newsletter-section">
        <div class="newsletter-content">
            <h2>{t.blog_newsletter_title || 'Never Miss a Post'}</h2>
            <p>{t.blog_newsletter_desc || 'Subscribe to our newsletter and get the latest articles delivered to your inbox.'}</p>
            <div class="newsletter-form">
                <SubscribeForm />
            </div>
        </div>
    </section>
</div>

<style>
    .page-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4rem 0;
        text-align: center;
    }

    .page-header h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 700;
    }

    .page-header p {
        font-size: 1.25rem;
        opacity: 0.9;
    }

    .blog-content {
        padding: 4rem 0;
    }

    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .post-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .post-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }

    .post-header {
        padding: 2rem 2rem 1rem;
    }

    .post-header h2 {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        line-height: 1.3;
    }

    .post-header h2 a {
        color: #2c3e50;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .post-header h2 a:hover {
        color: #007cba;
    }

    .post-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: #666;
    }

    .post-content {
        padding: 0 2rem 1rem;
    }

    .post-excerpt {
        color: #555;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .read-more {
        color: #007cba;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
    }

    .read-more:hover {
        color: #005a8b;
    }

    .post-tags {
        padding: 0 2rem 2rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tag {
        background: #f1f3f4;
        color: #5f6368;
        padding: 0.25rem 0.75rem;
        border-radius: 16px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        margin: 3rem 0;
    }

    .pagination-link {
        color: #007cba;
        text-decoration: none;
        font-weight: 600;
        padding: 0.5rem 1rem;
        border: 2px solid #007cba;
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    .pagination-link:hover {
        background: #007cba;
        color: white;
    }

    .pagination-info {
        color: #666;
        font-size: 0.9rem;
    }

    .no-posts {
        text-align: center;
        padding: 4rem 0;
    }

    .no-posts h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 2rem;
    }

    .no-posts p {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 2rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .newsletter-section {
        background: #f8f9fa;
        padding: 4rem 2rem;
        border-radius: 12px;
        text-align: center;
        margin: 4rem 0;
    }

    .newsletter-content h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 2rem;
    }

    .newsletter-content p {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 2rem;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .newsletter-form {
        max-width: 400px;
        margin: 0 auto;
    }

    @media (max-width: 768px) {
        .page-header h1 {
            font-size: 2rem;
        }

        .posts-grid {
            grid-template-columns: 1fr;
        }

        .pagination {
            flex-direction: column;
            gap: 1rem;
        }

        .newsletter-content h2,
        .no-posts h2 {
            font-size: 1.5rem;
        }
    }
</style>
