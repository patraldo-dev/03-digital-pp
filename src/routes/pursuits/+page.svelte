<script>
    import { page } from '$app/stores';
    
    let { data } = $props();
    let t = $derived(data?.t || {});
</script>

<svelte:head>
    <title>{t.services_page_title || 'Services'} - ¡Pinche Poutine! Digital</title>
    <meta name="description" content={t.services_page_subtitle || ''} />
</svelte:head>

<!-- Background Blobs -->
<div class="bg-wrap">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
</div>

<div class="page-header">
    <div class="container">
        <div class="badge">Services</div>
        <h1>{t.services_page_title}</h1>
        <p class="subtitle">{t.services_page_subtitle}</p>
    </div>
</div>

<div class="container">
    <!-- Intro Section -->
    <section class="intro-section">
        <div class="content-box">
            <p class="lead">{t.services_intro_1}</p>
            <p class="lead">{t.services_intro_2}</p>
        </div>
    </section>

    <!-- What I Actually Do -->
    <section class="services-section">
        <div class="section-header">
            <h2>{t.services_help_title}</h2>
            <div class="line"></div>
        </div>

        <div class="service-card">
            <h3>{t.services_help_subtitle}</h3>
            <p class="service-desc">{t.services_help_desc}</p>
            <ul class="service-list">
                <li>{t.services_help_item1}</li>
                <li>{t.services_help_item2}</li>
                <li>{t.services_help_item3}</li>
                <li>{t.services_help_item4}</li>
                <li>{t.services_help_item5}</li>
            </ul>
            <p class="service-desc">{@html t.services_help_skills}</p>
        </div>
    </section>

    <!-- How I Work -->
    <section class="process-section">
        <div class="section-header">
            <h2>{t.services_process_title}</h2>
            <div class="line"></div>
        </div>

        <div class="process-grid">
            <div class="process-item">
                <div class="process-icon">💻</div>
                <h3>{t.services_process_terminal_title}</h3>
                <p>{t.services_process_terminal_desc}</p>
            </div>
            <div class="process-item">
                <div class="process-icon">🎬</div>
                <h3>{t.services_process_video_title}</h3>
                <p>{t.services_process_video_desc}</p>
            </div>
            <div class="process-item">
                <div class="process-icon">⚡</div>
                <h3>{t.services_process_svelte_title}</h3>
                <p>{t.services_process_svelte_desc}</p>
            </div>
            <div class="process-item">
                <div class="process-icon">☁️</div>
                <h3>{t.services_process_cloudflare_title}</h3>
                <p>{t.services_process_cloudflare_desc}</p>
            </div>
            <div class="process-item">
                <div class="process-icon">🤖</div>
                <h3>{t.services_process_ai_title}</h3>
                <p>{t.services_process_ai_desc}</p>
            </div>
        </div>

        <p class="process-summary">{t.services_process_summary}</p>
    </section>

    <!-- Proof It Works -->
    <section class="projects-section">
        <div class="section-header">
            <h2>{t.services_projects_title}</h2>
            <div class="line"></div>
        </div>

        <div class="projects-grid">
            <!-- Antoine Patraldo -->
            <a href="https://antoine.patraldo.com" target="_blank" rel="noopener" class="project-card">
                <div class="project-header">
                    <span class="project-emoji">🎨</span>
                    <h3>{t.project_antoine_title}</h3>
                </div>
                <p class="project-desc">{t.project_antoine_desc}</p>
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
                    <h3>{t.project_pinche_title}</h3>
                </div>
                <p class="project-desc">{t.project_pinche_desc}</p>
                <div class="project-tech">
                    <span class="tech-tag">SvelteKit 5</span>
                    <span class="tech-tag">i18n</span>
                    <span class="tech-tag">Cloudflare D1</span>
                    <span class="tech-tag">Mailgun</span>
                </div>
                <span class="project-link">{t.project_pinche_link} →</span>
            </a>

            <!-- Patrouch.ca -->
            <a href="https://patrouch.ca" target="_blank" rel="noopener" class="project-card">
                <div class="project-header">
                    <span class="project-emoji">🍁</span>
                    <h3>{t.project_patrouch_title}</h3>
                </div>
                <p class="project-desc">{t.project_patrouch_desc}</p>
                <div class="project-tech">
                    <span class="tech-tag">SvelteKit</span>
                    <span class="tech-tag">Edge-Native</span>
                    <span class="tech-tag">Minimal</span>
                    <span class="tech-tag">Fast</span>
                </div>
                <span class="project-link">Visit Site →</span>
            </a>
        </div>

        <p class="projects-note">{t.services_projects_note}</p>
    </section>

    <!-- Contact -->
    <section class="contact-section">
        <div class="container">
            <div class="contact-box">
                <h2>{t.services_contact_title}</h2>
                <p class="contact-intro">{t.services_contact_intro}</p>
                <p class="contact-intro">
                    <a href="mailto:info@pinchepoutine.digital">info@pinchepoutine.digital</a>
                </p>
                <p class="contact-outro">{t.services_contact_outro}</p>
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

    /* --- Sections --- */
    .intro-section {
        padding: 5rem 0 4rem;
    }

    .content-box {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
    }

    .lead {
        font-size: 1.25rem;
        line-height: 1.8;
        color: #5F6E68;
        margin-bottom: 2rem;
    }

    /* --- Services Section --- */
    .services-section {
        padding: 4rem 0;
    }

    .section-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .section-header h2 {
        font-size: 2.5rem;
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

    .service-card {
        max-width: 800px;
        margin: 0 auto;
        background: var(--color-white);
        padding: 3rem;
        border-radius: 30px;
        box-shadow: 0 10px 30px rgba(45, 58, 54, 0.05);
        border: 1px solid rgba(45, 58, 54, 0.05);
    }

    .service-card h3 {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        color: var(--color-text);
    }

    .service-desc {
        color: #6B7C76;
        line-height: 1.7;
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
    }

    .service-list {
        list-style: none;
        padding: 0;
        margin: 0 0 2rem 0;
    }

    .service-list li {
        padding: 0.75rem 0;
        border-bottom: 1px solid rgba(141, 163, 153, 0.15);
        color: #5F6E68;
        font-size: 1.05rem;
        padding-left: 1.5rem;
        position: relative;
    }

    .service-list li:before {
        content: '→';
        color: var(--color-brick);
        font-weight: 700;
        position: absolute;
        left: 0;
    }

    .service-list li:last-child {
        border-bottom: none;
    }

    .rate-note {
        background: rgba(201, 76, 53, 0.05);
        padding: 1.5rem;
        border-radius: 16px;
        border-left: 4px solid var(--color-brick);
        margin-top: 2rem;
    }

    /* --- Process Section --- */
    .process-section {
        padding: 5rem 0;
        background: rgba(141, 163, 153, 0.08);
        margin: 0 -2rem;
        padding-left: 2rem;
        padding-right: 2rem;
    }

    .process-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto 3rem;
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

    .process-summary {
        text-align: center;
        font-size: 1.15rem;
        color: #5F6E68;
        max-width: 700px;
        margin: 0 auto;
        line-height: 1.7;
    }

    /* --- Projects Section --- */
    .projects-section {
        padding: 5rem 0;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
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
    }

    .project-card:hover {
        transform: translateY(-8px);
        border-color: rgba(141, 163, 153, 0.4);
        box-shadow: 0 20px 40px rgba(141, 163, 153, 0.2);
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

    .projects-note {
        text-align: center;
        color: #5F6E68;
        font-size: 1.1rem;
        max-width: 700px;
        margin: 0 auto;
        line-height: 1.7;
    }

    /* --- Contact Section --- */
    .contact-section {
        padding: 5rem 0 6rem;
    }

    .contact-box {
        max-width: 700px;
        margin: 0 auto;
        background: var(--color-sage);
        color: var(--color-white);
        padding: 4rem 3rem;
        border-radius: 40px;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .contact-box::before {
        content: '';
        position: absolute;
        width: 300px;
        height: 300px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        bottom: -100px;
        left: -100px;
        filter: blur(60px);
    }

    .contact-box h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        position: relative;
        z-index: 2;
    }

    .contact-intro {
        font-size: 1.15rem;
        margin-bottom: 1.5rem;
        position: relative;
        z-index: 2;
    }

    .contact-intro a {
        color: var(--color-white);
        text-decoration: none;
        font-weight: 700;
        border-bottom: 2px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
    }

    .contact-intro a:hover {
        border-bottom-color: var(--color-white);
    }

    .contact-outro {
        color: rgba(255, 255, 255, 0.85);
        font-size: 1.05rem;
        margin: 0;
        position: relative;
        z-index: 2;
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

        .section-header h2 {
            font-size: 2rem;
        }

        .service-card {
            padding: 2rem;
        }

        .rules {
            flex-direction: column;
            align-items: center;
        }

        .process-grid {
            grid-template-columns: 1fr;
        }

        .projects-grid {
            grid-template-columns: 1fr;
        }

        .contact-box {
            padding: 3rem 2rem;
        }

        .contact-box h2 {
            font-size: 2rem;
        }
    }
</style>
