<script>
    import ContactForm from '$lib/components/ContactForm.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let { data } = $props();
    let t = $derived(data?.t || {});
    
    // Guadalajara local time (GMT-6)
    let guadalajaraTime = $state('');
    let parallaxLayers = $state([]);
    
    onMount(() => {
        // Parallax scroll effect
        const layers = document.querySelectorAll('.parallax-layer');
        parallaxLayers = Array.from(layers);
        
        function handleScroll() {
            const scrolled = window.scrollY;
            layers.forEach((layer, index) => {
                const speed = (index + 1) * 0.05;
                layer.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    });
    
    onMount(() => {
        function updateTime() {
            const now = new Date();
            guadalajaraTime = now.toLocaleTimeString('en-US', {
                timeZone: 'America/Mexico_City',
                hour: '2-digit',
                minute: '2-digit',
                
                hour12: false
            });
        }
        
        updateTime();
        const interval = setInterval(updateTime, 1000);
        
        return () => clearInterval(interval);
    });
</script>

<svelte:head>
    <title>{t.contact_title || 'Contact'} - ¡Pinche Poutine! Digital</title>
    <meta name="description" content={t.contact_subtitle || ''} />
</svelte:head>
<!-- Parallax Background -->
<div class="parallax-wrap" aria-hidden="true">
    <div class="parallax-bg"></div>
    <div class="parallax-circles">
        <span class="circle c1"></span>
        <span class="circle c2"></span>
        <span class="circle c3"></span>
        <span class="circle c4"></span>
        <span class="circle c5"></span>
        <span class="circle c6"></span>
    </div>
</div>


<!-- Parallax Background Layers (ARIA hidden) -->
<div class="parallax-wrap" aria-hidden="true">
    <div class="parallax-layer layer-bg"></div>
    <div class="parallax-layer layer-svg1">
        <svg viewBox="0 0 200 200" class="parallax-svg">
            <circle cx="100" cy="100" r="80" fill="rgba(201, 76, 53, 0.1)"/>
        </svg>
    </div>
    <div class="parallax-layer layer-svg2">
        <svg viewBox="0 0 300 300" class="parallax-svg">
            <circle cx="150" cy="150" r="120" fill="rgba(141, 163, 153, 0.08)"/>
        </svg>
    </div>
    <div class="parallax-layer layer-svg3">
        <svg viewBox="0 0 150 150" class="parallax-svg">
            <circle cx="75" cy="75" r="60" fill="rgba(255, 255, 255, 0.05)"/>
        </svg>
    </div>
</div>

<!-- Background Blobs -->
<div class="bg-wrap">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
</div>

<div class="page-header">
    <div class="container">
        <h1>{t.contact_title || 'Contact Us'}</h1>
    </div>
</div>

<div class="container">
    <section class="contact-section">
        <div class="contact-content">

            <!-- Contact Info Column -->
            <div class="contact-info">

                <div class="contact-methods">
                    <!-- Email Card -->
                    <div class="contact-method">
                        <div class="method-icon">📧</div>
                        <div class="method-content">
                            <h3>{t.method_email_title || 'Email Us'}</h3>
                            <a href="mailto:info@pinchepoutine.digital" class="method-link">
                                {t.method_email_addr || 'info@example.com'}
                            </a>
                            <small>{t.method_email_note || 'Response time'}</small>
                        </div>
                    </div>

                    <!-- Chat Card -->
                    <a href="#contact-form" class="contact-method-link">
                        <div class="contact-method">
                            <div class="method-icon">💬</div>
                            <div class="method-content">
                                <h3>{t.method_chat_title || 'Let us Chat'}</h3>
                                <p>{t.method_chat_desc || 'Schedule a consultation'}</p>
                                <small>{t.method_chat_note || 'Free 30-minute discovery call'}</small>
                            </div>
                        </div>
                    </a>

                    <!-- Start Project Card -->
                    <a href="#contact-form" class="contact-method-link">
                        <div class="contact-method">
                            <div class="method-icon">🚀</div>
                            <div class="method-content">
                                <h3>{t.method_start_title || 'Start Your Project'}</h3>
                                <p>{t.method_start_desc || 'Ready to begin?'}</p>
                                <small>{t.method_start_note || 'Tell us about your vision'}</small>
                            </div>
                        </div>
                    </a>
                </div>

                <div class="office-hours">
                    
                    <h3>{t.office_hours_title || 'By Appointment Only'}</h3>
                    <p class="timezone-label">Guadalajara, México (GMT-6)</p>
                    <p class="current-time"><strong>{guadalajaraTime}</strong></p>
                    <p>{t.office_hours_weekend || 'Flexible scheduling available'}</p>
                    <small>{t.office_hours_note || 'Contact me to find a time that works'}</small>
                </div>
            </div>

            <div class="contact-form-container" id="contact-form">
                <h2>{t.contact_form_section || 'Send us a Message'}</h2>
                <ContactForm />
            </div>
        </div>
    </section>

</div>

<style>
    /* Parallax Background */
    .parallax-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: -2;
        pointer-events: none;
        overflow: hidden;
    }

    .parallax-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('https://imagedelivery.net/4bRSwPonOXfEIBVZiDXg0w/f8a136eb-363e-4a24-0f54-70bb4f4bf800/full');
        background-size: cover;
        background-position: center;
        opacity: 0.25;
        filter: blur(6px);
    }

    .parallax-circles .circle {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(201, 76, 53, 0.15) 0%, transparent 70%);
        animation: float 20s infinite ease-in-out;
    }

    .c1 { width: 60px; height: 60px; top: 10%; left: 10%; animation-delay: 0s; }
    .c2 { width: 40px; height: 40px; top: 60%; left: 80%; animation-delay: -5s; }
    .c3 { width: 80px; height: 80px; top: 70%; left: 20%; animation-delay: -10s; }
    .c4 { width: 30px; height: 30px; top: 30%; left: 70%; animation-delay: -15s; }
    .c5 { width: 50px; height: 50px; top: 80%; left: 50%; animation-delay: -7s; }
    .c6 { width: 35px; height: 35px; top: 20%; left: 90%; animation-delay: -12s; }

    @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(30px, -40px) scale(1.1); }
        50% { transform: translate(-20px, 30px) scale(0.9); }
        75% { transform: translate(40px, 20px) scale(1.05); }
    }

    @media (prefers-reduced-motion: reduce) {
        .parallax-circles .circle {
            animation: none;
        }
    }

    /* Parallax Background Layers */
    .parallax-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: -2;
        pointer-events: none;
        overflow: hidden;
    }

    .parallax-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: transform 0.1s ease-out;
    }

    .layer-bg {
        background-image: url('https://imagedelivery.net/4bRSwPonOXfEIBVZiDXg0w/f8a136eb-363e-4a24-0f54-70bb4f4bf800/full');
        background-size: cover;
        background-position: center;
        opacity: 0.2;
        filter: blur(10px);
    }

    .layer-svg1 { transform: translateY(0); }
    .layer-svg2 { transform: translateY(0); }
    .layer-svg3 { transform: translateY(0); }

    .parallax-svg {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    @media (prefers-reduced-motion: reduce) {
        .parallax-layer {
            transition: none;
        }
    }
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
        box-sizing: border-box;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        position: relative;
        z-index: 2;
    }

    /* --- Page Header --- */
    .page-header {
        background: transparent;
        color: var(--color-text);
        padding: 1rem 0 0.5rem;
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
        color: var(--color-text);
    }

    .subtitle {
        font-size: 1.25rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
        font-weight: 300;
        color: var(--color-text);
    }

    /* --- Contact Section --- */
    .contact-section {
        padding: 1rem 0 2rem;
    }

    .contact-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
    }

    .contact-info h2,
    .contact-form-container h2 {
        color: var(--color-text);
        margin-bottom: 1.5rem;
        font-size: 2.2rem;
        font-weight: 800;
    }

    .contact-info > p {
        line-height: 1.8;
        color: #5F6E68;
        font-size: 1.1rem;
        margin-bottom: 2.5rem;
    }

    /* Contact Methods */
    .contact-methods {
        margin-bottom: 2.5rem;
    }

    .contact-method {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        padding: 1.5rem;
        background: var(--color-white);
        border-radius: 24px;
        transition: all 0.4s ease;
        border: 1px solid rgba(45, 58, 54, 0.05);
        box-shadow: 0 5px 20px rgba(45, 58, 54, 0.05);
    }

    .contact-method:hover {
        transform: translateX(10px);
        border-color: rgba(141, 163, 153, 0.4);
        box-shadow: 0 15px 35px rgba(141, 163, 153, 0.2);
    }

    .method-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
    }

    .method-content h3 {
        margin: 0 0 0.5rem 0;
        color: var(--color-text);
        font-size: 1.2rem;
        font-weight: 700;
    }

    .method-content p {
        margin: 0 0 0.25rem 0;
        color: var(--color-brick);
        font-weight: 600;
        font-size: 0.95rem;
    }

    .method-content small {
        color: #999;
        font-size: 0.85rem;
        display: block;
    }

    .method-link {
        color: var(--color-brick) !important;
        font-weight: 600;
        text-decoration: none;
        transition: color 0.2s;
        font-size: 1rem;
    }

    .method-link:hover {
        color: var(--color-sage) !important;
    }

    /* Office Hours */
    .office-hours {
        background: var(--color-sage);
        color: var(--color-text);
        padding: 2.5rem;
        border-radius: 24px;
        margin-top: 2rem;
        position: relative;
        overflow: hidden;
    }

    .office-hours::before {
        content: '';
        position: absolute;
        width: 150px;
        height: 150px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        top: -50px;
        right: -50px;
        filter: blur(30px);
    }

    .office-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .office-hours h3 {
        margin: 0 0 1rem 0;
        font-size: 1.3rem;
        font-weight: 700;
        position: relative;
        z-index: 2;
    }

    .timezone-label {
        font-size: 1.1rem;
        opacity: 0.95;
        margin-bottom: 1rem;
        position: relative;
        z-index: 2;
    }

    .current-time {
        text-align: center;
        display: inline-block;
        font-size: 1.2rem;
        background: rgba(255, 255, 255, 0.15);
        padding: 0.75rem 1rem;
        border-radius: 12px;
        margin: 1rem 0;
        position: relative;
        z-index: 2;
    }

    .current-time strong {
        font-family: 'Courier New', monospace;
        font-weight: 700;
        color: #fff;
    }

    .office-hours p {
        margin: 0.5rem 0;
        font-size: 1.05rem;
        opacity: 0.95;
        position: relative;
        z-index: 2;
    }

    .office-hours small {
        opacity: 0.8;
        font-size: 0.85rem;
        display: block;
        margin-top: 1rem;
        position: relative;
        z-index: 2;
    }

    /* Contact Form */
    .contact-form-container {
        background: var(--color-white);
        padding: 3rem;
        border-radius: 30px;
        box-shadow: 0 15px 40px rgba(45, 58, 54, 0.08);
        border: 1px solid rgba(45, 58, 54, 0.05);
    }

    /* FAQ Section */
    .faq-section {
        padding: 6rem 0;
        background: rgba(141, 163, 153, 0.1);
        border-radius: 40px;
        margin: 0 -2rem 0;
        padding-left: 2rem;
        padding-right: 2rem;
    }

    .faq-section .container {
        box-sizing: border-box;
        width: 100%;
        max-width: 1200px;
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

    .faq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        box-sizing: border-box;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .faq-item {
        background: var(--color-white);
        padding: 2.5rem;
        border-radius: 24px;
        box-shadow: 0 5px 20px rgba(45, 58, 54, 0.05);
        border: 1px solid rgba(45, 58, 54, 0.05);
        transition: all 0.4s ease;
    }

    .faq-item:hover {
        transform: translateY(-5px);
        border-color: rgba(141, 163, 153, 0.4);
        box-shadow: 0 15px 35px rgba(141, 163, 153, 0.2);
    }

    .faq-item h3 {
        color: var(--color-text);
        margin-bottom: 1rem;
        font-size: 1.3rem;
        font-weight: 700;
        line-height: 1.3;
    }

    .faq-item p {
        color: #6B7C76;
        line-height: 1.7;
        margin: 0;
        font-size: 1.05rem;
    }

    /* Link Styles */
    .contact-method-link {
        text-decoration: none;
        color: inherit;
        display: block;
        border-radius: 24px;
        transition: transform 0.4s ease;
    }

    .contact-method-link:hover {
        transform: translateY(-5px);
    }

    @media (max-width: 900px) {
        .contact-content {
            grid-template-columns: 1fr;
        }
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

        .contact-info h2,
        .contact-form-container h2,
        .section-header h2 {
            font-size: 2rem;
        }

        .contact-method {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .faq-section {
            margin: 0;
            border-radius: 0;
            padding: 4rem 1rem;
        }

        .contact-form-container {
            padding: 2rem;
        }
    }
</style>
