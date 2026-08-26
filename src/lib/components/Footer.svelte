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

