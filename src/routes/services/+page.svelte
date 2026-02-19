<script>
    import { page } from '$app/stores';
    
    let { data } = $props();
    let t = $derived(data?.t || {});
</script>

<svelte:head>
    <title>Services - ¡Pinche Poutine! Digital</title>
    <meta name="description" content="Technical consulting for edge-native web projects" />
</svelte:head>

<!-- Background Blobs -->
<div class="bg-wrap">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
</div>

<div class="page-header">
    <div class="container">
        <div class="badge">Services</div>
        <h1>Not Taking On Clients (Mostly)</h1>
        <p class="subtitle">Semi-retired, selective, and intentionally unavailable</p>
    </div>
</div>

<div class="container">
    <!-- Intro Section -->
    <section class="intro-section">
        <div class="content-box">
            <p class="lead">
                I'm semi-retired and intentionally selective about what I work on. 
                That said, if you've got an interesting problem and we get along, 
                I'm open to consulting gigs.
            </p>
            <div class="rules">
                <div class="rule">❌ No long-term commitments</div>
                <div class="rule">❌ No projects I don't believe in</div>
                <div class="rule">❌ No clients I wouldn't enjoy working with</div>
            </div>
        </div>
    </section>

    <!-- What I Actually Do -->
    <section class="services-section">
        <div class="section-header">
            <h2>🛠️ What I Actually Do</h2>
            <div class="line"></div>
        </div>

        <div class="service-card">
            <h3>Technical Consulting</h3>
            <p class="service-desc">
                Not "let's have weekly standups" consulting. More like:
            </p>
            <ul class="service-list">
                <li>"Here's my architecture problem, help me solve it in 2 hours"</li>
                <li>"Review my code and tell me what I'm missing"</li>
                <li>"How would YOU build this?"</li>
            </ul>
            <p class="service-desc">
                <strong>I'm good at:</strong> SvelteKit 5, Cloudflare Workers, edge-native architecture, 
                DIY auth, automating boring stuff with Bash.
            </p>
            <p class="rate-note">
                <strong>Rate:</strong> Let's talk. (If you have to ask, we're probably not a fit.)
            </p>
        </div>
    </section>

    <!-- How I Work -->
    <section class="process-section">
        <div class="section-header">
            <h2>⚙️ How I Work</h2>
            <div class="line"></div>
        </div>

        <div class="process-grid">
            <div class="process-item">
                <div class="process-icon">💻</div>
                <h3>Terminal-First</h3>
                <p>If it has a GUI, I probably don't use it. Bash + Vim + FFMPEG is my happy place.</p>
            </div>
            <div class="process-item">
                <div class="process-icon">🎬</div>
                <h3>Video Without GUI</h3>
                <p>FFMPEG from the command line. No mouse. No timeline editors. Just scripts.</p>
            </div>
            <div class="process-item">
                <div class="process-icon">⚡</div>
                <h3>SvelteKit 5</h3>
                <p>Runes, JSDoc, no TypeScript drama. Clean, fast, edge-native.</p>
            </div>
            <div class="process-item">
                <div class="process-icon">☁️</div>
                <h3>Cloudflare Edge</h3>
                <p>Workers, D1, Images, Stream—no traditional servers. Global by default.</p>
            </div>
            <div class="process-item">
                <div class="process-icon">🤖</div>
                <h3>AI-Assisted</h3>
                <p>I pair-program with AI agents. They don't complain about my hours.</p>
            </div>
        </div>

        <p class="process-summary">
            This means: Fast iteration, minimal overhead, no hand-holding.
        </p>
    </section>

    <!-- Proof It Works -->
    <section class="projects-section">
        <div class="section-header">
            <h2>🎨 See It In Action</h2>
            <div class="line"></div>
        </div>

        <div class="projects-grid">
            <!-- Antoine Patraldo -->
            <a href="https://antoine.patraldo.com" target="_blank" rel="noopener" class="project-card">
                <div class="project-header">
                    <span class="project-emoji">🎨</span>
                    <h3>antoine.patraldo.com</h3>
                </div>
                <p class="project-desc">
                    Digital gallery for illustrator Antoine Patraldo. Built with SvelteKit 5, 
                    Cloudflare Workers, DIY auth (Web Crypto API), and FFMPEG + Bash for 
                    video processing. Zero GUI, zero traditional servers.
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
                    SvelteKit 5 on Cloudflare Workers with full i18n support 
                    (EN/FR/ES) and DIY email subscription system.
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

        <p class="projects-note">
            This is the kind of thing I enjoy building. If you want something similar, let's talk.
        </p>
    </section>

    <!-- Contact -->
    <section class="contact-section">
        <div class="container">
            <div class="contact-box">
                <h2>📬 Interested?</h2>
                <p class="contact-intro">
                    Email me: <a href="mailto:info@pinchepoutine.digital">info@pinchepoutine.digital</a>
                </p>
                <p class="contact-intro">
                    Tell me:
                </p>
                <ol class="contact-list">
                    <li>What you're building</li>
                    <li>Why it's interesting</li>
                    <li>Why you think we'd work well together</li>
                </ol>
                <p class="contact-outro">
                    No pressure. No sales pitch. If it's a fit, great. If not, no hard feelings.
                </p>
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

    .rules {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    .rule {
        background: var(--color-white);
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-brick);
        border: 2px solid rgba(201, 76, 53, 0.2);
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

    .contact-list {
        text-align: left;
        max-width: 500px;
        margin: 0 auto 2rem;
        padding-left: 2rem;
        position: relative;
        z-index: 2;
    }

    .contact-list li {
        color: rgba(255, 255, 255, 0.95);
        font-size: 1.05rem;
        margin-bottom: 0.75rem;
        line-height: 1.6;
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
