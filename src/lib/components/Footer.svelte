<script>
    import { page } from '$app/stores';
    import SubscribeForm from './SubscribeForm.svelte';

    // Get translations from page data (set in layout load function)
    let t = $derived($page.data?.t || {});
</script>

<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>¡Pinche Poutine!</h3>
                <p>{t.footer_tagline || 'Building amazing experiences with modern web technologies.'}</p>
            </div>

            <div class="footer-section">
                <h4>{t.footer_quick_links || 'Quick Links'}</h4>
                <ul>
                    <li><a href="/">{t.footer_home || 'Home'}</a></li>
                    <li><a href="/about">{t.footer_about || 'About'}</a></li>
                    <li><a href="/services">{t.footer_services || 'Services'}</a></li>
                    <li><a href="/blog">{t.footer_blog || 'Blog'}</a></li>
                    <li><a href="/contact">{t.footer_contact || 'Contact'}</a></li>
                </ul>
            </div>

            <div class="footer-section newsletter">
                <h4>{t.footer_stay_updated || 'Stay Updated'}</h4>
                <p>{t.footer_newsletter_desc || 'Subscribe to our newsletter for the latest updates.'}</p>
                <SubscribeForm />
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; {new Date().getFullYear()} ¡Pinche Poutine! Digital. {t.footer_rights || 'All rights reserved.'}</p>
            <div class="footer-links">
                <a href="/privacy">{t.footer_privacy || 'Privacy Policy'}</a>
                <a href="/terms">{t.footer_terms || 'Terms of Service'}</a>
            </div>
        </div>
    </div>
</footer>

<style>
    .footer {
        background: #2c3e50;
        color: white;
        padding: 3rem 0 1rem;
        margin-top: 4rem;
    }

    .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .footer-section h3,
    .footer-section h4 {
        margin-bottom: 1rem;
        color: #ecf0f1;
    }

    .footer-section h3 {
        font-size: 1.5rem;
        color: #3498db;
    }

    .footer-section p {
        margin-bottom: 1rem;
        color: #bdc3c7;
        line-height: 1.6;
    }

    .footer-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .footer-section ul li {
        margin-bottom: 0.5rem;
    }

    .footer-section ul li a {
        color: #bdc3c7;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .footer-section ul li a:hover {
        color: #3498db;
    }

    .newsletter {
        max-width: 300px;
    }

    .footer-bottom {
        border-top: 1px solid #34495e;
        padding-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .footer-bottom p {
        margin: 0;
        color: #bdc3c7;
    }

    .footer-links {
        display: flex;
        gap: 1rem;
    }

    .footer-links a {
        color: #bdc3c7;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s ease;
    }

    .footer-links a:hover {
        color: #3498db;
    }

    @media (max-width: 768px) {
        .footer-bottom {
            flex-direction: column;
            text-align: center;
        }
    }
</style>
