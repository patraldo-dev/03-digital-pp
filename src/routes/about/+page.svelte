<script>
    import { page } from '$app/stores';
    
    let { data } = $props();
    let t = $derived(data?.t || {});
</script>

<svelte:head>
    <title>{t.about_title || 'About'} - ¡Pinche Poutine! Digital</title>
    <meta name="description" content={t.about_subtitle || ''} />
</svelte:head>

<!-- Background Blobs -->
<div class="bg-wrap">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
</div>

<div class="page-header">
    <div class="container">
        <div class="badge">{t.about_badge || 'About Us'}</div>
        <h1>{t.about_title || 'About Us'}</h1>
        <p class="subtitle">{t.about_subtitle || 'Building amazing experiences'}</p>
    </div>
</div>

<div class="container">
    <section class="about-content">
        <!-- Story Section -->
        <div class="content-section">
            <h2>{t.story_title || 'Our Story'}</h2>
            <div class="text-block">
                <p>{t.story_1 || 'Story text...'}</p>
                <p>{t.story_2 || 'Story text...'}</p>
            </div>
        </div>

        <!-- Mission Section -->
        <div class="content-section">
            <div class="mission-box">
                <div class="mission-icon">🎯</div>
                <h2>{t.mission_title || 'Our Mission'}</h2>
                <p>{t.mission_text || 'Mission text...'}</p>
            </div>
        </div>

        <!-- Values Section -->
        <div class="values-section">
            <div class="section-header">
                <h2>{t.values_title || 'Our Values'}</h2>
                <div class="line"></div>
            </div>

            <div class="values-grid">
                <div class="value-card">
                    <div class="value-icon">💡</div>
                    <h3>{t.val_innovation_title || 'Innovation'}</h3>
                    <p>{t.val_innovation_desc || 'Description...'}</p>
                </div>
                <div class="value-card">
                    <div class="value-icon">🎯</div>
                    <h3>{t.val_quality_title || 'Quality'}</h3>
                    <p>{t.val_quality_desc || 'Description...'}</p>
                </div>
                <div class="value-card">
                    <div class="value-icon">🤝</div>
                    <h3>{t.val_collab_title || 'Collaboration'}</h3>
                    <p>{t.val_collab_desc || 'Description...'}</p>
                </div>
                <div class="value-card">
                    <div class="value-icon">🌱</div>
                    <h3>{t.val_growth_title || 'Growth'}</h3>
                    <p>{t.val_growth_desc || 'Description...'}</p>
                </div>
            </div>
        </div>

        <!-- Team & Stats Section -->
        <div class="team-section">
            <div class="section-header">
                <h2>{t.team_title || 'Our Team'}</h2>
                <div class="line"></div>
            </div>

            <p class="team-text">{t.team_text || 'Team text...'}</p>

            <div class="team-stats">
                <div class="stat-item">
                    <div class="stat-number">100+</div>
                    <div class="stat-label">{t.stats_projects || 'Projects'}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">{t.stats_clients || 'Clients'}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">5+</div>
                    <div class="stat-label">{t.stats_experience || 'Years'}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">{t.stats_support || 'Support'}</div>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="cta-section">
            <div class="container">
                <div class="cta-box">
                    <h2>{t.cta_title || 'Ready to Work Together?'}</h2>
                    <p>{t.cta_text || 'Let\'s discuss how we can help bring your vision to life.'}</p>
                    <a href="/contact" class="btn btn-primary">
                        {t.about_cta_btn || 'Get in Touch'}
                        <span class="arrow">→</span>
                    </a>
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

    /* --- Content Layout --- */
    .about-content {
        padding: 4rem 0 6rem;
    }

    .content-section {
        margin-bottom: 5rem;
    }

    .content-section h2 {
        color: var(--color-text);
        margin-bottom: 2rem;
        font-size: 2.5rem;
        font-weight: 800;
    }

    .text-block p {
        line-height: 1.8;
        color: #5F6E68;
        font-size: 1.15rem;
        margin-bottom: 1.5rem;
        max-width: 800px;
    }

    /* --- Mission Box --- */
    .mission-box {
        background: var(--color-white);
        padding: 3rem;
        border-radius: 30px;
        text-align: center;
        border: 1px solid rgba(45, 58, 54, 0.05);
        box-shadow: 0 10px 30px rgba(45, 58, 54, 0.05);
        position: relative;
        overflow: hidden;
    }

    .mission-box::before {
        content: '';
        position: absolute;
        width: 200px;
        height: 200px;
        background: rgba(141, 163, 153, 0.1);
        border-radius: 50%;
        top: -50px;
        right: -50px;
        filter: blur(40px);
    }

    .mission-icon {
        font-size: 4rem;
        margin-bottom: 1.5rem;
    }

    .mission-box h2 {
        color: var(--color-text);
        margin-bottom: 1.5rem;
        font-size: 2rem;
        font-weight: 800;
    }

    .mission-box p {
        color: #6B7C76;
        font-size: 1.15rem;
        line-height: 1.8;
        max-width: 700px;
        margin: 0 auto;
    }

    /* --- Values Grid --- */
    .values-section {
        margin: 6rem 0;
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

    .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 2rem;
    }

    .value-card {
        background: var(--color-white);
        padding: 3rem 2.5rem;
        border-radius: 30px;
        text-align: center;
        border: 1px solid rgba(45, 58, 54, 0.05);
        transition: all 0.4s ease;
        box-shadow: 0 10px 30px rgba(45, 58, 54, 0.05);
    }

    .value-card:hover {
        transform: translateY(-10px);
        border-color: rgba(141, 163, 153, 0.4);
        box-shadow: 0 20px 40px rgba(141, 163, 153, 0.2);
    }

    .value-icon {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
    }

    .value-card h3 {
        color: var(--color-text);
        margin-bottom: 1rem;
        font-size: 1.4rem;
        font-weight: 700;
    }

    .value-card p {
        color: #6B7C76;
        line-height: 1.7;
        font-size: 1.05rem;
    }

    /* --- Team Section --- */
    .team-section {
        text-align: center;
        margin: 6rem 0;
    }

    .team-text {
        line-height: 1.8;
        color: #5F6E68;
        font-size: 1.15rem;
        margin-bottom: 4rem;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }

    .team-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
    }

    .stat-item {
        background: var(--color-text);
        color: var(--color-white);
        padding: 3rem 2rem;
        border-radius: 30px;
        position: relative;
        overflow: hidden;
        transition: all 0.4s ease;
    }

    .stat-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(45, 58, 54, 0.3);
    }

    .stat-item::after {
        content: '';
        position: absolute;
        top: -20px;
        right: -20px;
        width: 80px;
        height: 80px;
        background: var(--color-brick);
        border-radius: 50%;
        opacity: 0.3;
    }

    .stat-number {
        font-size: 3.5rem;
        font-weight: 900;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, var(--color-brick) 0%, var(--color-sage) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        line-height: 1;
    }

    .stat-label {
        font-size: 1rem;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
    }

    /* --- CTA Section --- */
    .cta-section {
        margin: 6rem 0 0;
    }

    .cta-box {
        background: var(--color-sage);
        color: var(--color-white);
        padding: 5rem 4rem;
        border-radius: 40px;
        text-align: center;
        position: relative;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(141, 163, 153, 0.4);
    }

    .cta-box::before {
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

    .cta-box::after {
        content: '';
        position: absolute;
        width: 200px;
        height: 200px;
        background: rgba(201, 76, 53, 0.2);
        border-radius: 50%;
        top: -50px;
        right: -50px;
        filter: blur(40px);
    }

    .cta-box h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        position: relative;
        z-index: 2;
    }

    .cta-box p {
        font-size: 1.2rem;
        margin-bottom: 2.5rem;
        opacity: 0.95;
        position: relative;
        z-index: 2;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

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
        position: relative;
        z-index: 2;
    }

    .btn-primary {
        background: var(--color-white);
        color: var(--color-text);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .btn-primary:hover {
        background: var(--color-bg);
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    }

    .btn-primary .arrow {
        margin-left: 0.5rem;
        transition: transform 0.3s ease;
    }

    .btn-primary:hover .arrow {
        transform: translateX(5px);
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

        .content-section h2,
        .section-header h2 {
            font-size: 2rem;
        }

        .team-stats {
            grid-template-columns: 1fr 1fr;
        }

        .stat-number {
            font-size: 2.5rem;
        }

        .mission-box {
            padding: 2rem;
        }

        .mission-icon {
            font-size: 3rem;
        }

        .cta-box {
            padding: 3rem 2rem;
        }

        .cta-box h2 {
            font-size: 2rem;
        }
    }
</style>
