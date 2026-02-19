<script>
    import SubscribeForm from '$lib/components/SubscribeForm.svelte';
    import { page } from '$app/stores';

    let { data } = $props();
    let t = $derived($page.data?.t || {});
</script>

<svelte:head>
    <title>{t.meta_title || 'Home'} - ¡Pinche Poutine! Digital</title>
    <meta name="description" content={t.meta_description || ''} />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700;900&display=swap" rel="stylesheet">
</svelte:head>

<!-- Background Blobs -->
<div class="bg-wrap">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
</div>

<!-- Hero Section -->
<div class="hero">
    <div class="container">
        <div class="hero-content">
            <div class="badge">🌶️ & 🍁 • Guadalajara, México</div>
            <h1>
                <span class="gradient-text">One-Person Studio</span>
            </h1>
            <p class="hero-subtitle">
                I build edge-native web apps and automate creative workflows. 
                SvelteKit 5, Cloudflare, Bash, FFMPEG—no GUI required.
            </p>
            <div class="hero-actions">
                <a href="#projects" class="btn btn-primary">
                    See My Work
                    <span class="arrow">→</span>
                </a>
                <a href="/services" class="btn btn-secondary">Let's Collaborate</a>
            </div>
        </div>
    </div>
</div>

<!-- About Section -->
<section class="about-section">
    <div class="container">
        <div class="about-box">
            <div class="about-content">
                <h2>👋 About Me</h2>
                <p class="about-text">
                    I live in <strong>Guadalajara, México</strong> and like in-person 
                    collaboration best—at least to start or at some point in the process.
                </p>
                <p class="about-text">
                    I'm semi-retired and intentionally selective about what I work on. 
                    That said, if you've got an interesting project and we get along, 
                    I'm open to collaborating.
                </p>
                <p class="about-text">
                    <strong>My workflow:</strong> Terminal-first, AI-assisted, and 
                    mouse-optional. If it has a GUI, I probably don't use it.
                </p>
            </div>
            <div class="about-decoration">
                <div class="circle c1"></div>
                <div class="circle c2"></div>
            </div>
        </div>
    </div>
</section>

<!-- Projects Section -->
<section class="projects-section" id="projects">
    <div class="container">
        <div class="section-header">
            <h2>🎨 Selected Projects</h2>
            <div class="line"></div>
        </div>

        <div class="projects-grid">
            <!-- Antoine Patraldo -->
            <a href="https://antoine.patraldo.com" target="_blank" rel="noopener" class="project-card featured">
                <div class="project-badge">Featured</div>
                <div class="project-header">
                    <span class="project-emoji">🎨</span>
                    <h3>antoine.patraldo.com</h3>
                </div>
                <p class="project-desc">
                    Digital gallery for illustrator Antoine Patraldo. SvelteKit 5, 
                    Cloudflare Workers, DIY auth (Web Crypto API), FFMPEG + Bash 
                    for video processing. Zero GUI, zero traditional servers.
                </p>
                <div class="project-tech">
                    <span class="tech-tag">SvelteKit 5</span>
                    <span class="tech-tag">Cloudflare</span>
                    <span class="tech-tag">Web Crypto</span>
                    <span class="tech-tag">FFMPEG</span>
                </div>
                <span class="project-link">Visit Site →</span>
            </a>

            <!-- Pinche Poutine -->
            <a href="https://pinchepoutine.digital" target="_blank" rel="noopener" class="project-card">
                <div class="project-header">
                    <span class="project-emoji">🌶️</span>
                    <h3>pinchepoutine.digital</h3>
                </div>
                <p class="project-desc">
                    This site. Creative web development and animation projects. 
                    SvelteKit 5 on Cloudflare with full i18n (EN/FR/ES), 
                    DIY email subscription, and blog with Mermaid diagrams.
                </p>
                <div class="project-tech">
                    <span class="tech-tag">SvelteKit 5</span>
                    <span class="tech-tag">i18n</span>
                    <span class="tech-tag">Cloudflare D1</span>
                    <span class="tech-tag">Mailgun</span>
                </div>
                <span class="project-link">You're Here →</span>
            </a>

            <!-- Patrouch.ca -->
            <a href="https://patrouch.ca" target="_blank" rel="noopener" class="project-card">
                <div class="project-header">
                    <span class="project-emoji">🍁</span>
                    <h3>patrouch.ca</h3>
                </div>
                <p class="project-desc">
                    Personal portfolio and digital presence. Clean, fast, 
                    edge-native architecture with minimal dependencies 
                    and maximum performance.
                </p>
                <div class="project-tech">
                    <span class="tech-tag">SvelteKit</span>
                    <span class="tech-tag">Edge-Native</span>
                    <span class="tech-tag">Minimal</span>
                    <span class="tech-tag">Fast</span>
                </div>
                <span class="project-link">Visit Site →</span>
            </a>
        </div>

        <div class="projects-cta">
            <p>Want something similar?</p>
            <a href="/services" class="btn-text">Let's Talk →</a>
        </div>
    </div>
</section>

<!-- How I Work Section -->
<section class="process-section">
    <div class="container">
        <div class="section-header">
            <h2>⚙️ How I Work</h2>
            <div class="line"></div>
        </div>

        <div class="process-grid">
            <div class="process-item">
                <div class="process-icon">💻</div>
                <h3>Terminal-First</h3>
                <p>Bash + Vim + FFMPEG. If it has a GUI, I probably don't use it.</p>
            </div>
            <div class="process-item">
                <div class="process-icon">⚡</div>
                <h3>SvelteKit 5</h3>
                <p>Runes, JSDoc, no TypeScript drama. Clean, fast, edge-native.</p>
            </div>
            <div class="process-item">
                <div class="process-icon">☁️</div>
                <h3>Cloudflare Edge</h3>
                <p>Workers, D1, Images, Stream—no traditional servers.</p>
            </div>
            <div class="process-item">
                <div class="process-icon">🤖</div>
                <h3>AI-Assisted</h3>
                <p>I pair-program with AI agents. They don't complain about my hours.</p>
            </div>
        </div>
    </div>
</section>

<!-- Newsletter Section -->
<section class="newsletter-section">
    <div class="container">
        <div class="newsletter-box">
            <div class="newsletter-content">
                <h2>{t.newsletter_title || 'Stay Connected'}</h2>
                <p>{t.newsletter_subtitle || 'Subscribe for the latest tips on animation and web development.'}</p>
                <div class="newsletter-form-wrapper">
                    <SubscribeForm />
                </div>
            </div>
            <div class="newsletter-decoration">
                <div class="circle c1"></div>
                <div class="circle c2"></div>
                <div class="circle c3"></div>
            </div>
        </div>
    </div>
</section>

<!-- Blog Section -->
<section class="recent-posts">
    <div class="container">
        <div class="section-header">
            <h2>{t.blog_title || 'Latest Insights'}</h2>
            <div class="line"></div>
        </div>

        {#if data.recentPosts && data.recentPosts.length > 0}
            <div class="posts-grid">
                {#each data.recentPosts as post}
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
            <div class="blog-link">
                <a href="/blog" class="btn-text">{t.blog_btn || 'View All Posts'} →</a>
            </div>
        {:else}
            <div class="empty-state">
                <p>{t.blog_empty || 'No recent posts available.'}</p>
            </div>
        {/if}
    </div>
</section>

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

    /* --- Hero --- */
    .hero {
        min-height: 90vh;
        display: flex;
        align-items: center;
        position: relative;
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

    .hero h1 {
        font-size: clamp(3rem, 8vw, 6rem);
        line-height: 0.95;
        font-weight: 900;
        margin-bottom: 1.5rem;
        color: var(--color-text);
    }

    .gradient-text {
        background: linear-gradient(135deg, var(--color-brick) 0%, var(--color-sage) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .hero-subtitle {
        font-size: 1.4rem;
        max-width: 650px;
        color: #5F6E68;
        margin-bottom: 3rem;
        line-height: 1.6;
        font-weight: 300;
    }

    .hero-actions {
        display: flex;
        gap: 1.5rem;
    }

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

    /* --- About Section --- */
    .about-section {
        padding: 5rem 0;
    }

    .about-box {
        background: var(--color-white);
        padding: 4rem;
        border-radius: 40px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(45, 58, 54, 0.08);
    }

    .about-content {
        max-width: 800px;
        position: relative;
        z-index: 2;
    }

    .about-content h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 2rem;
        color: var(--color-text);
    }

    .about-text {
        font-size: 1.15rem;
        line-height: 1.8;
        color: #5F6E68;
        margin-bottom: 1.5rem;
    }

    .about-text strong {
        color: var(--color-text);
        font-weight: 700;
    }

    .about-decoration {
        position: absolute;
        right: -50px;
        top: -50px;
        bottom: -50px;
        width: 400px;
        z-index: 1;
        opacity: 0.1;
    }

    .circle {
        position: absolute;
        border-radius: 50%;
        background: var(--color-sage);
    }

    .c1 { width: 300px; height: 300px; top: 20%; right: 10%; }
    .c2 { width: 200px; height: 200px; bottom: 10%; right: 40%; }

    /* --- Projects Section --- */
    .projects-section {
        padding: 6rem 0;
    }

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

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2.5rem;
        margin-bottom: 3rem;
    }

    .project-card {
        background: var(--color-white);
        padding: 2.5rem;
        border-radius: 24px;
        text-decoration: none;
        color: inherit;
        box-shadow: 0 5px 20px rgba(45, 58, 54, 0.05);
        border: 1px solid rgba(45, 58, 54, 0.05);
        transition: all 0.4s ease;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .project-card:hover {
        transform: translateY(-8px);
        border-color: rgba(141, 163, 153, 0.4);
        box-shadow: 0 20px 40px rgba(141, 163, 153, 0.2);
    }

    .project-card.featured {
        border-color: var(--color-brick);
        border-width: 2px;
    }

    .project-badge {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background: var(--color-brick);
        color: var(--color-white);
        padding: 0.4rem 1rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .project-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .project-emoji {
        font-size: 2.5rem;
    }

    .project-header h3 {
        font-size: 1.4rem;
        font-weight: 700;
        margin: 0;
        color: var(--color-text);
    }

    .project-desc {
        color: #6B7C76;
        line-height: 1.7;
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
        flex-grow: 1;
    }

    .project-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .tech-tag {
        background: rgba(141, 163, 153, 0.15);
        color: var(--color-sage);
        padding: 0.4rem 0.9rem;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .project-link {
        color: var(--color-brick);
        font-weight: 700;
        font-size: 1rem;
        text-decoration: none;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
    }

    .project-link:after {
        content: '→';
        margin-left: 0.5rem;
        transition: transform 0.3s ease;
    }

    .project-card:hover .project-link {
        color: #A83926;
    }

    .project-card:hover .project-link:after {
        transform: translateX(5px);
    }

    .projects-cta {
        text-align: center;
        margin-top: 3rem;
    }

    .projects-cta p {
        font-size: 1.15rem;
        color: #5F6E68;
        margin-bottom: 1rem;
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

    /* --- Process Section --- */
    .process-section {
        padding: 6rem 0;
        background: rgba(141, 163, 153, 0.08);
        margin: 0 -2rem;
        padding-left: 2rem;
        padding-right: 2rem;
    }

    .process-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2.5rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .process-item {
        background: var(--color-white);
        padding: 2.5rem;
        border-radius: 24px;
        text-align: center;
        box-shadow: 0 5px 20px rgba(45, 58, 54, 0.05);
        transition: all 0.3s ease;
    }

    .process-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(141, 163, 153, 0.2);
    }

    .process-icon {
        font-size: 3.5rem;
        margin-bottom: 1rem;
    }

    .process-item h3 {
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--color-text);
    }

    .process-item p {
        color: #6B7C76;
        line-height: 1.6;
        font-size: 1rem;
    }

    /* --- Newsletter --- */
    .newsletter-section {
        padding: 6rem 0;
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

    /* --- Blog --- */
    .recent-posts {
        padding: 6rem 0;
    }

    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2.5rem;
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

    .blog-link {
        text-align: center;
        margin-top: 4rem;
    }

    .empty-state {
        text-align: center;
        padding: 5rem 2rem;
        background: var(--color-white);
        border-radius: 30px;
        border: 2px dashed rgba(141, 163, 153, 0.3);
    }

    .empty-state p {
        color: #6B7C76;
        font-size: 1.15rem;
    }

    @media (max-width: 768px) {
        .hero h1 {
            font-size: 3.5rem;
        }

        .hero-subtitle {
            font-size: 1.2rem;
        }

        .hero-actions {
            flex-direction: column;
        }

        .btn {
            width: 100%;
        }

        .about-box {
            padding: 2.5rem;
        }

        .about-content h2 {
            font-size: 2rem;
        }

        .about-decoration {
            display: none;
        }

        .section-header h2 {
            font-size: 2rem;
        }

        .projects-grid {
            grid-template-columns: 1fr;
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
    }
</style>
