<script>
    import { page } from '$app/stores';
    import SubscribeForm from '$lib/components/SubscribeForm.svelte';

    // Svelte 5: Get props
    let { data } = $props();
    
    // Get translations from page data
    let t = $derived($page.data?.t || {});
</script>

<svelte:head>
    <title>{t.blog_page_title || 'Our Blog'} - ¡Pinche Poutine! Digital</title>
    <meta name="description" content={t.blog_page_subtitle || ''} />
</svelte:head>

<!-- Background Blobs -->
<div class="bg-wrap">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
</div>

<div class="page-header">
    <div class="container">
        <div class="badge">📝 Blog</div>
        <h1>{t.blog_page_title || 'Our Blog'}</h1>
        <p class="subtitle">{t.blog_page_subtitle || 'Insights on web development, design, and digital marketing'}</p>
    </div>
</div>

<div class="container">
    <section class="blog-content">
        {#if data.posts && data.posts.length > 0}
            <div class="posts-grid">
                {#each data.posts as post}
                    <article class="post-card">
                        <div class="post-top">
                            <span class="post-tag">{t.blog_tag || 'Blog'}</span>
                            <span class="post-date">{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <h3><a href="/blog/{post.slug}">{post.title}</a></h3>
                        <p class="post-excerpt">{post.excerpt}</p>
                        <a href="/blog/{post.slug}" class="read-more">{t.blog_read_story || 'Read Story'} <span class="arrow">→</span></a>
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
            <div class="empty-state">
                <h2>{t.blog_no_posts_title || 'Coming Soon!'}</h2>
                <p>{t.blog_no_posts_text || 'We\'re working on some great content. Check back soon for our latest insights and articles.'}</p>
                <a href="/contact" class="btn btn-primary">{t.blog_no_posts_btn || 'Stay Updated'}</a>
            </div>
        {/if}
    </section>

    <!-- Newsletter signup -->
    <section class="newsletter-section">
        <div class="container">
            <div class="newsletter-box">
                <div class="newsletter-content">
                    <h2>{t.blog_newsletter_title || 'Never Miss a Post'}</h2>
                    <p>{t.blog_newsletter_desc || 'Subscribe to our newsletter and get the latest articles delivered to your inbox.'}</p>
                </div>
                <div class="newsletter-form-wrapper">
                    <SubscribeForm />
                </div>
                <div class="newsletter-decoration">
                    <div class="circle c1"></div>
                    <div class="circle c2"></div>
                    <div class="circle c3"></div>
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    /* --- Palette Definition --- */
    :root {
        --color-bg: #F9F6F0;        /* Creamy White */
        --color-text: #2D3A36;      /* Deep Dark Green/Slate */
        --color-brick: #C94C35;     /* Vibrant Brick Red */
        --color-sage: #8DA399;      /* Muted Sage Green */
        --color-white: #FFFFFF;
    }

    :global(body) {
        font-family: 'Outfit', sans-serif;
        background-color: var(--color-bg);
        color: var(--color-text);
        overflow-x: hidden;
    }

    /* --- Background Blobs --- */
    .bg-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    }

    .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(90px);
        opacity: 0.6;
        animation: float 12s infinite ease-in-out;
    }

    .blob-1 {
        width: 600px;
        height: 600px;
        background: var(--color-sage);
        top: -150px;
        right: -100px;
        opacity: 0.4;
    }

    .blob-2 {
        width: 500px;
        height: 500px;
        background: #E8D5C4;
        bottom: -100px;
        left: -100px;
        animation-delay: -6s;
        opacity: 0.6;
    }

    @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(40px, 60px); }
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        position: relative;
        z-index: 2;
    }

    /* --- Page Header --- */
    .page-header {
        background: linear-gradient(135deg, var(--color-text) 0%, #1a201e 100%);
        color: var(--color-white);
        padding: 6rem 0 4rem;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .badge {
        display: inline-block;
        padding: 0.6rem 1.5rem;
        background: rgba(201, 76, 53, 0.2);
        backdrop-filter: blur(12px);
        border: 1px solid var(--color-brick);
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 700;
        margin-bottom: 2rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--color-brick);
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    .page-header h1 {
        font-size: clamp(2.5rem, 6vw, 4rem);
        margin-bottom: 1rem;
        font-weight: 800;
        line-height: 1.1;
        color: var(--color-white);
    }

    .subtitle {
        font-size: 1.25rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.9);
    }

    /* --- Blog Content --- */
    .blog-content {
        padding: 4rem 0 6rem;
    }

    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2.5rem;
        margin-bottom: 4rem;
    }

    .post-card {
        background: var(--color-white);
        border-radius: 30px;
        padding: 2.5rem;
        transition: all 0.4s ease;
        border: 1px solid rgba(45, 58, 54, 0.05);
        box-shadow: 0 10px 30px rgba(45, 58, 54, 0.05);
        display: flex;
        flex-direction: column;
    }

    .post-card:hover {
        transform: translateY(-10px);
        border-color: rgba(141, 163, 153, 0.4);
        box-shadow: 0 20px 40px rgba(141, 163, 153, 0.2);
    }

    .post-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        font-size: 0.85rem;
        font-weight: 700;
    }

    .post-tag {
        background: var(--color-sage);
        color: var(--color-white);
        padding: 6px 14px;
        border-radius: 50px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .post-date {
        color: #999;
        font-weight: 500;
    }

    .post-card h3 {
        font-size: 1.6rem;
        margin-bottom: 1rem;
        font-weight: 700;
        line-height: 1.3;
        color: var(--color-text);
    }

    .post-card h3 a {
        color: var(--color-text);
        text-decoration: none;
        transition: color 0.2s;
    }

    .post-card h3 a:hover {
        color: var(--color-brick);
    }

    .post-excerpt {
        color: #6B7C76;
        margin-bottom: 2rem;
        line-height: 1.7;
        font-size: 1.05rem;
        flex-grow: 1;
    }

    .read-more {
        color: var(--color-brick);
        text-decoration: none;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .read-more .arrow {
        margin-left: 0.5rem;
        transition: transform 0.3s ease;
    }

    .read-more:hover {
        color: #A83926;
    }

    .read-more:hover .arrow {
        transform: translateX(5px);
    }

    /* --- Pagination --- */
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        margin: 3rem 0;
    }

    .pagination-link {
        color: var(--color-brick);
        text-decoration: none;
        font-weight: 700;
        padding: 0.75rem 1.5rem;
        border: 2px solid var(--color-brick);
        border-radius: 100px;
        transition: all 0.3s ease;
        font-size: 1rem;
    }

    .pagination-link:hover {
        background: var(--color-brick);
        color: var(--color-white);
        transform: translateY(-2px);
    }

    .pagination-info {
        color: #666;
        font-size: 0.95rem;
        font-weight: 500;
    }

    /* --- Empty State --- */
    .empty-state {
        text-align: center;
        padding: 5rem 2rem;
        background: var(--color-white);
        border-radius: 30px;
        border: 2px dashed rgba(141, 163, 153, 0.3);
        box-shadow: 0 10px 30px rgba(45, 58, 54, 0.05);
    }

    .empty-state h2 {
        color: var(--color-text);
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
    }

    .empty-state p {
        color: #6B7C76;
        font-size: 1.15rem;
        margin-bottom: 2.5rem;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.7;
    }

    /* --- Newsletter Section --- */
    .newsletter-section {
        padding: 4rem 0 6rem;
    }

    .newsletter-box {
        background: var(--color-brick);
        border-radius: 40px;
        padding: 4.5rem;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 2rem;
        box-shadow: 0 25px 50px -12px rgba(201, 76, 53, 0.4);
    }

    .newsletter-content {
        max-width: 600px;
        position: relative;
        z-index: 2;
        color: var(--color-white);
    }

    .newsletter-content h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        line-height: 1.1;
    }

    .newsletter-content p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.2rem;
        margin-bottom: 0;
        line-height: 1.6;
    }

    .newsletter-form-wrapper {
        width: 100%;
        max-width: 450px;
        position: relative;
        z-index: 2;
    }

    .newsletter-decoration {
        position: absolute;
        right: -50px;
        top: -50px;
        bottom: -50px;
        width: 350px;
        z-index: 1;
        opacity: 0.2;
    }

    .circle {
        position: absolute;
        border-radius: 50%;
        background: var(--color-white);
    }

    .c1 { width: 250px; height: 250px; top: 20%; right: 20%; }
    .c2 { width: 180px; height: 180px; bottom: 20%; right: 40%; }
    .c3 { width: 100px; height: 100px; top: 10%; right: 60%; }

    /* --- Buttons --- */
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 1rem 2.5rem;
        font-weight: 700;
        text-decoration: none;
        border-radius: 100px;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-size: 1.1rem;
        border: none;
        cursor: pointer;
    }

    .btn-primary {
        background: var(--color-brick);
        color: var(--color-white);
        box-shadow: 0 10px 25px rgba(201, 76, 53, 0.3);
    }

    .btn-primary:hover {
        background: #A83926;
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 15px 35px rgba(201, 76, 53, 0.4);
    }

    @media (max-width: 768px) {
        .page-header {
            padding: 5rem 0 3rem;
        }

        .page-header h1 {
            font-size: 2.5rem;
        }

        .subtitle {
            font-size: 1.1rem;
        }

        .posts-grid {
            grid-template-columns: 1fr;
        }

        .pagination {
            flex-direction: column;
            gap: 1rem;
        }

        .newsletter-box {
            padding: 3rem 2rem;
            text-align: center;
        }

        .newsletter-content {
            max-width: 100%;
        }

        .newsletter-decoration {
            display: none;
        }

        .empty-state h2 {
            font-size: 2rem;
        }
    }
</style>
