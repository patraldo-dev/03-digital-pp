<script>
    import { page } from '$app/stores';
    
    let t = $derived($page.data?.t || {});
</script>

<svelte:head>
    <title>{t.services_title || 'Our Services'} - ¡Pinche Poutine!</title>
    <meta name="description" content={t.services_subtitle || ''} />
</svelte:head>

<div class="page-header">
    <div class="container">
        <h1>{t.services_title || 'Our Services'}</h1>
        <p>{t.services_subtitle || 'Comprehensive solutions to help your business thrive online'}</p>
    </div>
</div>

<div class="container">
    <section class="services-intro">
        <div class="intro-content">
            <h2>{t.services_intro_title || 'What We Do'}</h2>
            <p>{t.services_intro_desc || 'We specialize in creating modern, high-performance web solutions...'}</p>
        </div>
    </section>

    <section class="services-grid">
        <!-- Custom Web Development -->
        <div class="service-card featured">
            <div class="service-icon">🚀</div>
            <h3>{t.services_custom_title || 'Custom Web Development'}</h3>
            <p>{t.services_custom_desc || 'Build powerful, scalable web applications...'}</p>
            <ul class="service-features">
                <li>{t.services_custom_feat1 || 'Custom web applications'}</li>
                <li>{t.services_custom_feat2 || 'E-commerce solutions'}</li>
                <li>{t.services_custom_feat3 || 'API development & integration'}</li>
                <li>{t.services_custom_feat4 || 'Database design & optimization'}</li>
            </ul>
            <div class="service-price">{t.services_custom_price || 'Starting at $2,500'}</div>
        </div>

        <!-- Website Design -->
        <div class="service-card">
            <div class="service-icon">🎨</div>
            <h3>{t.services_website_title || 'Website Design & Development'}</h3>
            <p>{t.services_website_desc || 'Create stunning, responsive websites...'}</p>
            <ul class="service-features">
                <li>{t.services_website_feat1 || 'Responsive web design'}</li>
                <li>{t.services_website_feat2 || 'Content management systems'}</li>
                <li>{t.services_website_feat3 || 'SEO optimization'}</li>
                <li>{t.services_website_feat4 || 'Performance optimization'}</li>
            </ul>
            <div class="service-price">{t.services_website_price || 'Starting at $1,500'}</div>
        </div>

        <!-- Cloud Deployment -->
        <div class="service-card">
            <div class="service-icon">☁️</div>
            <h3>{t.services_cloud_title || 'Cloud Deployment & Hosting'}</h3>
            <p>{t.services_cloud_desc || 'Deploy your applications on modern cloud platforms...'}</p>
            <ul class="service-features">
                <li>{t.services_cloud_feat1 || 'Cloudflare Workers deployment'}</li>
                <li>{t.services_cloud_feat2 || 'CDN configuration'}</li>
                <li>{t.services_cloud_feat3 || 'SSL certificates'}</li>
                <li>{t.services_cloud_feat4 || 'Performance monitoring'}</li>
            </ul>
            <div class="service-price">{t.services_cloud_price || 'Starting at $500'}</div>
        </div>

        <!-- Email Marketing -->
        <div class="service-card">
            <div class="service-icon">📧</div>
            <h3>{t.services_email_title || 'Email Marketing Solutions'}</h3>
            <p>{t.services_email_desc || 'Build and manage effective email marketing campaigns...'}</p>
            <ul class="service-features">
                <li>{t.services_email_feat1 || 'Newsletter system setup'}</li>
                <li>{t.services_email_feat2 || 'Email automation workflows'}</li>
                <li>{t.services_email_feat3 || 'Mailgun/SendGrid integration'}</li>
                <li>{t.services_email_feat4 || 'Analytics & reporting'}</li>
            </ul>
            <div class="service-price">{t.services_email_price || 'Starting at $800'}</div>
        </div>

        <!-- Mobile-First -->
        <div class="service-card">
            <div class="service-icon">📱</div>
            <h3>{t.services_mobile_title || 'Mobile-First Development'}</h3>
            <p>{t.services_mobile_desc || 'Ensure your web presence works flawlessly...'}</p>
            <ul class="service-features">
                <li>{t.services_mobile_feat1 || 'Progressive Web Apps (PWAs)'}</li>
                <li>{t.services_mobile_feat2 || 'Mobile optimization'}</li>
                <li>{t.services_mobile_feat3 || 'Cross-browser compatibility'}</li>
                <li>{t.services_mobile_feat4 || 'Touch-friendly interfaces'}</li>
            </ul>
            <div class="service-price">{t.services_mobile_price || 'Starting at $1,200'}</div>
        </div>

        <!-- Performance Optimization -->
        <div class="service-card">
            <div class="service-icon">⚡</div>
            <h3>{t.services_perf_title || 'Performance Optimization'}</h3>
            <p>{t.services_perf_desc || 'Speed up your existing website...'}</p>
            <ul class="service-features">
                <li>{t.services_perf_feat1 || 'Site speed optimization'}</li>
                <li>{t.services_perf_feat2 || 'Image compression & lazy loading'}</li>
                <li>{t.services_perf_feat3 || 'Code splitting & bundling'}</li>
                <li>{t.services_perf_feat4 || 'Core Web Vitals improvement'}</li>
            </ul>
            <div class="service-price">{t.services_perf_price || 'Starting at $600'}</div>
        </div>
    </section>

    <!-- Process Section -->
    <section class="process_section">
        <h2>{t.services_process_title || 'Our Process'}</h2>
        <div class="process-steps">
            <div class="process-step">
                <div class="step-number">{t.services_process_step1_num || '1'}</div>
                <h3>{t.services_process_step1_title || 'Discovery & Planning'}</h3>
                <p>{t.services_process_step1_desc || 'We start by understanding your business goals...'}</p>
            </div>
            <div class="process-step">
                <div class="step-number">{t.services_process_step2_num || '2'}</div>
                <h3>{t.services_process_step2_title || 'Design & Development'}</h3>
                <p>{t.services_process_step2_desc || 'Our team creates wireframes, designs...'}</p>
            </div>
            <div class="process-step">
                <div class="step-number">{t.services_process_step3_num || '3'}</div>
                <h3>{t.services_process_step3_title || 'Testing & Optimization'}</h3>
                <p>{t.services_process_step3_desc || 'Rigorous testing ensures your site works...'}</p>
            </div>
            <div class="process-step">
                <div class="step-number">{t.services_process_step4_num || '4'}</div>
                <h3>{t.services_process_step4_title || 'Launch & Support'}</h3>
                <p>{t.services_process_step4_desc || 'We deploy your site and provide ongoing support...'}</p>
            </div>
        </div>
    </section>

    <!-- Technologies Section -->
    <section class="technologies-section">
        <h2>{t.services_tech_title || 'Technologies We Use'}</h2>
        <div class="tech-grid">
            <div class="tech-category">
                <h3>{t.services_tech_frontend || 'Frontend'}</h3>
                <div class="tech-items">
                    <span class="tech-item">{t.services_tech_sveltekit || 'SvelteKit'}</span>
                    <span class="tech-item">{t.services_tech_react || 'React'}</span>
                    <span class="tech-item">{t.services_tech_vue || 'Vue.js'}</span>
                    <span class="tech-item">{t.services_tech_ts || 'TypeScript'}</span>
                    <span class="tech-item">{t.services_tech_tailwind || 'Tailwind CSS'}</span>
                </div>
            </div>
            <div class="tech-category">
                <h3>{t.services_tech_backend || 'Backend'}</h3>
                <div class="tech-items">
                    <span class="tech-item">{t.services_tech_node || 'Node.js'}</span>
                    <span class="tech-item">{t.services_tech_cf || 'Cloudflare Workers'}</span>
                    <span class="tech-item">{t.services_tech_serverless || 'Serverless Functions'}</span>
                    <span class="tech-item">{t.services_tech_rest || 'REST APIs'}</span>
                    <span class="tech-item">{t.services_tech_graphql || 'GraphQL'}</span>
                </div>
            </div>
            <div class="tech-category">
                <h3>{t.services_tech_deployment || 'Deployment'}</h3>
                <div class="tech-items">
                    <span class="tech-item">{t.services_tech_cloudflare || 'Cloudflare'}</span>
                    <span class="tech-item">{t.services_tech_vercel || 'Vercel'}</span>
                    <span class="tech-item">{t.services_tech_netlify || 'Netlify'}</span>
                    <span class="tech-item">{t.services_tech_aws || 'AWS'}</span>
                    <span class="tech-item">{t.services_tech_docker || 'Docker'}</span>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="cta-content">
            <h2>{t.services_cta_title || 'Ready to Get Started?'}</h2>
            <p>{t.services_cta_desc || 'Let\'s discuss your project and find the perfect solution...'}</p>
            <div class="cta-buttons">
                <a href="/contact" class="btn btn-large">{t.services_cta_btn1 || 'Start Your Project'}</a>
                <a href="/contact" class="btn btn-outline btn-large">{t.services_cta_btn2 || 'Schedule Consultation'}</a>
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

    .services-intro {
        padding: 4rem 0;
        text-align: center;
    }

    .intro-content h2 {
        color: #2c3e50;
        margin-bottom: 2rem;
        font-size: 2.5rem;
    }

    .intro-content p {
        font-size: 1.2rem;
        color: #555;
        line-height: 1.8;
        max-width: 800px;
        margin: 0 auto;
    }

    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        padding: 2rem 0 4rem;
    }

    .service-card {
        background: white;
        border-radius: 12px;
        padding: 2.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 2px solid transparent;
    }

    .service-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }

    .service-card.featured {
        border-color: #007cba;
        position: relative;
    }

    .service-card.featured::before {
        content: attr(data-popular);
        position: absolute;
        top: -12px;
        right: 20px;
        background: #007cba;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .service-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
    }

    .service-card h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    .service-card > p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .service-features {
        list-style: none;
        padding: 0;
        margin: 0 0 2rem 0;
    }

    .service-features li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
        color: #555;
        position: relative;
        padding-left: 1.5rem;
    }

    .service-features li:before {
        content: '✓';
        color: #007cba;
        font-weight: bold;
        position: absolute;
        left: 0;
    }

    .service-features li:last-child {
        border-bottom: none;
    }

    .service-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #007cba;
        text-align: center;
        padding-top: 1rem;
        border-top: 2px solid #f0f0f0;
    }

    .process_section {
        padding: 4rem 0;
        background: #f8f9fa;
        margin: 4rem -1rem 0;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .process_section h2 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 3rem;
        font-size: 2.5rem;
    }

    .process-steps {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        max-width: 1000px;
        margin: 0 auto;
    }

    .process-step {
        text-align: center;
        padding: 2rem;
    }

    .step-number {
        width: 60px;
        height: 60px;
        background: #007cba;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0 auto 1.5rem;
    }

    .process-step h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }

    .process-step p {
        color: #666;
        line-height: 1.6;
    }

    .technologies-section {
        padding: 4rem 0;
    }

    .technologies-section h2 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 3rem;
        font-size: 2.5rem;
    }

    .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .tech-category {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .tech-category h3 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        font-size: 1.3rem;
        text-align: center;
    }

    .tech-items {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .tech-item {
        background: #f8f9fa;
        color: #555;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .tech-item:hover {
        background: #007cba;
        color: white;
        transform: translateY(-2px);
    }

    .cta-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4rem 2rem;
        border-radius: 12px;
        text-align: center;
        margin: 4rem 0;
    }

    .cta-content h2 {
        margin-bottom: 1.5rem;
        font-size: 2.5rem;
    }

    .cta-content p {
        font-size: 1.2rem;
        opacity: 0.9;
        margin-bottom: 2.5rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: white;
        color: #667eea;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .btn-large {
        padding: 1rem 2rem;
        font-size: 1.1rem;
    }

    .btn-outline {
        background: transparent;
        border: 2px solid white;
        color: white;
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
        .page-header h1 {
            font-size: 2rem;
        }

        .intro-content h2,
        .process_section h2,
        .technologies-section h2,
        .cta-content h2 {
            font-size: 2rem;
        }

        .services-grid {
            grid-template-columns: 1fr;
        }

        .process_section,
        .cta-section {
            margin-left: -1rem;
            margin-right: -1rem;
        }

        .cta-buttons {
            flex-direction: column;
            align-items: center;
        }
    }
</style>
