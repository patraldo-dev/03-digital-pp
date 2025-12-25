<script>
    import ContactForm from '$lib/components/ContactForm.svelte';
    
    // Svelte 5 Runes: Props
    let { data } = $props();
    let t = $derived(data?.t || {});
</script>

<svelte:head>
    <title>{t.contact_title || 'Contact'} - ¡Pinche Poutine! Digital</title>
    <meta name="description" content={t.contact_subtitle || ''} />
</svelte:head>

<div class="page-header">
    <div class="container">
        <div class="badge">Get in Touch</div>
        <h1>{t.contact_title || 'Contact Us'}</h1>
        <p class="subtitle">{t.contact_subtitle || 'We\'d love to hear from you'}</p>
    </div>
</div>

<div class="container">
    <section class="contact-section">
        <div class="contact-content">
            
            <!-- Contact Info Column -->
            <div class="contact-info">
                <h2>{t.methods_title || 'Get in Touch'}</h2>
                <p>{t.methods_desc || 'Have a project in mind...'}</p>

                <div class="contact-methods">
                    <div class="contact-method">
                        <div class="method-icon">📧</div>
                        <div class="method-content">
                            <h3>{t.method_email_title || 'Email Us'}</h3>
                            <p>{t.method_email_addr || 'info@example.com'}</p>
                            <small>{t.method_email_note || 'Response time'}</small>
                        </div>
                    </div>

                    <div class="contact-method">
                        <div class="method-icon">💬</div>
                        <div class="method-content">
                            <h3>{t.method_chat_title || 'Let\'s Chat'}</h3>
                            <p>{t.method_chat_desc || 'Schedule a consultation'}</p>
                            <small>{t.method_chat_note || 'Free call'}</small>
                        </div>
                    </div>

                    <div class="contact-method">
                        <div class="method-icon">🚀</div>
                        <div class="method-content">
                            <h3>{t.method_start_title || 'Start Project'}</h3>
                            <p>{t.method_start_desc || 'Ready to begin?'}</p>
                            <small>{t.method_start_note || 'Tell us about vision'}</small>
                        </div>
                    </div>
                </div>

                <div class="office-hours">
                    <h3>{t.office_hours_title || 'Office Hours'}</h3>
                    <p>{t.office_hours_weekday || 'Mon-Fri'}</p>
                    <p>{t.office_hours_weekend || 'Weekend'}</p>
                    <small>{t.office_hours_note || 'Local timezone'}</small>
                </div>
            </div>

            <!-- Contact Form Column -->
            <div class="contact-form-container">
                <h2>{t.form_title || 'Send us a Message'}</h2>
                <ContactForm />
            </div>
        </div>
    </section>

    <section class="faq-section">
        <div class="container">
            <div class="section-header">
                <h2>{t.faq_title || 'FAQ'}</h2>
                <div class="line"></div>
            </div>
            
            <div class="faq-grid">
                <div class="faq-item">
                    <h3>{t.faq_q1 || 'Question 1'}</h3>
                    <p>{t.faq_a1 || 'Answer 1'}</p>
                </div>
                <div class="faq-item">
                    <h3>{t.faq_q2 || 'Question 2'}</h3>
                    <p>{t.faq_a2 || 'Answer 2'}</p>
                </div>
                <div class="faq-item">
                    <h3>{t.faq_q3 || 'Question 3'}</h3>
                    <p>{t.faq_a3 || 'Answer 3'}</p>
                </div>
                <div class="faq-item">
                    <h3>{t.faq_q4 || 'Question 4'}</h3>
                    <p>{t.faq_a4 || 'Answer 4'}</p>
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    /* --- Palette --- */
    :root {
        --color-bg: #F9F6F0;
        --color-text: #2D3A36;
        --color-brick: #C94C35;
        --color-sage: #8DA399;
        --color-white: #FFFFFF;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    /* Header */
    .page-header {
        background: linear-gradient(135deg, var(--color-text) 0%, #1a201e 100%);
        color: var(--color-white);
        padding: 5rem 0;
        text-align: center;
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
        font-size: clamp(2.5rem, 5vw, 3.5rem);
        margin-bottom: 1rem;
        font-weight: 800;
    }

    .subtitle {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
        font-weight: 300;
    }

    /* Section */
    .contact-section {
        padding: 5rem 0;
    }

    .contact-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
    }

    /* Info Column */
    .contact-info h2,
    .contact-form-container h2 {
        color: var(--color-text);
        margin-bottom: 1.5rem;
        font-size: 2.2rem;
        font-weight: 800;
    }

    .contact-info p {
        line-height: 1.8;
        color: #555;
        font-size: 1.1rem;
        margin-bottom: 2.5rem;
    }

    .contact-methods {
        margin-bottom: 2.5rem;
    }

    .contact-method {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--color-white);
        border-radius: 20px;
        transition: all 0.3s ease;
        border: 1px solid rgba(45, 58, 54, 0.05);
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    .contact-method:hover {
        transform: translateX(10px);
        border-color: var(--color-sage);
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    }

    .method-icon {
        font-size: 2rem;
        flex-shrink: 0;
        padding-top: 5px;
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
    }

    .method-content small {
        color: #999;
        font-size: 0.9rem;
        display: block;
    }

    /* Office Hours */
    .office-hours {
        background: var(--color-sage);
        color: var(--color-white);
        padding: 2rem;
        border-radius: 20px;
        margin-top: 2rem;
    }

    .office-hours h3 {
        margin: 0 0 1rem 0;
        font-size: 1.3rem;
        font-weight: 700;
    }

    .office-hours p {
        margin: 0.5rem 0;
        font-size: 1.05rem;
        opacity: 0.95;
    }

    .office-hours small {
        opacity: 0.8;
        font-size: 0.9rem;
        display: block;
        margin-top: 1rem;
    }

    /* Form */
    .contact-form-container {
        background: var(--color-white);
        padding: 2.5rem;
        border-radius: 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        border: 1px solid rgba(45, 58, 54, 0.05);
    }

    /* FAQ Section */
    .faq-section {
        padding: 6rem 0;
        background: var(--color-bg);
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

    .faq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .faq-item {
        background: var(--color-white);
        padding: 2.5rem;
        border-radius: 24px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.04);
        border: 1px solid rgba(45, 58, 54, 0.05);
        transition: transform 0.3s ease;
    }

    .faq-item:hover {
        transform: translateY(-5px);
        border-color: var(--color-brick);
    }

    .faq-item h3 {
        color: var(--color-text);
        margin-bottom: 1rem;
        font-size: 1.3rem;
        font-weight: 700;
        line-height: 1.3;
    }

    .faq-item p {
        color: #666;
        line-height: 1.6;
        margin: 0;
    }

    @media (max-width: 900px) {
        .contact-content {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .page-header h1 {
            font-size: 2.5rem;
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
    }
</style>
