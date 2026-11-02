<script>
    import SubscribeForm from './SubscribeForm.svelte';

    // Receive props from layout instead of using $page directly
    let { lang = 'en', t = {} } = $props();
</script>

<footer class="footer">
    <div class="footer-container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>¡Pinche Poutine! <span class="digital">Digital</span></h3>
                <p>{t.footer_tagline || 'Building amazing apps with modern web technology.'}</p>
            </div>

            <div class="footer-section">
                <h4>{t.footer_quick_links || 'Quick Links'}</h4>
                <ul>
                    <li><a href="/">{t.footer_home || 'Home'}</a></li>
                    <li><a href="/blog">{t.footer_blog || 'Blog'}</a></li>
                    <li><a href="/contact">{t.footer_contact || 'Contact'}</a></li>
                </ul>
            </div>

            <div class="footer-section newsletter">
                <h4>{t.footer_stay_updated || 'Stay Updated'}</h4>
                <p>{t.footer_newsletter_desc || 'Subscribe to our newsletter for the latest updates.'}</p>
                <SubscribeForm {t} />
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; {new Date().getFullYear()} ¡Pinche Poutine! Digital. {t.footer_rights || 'All rights reserved.'}</p>
        </div>
    </div>
</footer>

<style>
    .footer {
        background: var(--color-text);
        color: var(--color-bg);
        margin-top: 3rem;
    }

    .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .footer-content {
        display: grid;
        grid-template-columns: 2fr 1fr 1.5fr;
        gap: 2.5rem;
        padding: 3rem 0 2rem;
    }

    .footer-section h3 {
        margin: 0 0 0.75rem;
        font-size: 1.3rem;
        color: var(--color-bg);
    }

    .footer-section h4 {
        margin: 0 0 1rem;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-bg);
    }

    .digital {
        color: #a8bdb3;
    }

    .footer-section p {
        margin: 0 0 1rem;
        color: rgba(249, 246, 240, 0.8);
    }

    .footer-section ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .footer-section li + li {
        margin-top: 0.5rem;
    }

    .footer-section a {
        color: #a8bdb3;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .footer-section a:hover {
        color: var(--color-bg);
    }

    .footer-bottom {
        border-top: 1px solid rgba(249, 246, 240, 0.2);
        padding: 1.25rem 0;
        text-align: center;
    }

    .footer-bottom p {
        margin: 0;
        font-size: 0.875rem;
        color: rgba(249, 246, 240, 0.7);
    }

    @media (max-width: 768px) {
        .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2.5rem 0 1.5rem;
            text-align: center;
        }

        .footer-content :global(.subscribe-form) {
            justify-content: center;
        }
    }
</style>
