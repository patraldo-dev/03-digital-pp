<svelte:head>
    <title>{t.meta_title} - ¡Pinche Poutine! Digital</title>
    <meta name="description" content={t.meta_description} />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700;900&display=swap" rel="stylesheet">
</svelte:head>

<div class="bg-wrap">
    <!-- Soft Organic Background Shapes -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
</div>

<div class="hero">
    <div class="container">
        <div class="hero-content">
            <div class="badge">🌶️ & 🍁 • North American Web & Animation</div>
            <h1>
                <span class="gradient-text">{t.hero_title}</span>
            </h1>
            <p class="hero-subtitle">{t.hero_subtitle}</p>
            <div class="hero-actions">
                <a href="/services" class="btn btn-primary">
                    {t.btn_services}
                    <span class="arrow">→</span>
                </a>
                <a href="/contact" class="btn btn-secondary">{t.btn_contact}</a>
            </div>
        </div>
    </div>
</div>

<!-- Funky Marquee Banner - Sage & Dark Green -->
<div class="marquee">
    <div class="marquee-content">
        <span>SVELTEKIT 5</span> • <span>CLOUDFLARE WORKERS</span> • <span>FFMPEG ANIMATION</span> • 
        <span>LUCIA AUTH</span> • <span>CHROMEBOOK DEV</span> • <span>SVELTEKIT 5</span> • 
        <span>CLOUDFLARE WORKERS</span> • <span>FFMPEG ANIMATION</span> • 
        <span>LUCIA AUTH</span> • <span>CHROMEBOOK DEV</span>
    </div>
</div>

<section class="features">
    <div class="container">
        <div class="section-header">
            <h2>{t.features_title}</h2>
            <div class="line"></div>
        </div>
        
        <div class="features-grid">
            <!-- Card 1 -->
            <div class="feature-card group">
                <div class="icon-wrapper">
                    <span class="icon">🎨</span>
                </div>
                <h3>{t.feature_anim_title}</h3>
                <p>{t.feature_anim_desc}</p>
            </div>
            
            <!-- Card 2 -->
            <div class="feature-card group">
                <div class="icon-wrapper">
                    <span class="icon">🚀</span>
                </div>
                <h3>{t.feature_web_title}</h3>
                <p>{t.feature_web_desc}</p>
            </div>
            
            <!-- Card 3 -->
            <div class="feature-card group">
                <div class="icon-wrapper">
                    <span class="icon">⚡</span>
                </div>
                <h3>{t.feature_stack_title}</h3>
                <p>{t.feature_stack_desc}</p>
            </div>
        </div>
    </div>
</section>

<!-- Brick Red Newsletter Section -->
<section class="newsletter-section">
    <div class="container">
        <div class="newsletter-box">
            <div class="newsletter-content">
                <h2>{t.newsletter_title}</h2>
                <p>{t.newsletter_subtitle}</p>
                <div class="newsletter-form-wrapper">
                    <SubscribeForm />
                </div>
            </div>
            <!-- Decorative Element -->
            <div class="newsletter-decoration">
                <div class="circle c1"></div>
                <div class="circle c2"></div>
                <div class="circle c3"></div>
            </div>
        </div>
    </div>
</section>

<section class="recent-posts">
    <div class="container">
        <div class="section-header">
            <h2>{t.blog_title}</h2>
            <div class="line"></div>
        </div>

        {#if data.recentPosts && data.recentPosts.length > 0}
            <div class="posts-grid">
                {#each data.recentPosts as post}
                    <article class="post-card">
                        <div class="post-top">
                            <span class="post-tag">Blog</span>
                            <span class="post-date">{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <h3><a href="/blog/{post.slug}">{post.title}</a></h3>
                        <p class="post-excerpt">{post.excerpt}</p>
                        <a href="/blog/{post.slug}" class="read-more">Read Story</a>
                    </article>
                {/each}
            </div>
            <div class="blog-link">
                <a href="/blog" class="btn-text">{t.blog_btn}</a>
            </div>
        {:else}
            <div class="empty-state">
                <p>{t.blog_empty}</p>
            </div>
        {/if}
    </div>
</section>

<script>
    import SubscribeForm from '$lib/components/SubscribeForm.svelte';
    
    export let data;
    $: t = data.t || {};
</script>

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

    /* --- Background Blobs (Sage & Light Brick) --- */
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
        background: #E8D5C4; /* Darker cream/terracotta mix */
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

    /* --- Hero Section --- */
    .hero {
        min-height: 90vh;
        display: flex;
        align-items: center;
        position: relative;
    }

    .badge {
        display: inline-block;
        padding: 0.6rem 1.5rem;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(45, 58, 54, 0.1);
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 700;
        margin-bottom: 2rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--color-brick);
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    .hero h1 {
        font-size: clamp(3rem, 8vw, 6rem);
        line-height: 0.95;
        font-weight: 900;
        margin-bottom: 1.5rem;
        color: var(--color-text);
    }

    /* Text Gradient: Brick to Sage */
    .gradient-text {
        background: linear-gradient(135deg, var(--color-brick) 0%, var(--color-sage) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .hero-subtitle {
        font-size: 1.4rem;
        max-width: 650px;
        color: #5F6E68; /* Muted text color */
        margin-bottom: 3rem;
        line-height: 1.6;
        font-weight: 300;
    }

    .hero-actions {
        display: flex;
        gap: 1.5rem;
    }

    /* Buttons */
    .btn {
        display: inline-flex;
        align-items: center;
        padding: 1rem 2.5rem;
        font-weight: 700;
        text-decoration: none;
        border-radius: 100px;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-size: 1.1rem;
        border: none;
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

    .btn-primary .arrow {
        margin-left: 0.5rem;
        transition: transform 0.3s ease;
    }

    .btn-primary:hover .arrow {
        transform: translateX(5px);
    }

    .btn-secondary {
        background: var(--color-white);
        color: var(--color-brick);
        border: 2px solid var(--color-brick);
    }

    .btn-secondary:hover {
        background: var(--color-text);
        border-color: var(--color-text);
        color: var(--color-white);
    }

    /* --- Marquee --- */
    .marquee {
        background: var(--color-sage);
        color: #2F3E38;
        padding: 1.25rem 0;
        transform: rotate(-1deg) scale(1.02);
        margin-bottom: 6rem;
        overflow: hidden;
        white-space: nowrap;
        border-top: 4px solid var(--color-brick);
        border-bottom: 4px solid var(--color-brick);
        box-shadow: 0 10px 30px rgba(45, 58, 54, 0.15);
        z-index: 5;
        position: relative;
    }

    .marquee-content {
        display: inline-block;
        animation: scroll 25s linear infinite;
        font-weight: 900;
        font-size: 1.3rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }

    /* --- Section Headers --- */
    .section-header {
        text-align: center;
        margin-bottom: 4rem;
    }

    .section-header h2 {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 1rem;
        color: var(--color-text);
    }

    .line {
        width: 80px;
        height: 6px;
        background: var(--color-brick);
        margin: 0 auto;
        border-radius: 10px;
    }

    /* --- Features Grid --- */
    .features {
        padding: 0 0 6rem;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2.5rem;
    }

    .feature-card {
        background: var(--color-white);
        padding: 3rem 2.5rem;
        border-radius: 30px;
        border: 1px solid rgba(45, 58, 54, 0.05);
        transition: all 0.4s ease;
        position: relative;
        box-shadow: 0 10px 30px rgba(45, 58, 54, 0.05);
    }

    .feature-card:hover {
        transform: translateY(-10px);
        border-color: rgba(141, 163, 153, 0.4);
        box-shadow: 0 20px 40px rgba(141, 163, 153, 0.2);
    }

    .icon-wrapper {
        width: 80px;
        height: 80px;
        background: rgba(201, 76, 53, 0.1); /* Light brick bg */
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2rem;
        font-size: 2.5rem;
        color: var(--color-brick);
    }

    .feature-card h3 {
        font-size: 1.6rem;
        margin-bottom: 1rem;
        font-weight: 700;
        color: var(--color-text);
    }

    .feature-card p {
        color: #6B7C76;
        line-height: 1.7;
        font-size: 1.05rem;
    }

    /* --- Newsletter --- */
    .newsletter-section {
        padding: 4rem 0;
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
        margin-bottom: 2.5rem;
    }

    .newsletter-form-wrapper {
        width: 100%;
        max-width: 450px;
    }

    /* Decorative Circles */
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
        background: #fff;
    }
    
    .c1 { width: 250px; height: 250px; top: 20%; right: 20%; }
    .c2 { width: 180px; height: 180px; bottom: 20%; right: 40%; }
    .c3 { width: 100px; height: 100px; top: 10%; right: 60%; }

    /* --- Blog --- */
    .recent-posts {
        padding: 6rem 0;
    }

    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
    }

    .post-card {
        background: var(--color-white);
        border-radius: 24px;
        padding: 2rem;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(45, 58, 54, 0.05);
        box-shadow: 0 5px 20px rgba(45, 58, 54, 0.03);
    }

    .post-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(201, 76, 53, 0.1);
        border-color: rgba(201, 76, 53, 0.2);
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
        color: #fff;
        padding: 6px 14px;
        border-radius: 50px;
    }

    .post-date {
        color: #999;
        font-weight: 500;
    }

    .post-card h3 {
        font-size: 1.5rem;
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
        line-height: 1.6;
        flex-grow: 1;
    }

    .read-more {
        color: var(--color-brick);
        text-decoration: none;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        font-size: 0.95rem;
    }

    .read-more::after {
        content: '→';
        margin-left: 0.5rem;
        transition: margin 0.3s;
    }

    .read-more:hover::after {
        margin-left: 0.8rem;
    }

    .blog-link {
        text-align: center;
        margin-top: 4rem;
    }

    .btn-text {
        color: var(--color-text);
        font-size: 1.1rem;
        font-weight: 800;
        text-decoration: none;
        border-bottom: 3px solid var(--color-sage);
        padding-bottom: 2px;
        transition: all 0.3s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .btn-text:hover {
        color: var(--color-brick);
        border-color: var(--color-brick);
    }

    .empty-state {
        text-align: center;
        padding: 4rem;
        color: #888;
        font-size: 1.25rem;
        background: rgba(255,255,255,0.5);
        border-radius: 20px;
        border: 2px dashed rgba(45, 58, 54, 0.1);
    }

    /* Mobile Adjustments */
    @media (max-width: 768px) {
        .hero h1 {
            font-size: 3.5rem;
        }
        
        .hero-actions {
            flex-direction: column;
        }

        .btn {
            width: 100%;
            justify-content: center;
        }

        .newsletter-box {
            padding: 2.5rem 2rem;
            text-align: center;
        }

        .newsletter-content {
            max-width: 100%;
        }

        .newsletter-decoration {
            display: none;
        }
    }
</style>
