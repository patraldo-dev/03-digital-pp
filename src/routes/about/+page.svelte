<script>
    // We don't need an import for the i18n logic here, 
    // it comes from the load function via props.
    let { data } = $props();
    let t = $derived(data?.t || {});
</script>

<svelte:head>
    <title>{t.about_title || 'About'} - ¡Pinche Poutine! Digital</title>
    <meta name="description" content={t.about_subtitle || ''} />
</svelte:head>

<div class="page-header">
    <div class="container">
        <div class="badge">About Us</div>
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
            <h2>{t.mission_title || 'Our Mission'}</h2>
            <p>{t.mission_text || 'Mission text...'}</p>
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
            <div class="cta-box">
                <h2>{t.cta_title || 'Ready to Work Together?'}</h2>
                <p>{t.cta_text || 'Let\'s discuss how we can help bring your vision to life.'}</p>
                <a href="/contact" class="btn btn-primary">
                    {t.btn_contact || 'Get in Touch'}
                    <span class="arrow">→</span>
                </a>
            </div>
        </div>
    </section>
</div>

<style>
    /* --- Palette Definition (Matching Home Page) --- */
    :root {
        --color-bg: #F9F6F0;
        --color-text: #2D3A36;
        --color-brick: #C94C35;
        --color-sage: #8DA399;
        --color-white: #FFFFFF;
    }

    /* Background Blobs for consistency */
    .bg-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        position: relative;
        z-index: 2;
    }

    /* Header */
    .page-header {
        background: linear-gradient(135deg, var(--color-text) 0%, #1a201e 100%);
        color: white;
        padding: 6rem 0 4rem;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .badge {
        display: inline-block;
        padding: 0.4rem 1rem;
        background: rgba(201, 76, 53, 0.2);
        border: 1px solid var(--color-brick);
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--color-brick);
    }

    .page-header h1 {
        font-size: clamp(2.5rem, 6vw, 4rem);
        margin-bottom: 1rem;
        font-weight: 800;
        line-height: 1.1;
    }

    .subtitle {
        font-size: 1.25rem;
        opacity: 0.8;
        max-width: 600px;
        margin: 0 auto;
        font-weight: 300;
    }

    /* Content Layout */
    .about-content {
        padding: 4rem 0;
    }

    .content-section {
        margin-bottom: 5rem;
    }

    .content-section h2 {
        color: var(--color-text);
        margin-bottom: 2rem;
        font-size: 2.5rem;
        font-weight: 800;
        position: relative;
        display: inline-block;
    }

    .text-block p {
        line-height: 1.8;
        color: #555;
        font-size: 1.15rem;
        margin-bottom: 1.5rem;
        max-width: 800px;
    }

    /* Values Grid */
    .values-section {
        margin: 6rem 0;
    }

    .section-header {
        text-align: center;
        margin-bottom: 4rem;
    }

    .section-header h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        color: var(--color-text);
    }

    .line {
        width: 60px;
        height: 4px;
        background: var(--color-brick);
        margin: 0 auto;
        border-radius: 2px;
    }

    .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 2rem;
    }

    .value-card {
        background: var(--color-white);
        padding: 2.5rem;
        border-radius: 20px;
        text-align: center;
        border: 1px solid rgba(45, 58, 54, 0.05);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    .value-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(201, 76, 53, 0.15);
        border-color: var(--color-sage);
    }

    .value-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
    }

    .value-card h3 {
        color: var(--color-text);
        margin-bottom: 1rem;
        font-size: 1.4rem;
        font-weight: 700;
    }

    .value-card p {
        color: #666;
        line-height: 1.6;
        font-size: 1rem;
    }

    /* Team Section */
    .team-section {
        text-align: center;
        margin: 6rem 0;
    }

    .team-text {
        line-height: 1.8;
        color: #555;
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
        color: white;
        padding: 3rem 2rem;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
    }

    /* Decorative circle on stats */
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
        color: var(--color-sage);
        line-height: 1;
    }

    .stat-label {
        font-size: 1rem;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
    }

    /* CTA Section */
    .cta-section {
        margin: 6rem 0;
    }

    .cta-box {
        background: var(--color-sage);
        color: white;
        padding: 4rem 3rem;
        border-radius: 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    /* Fun Blob in CTA */
    .cta-box::before {
        content: '';
        position: absolute;
        width: 200px;
        height: 200px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        bottom: -50px;
        left: -50px;
        filter: blur(40px);
    }

    .cta-box h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
    }

    .cta-box p {
        font-size: 1.2rem;
        margin-bottom: 2.5rem;
        opacity: 0.95;
    }

    /* Buttons */
    .btn {
        display: inline-flex;
        align-items: center;
        padding: 1rem 2.5rem;
        font-weight: 700;
        text-decoration: none;
        border-radius: 100px;
        transition: all 0.3s ease;
        font-size: 1.1rem;
        border: none;
        cursor: pointer;
    }

    .btn-primary {
        background: white;
        color: var(--color-text);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }

    .btn-primary:hover {
        transform: translateY(-3px);
        background: var(--color-bg);
        box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    }

    .btn-primary .arrow {
        margin-left: 0.5rem;
        transition: transform 0.3s ease;
    }

    .btn-primary:hover .arrow {
        transform: translateX(5px);
    }

    @media (max-width: 768px) {
        .page-header h1 {
            font-size: 2.5rem;
        }

        .content-section h2 {
            font-size: 2rem;
        }
        
        .team-stats {
            grid-template-columns: 1fr 1fr;
        }

        .stat-number {
            font-size: 2.5rem;
        }
    }
</style>
