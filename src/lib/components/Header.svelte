<script>
    import { page } from '$app/stores';
    import { browser } from '$app/environment';

    // Svelte 5 Runes: State management
    let isOpen = $state(false);

    // Get translations from page data (set in layout load function)
    let t = $derived($page.data?.t || {});

    // Function to toggle mobile menu and lock body scroll
    function toggleMenu() {
        isOpen = !isOpen;
        // Prevent scrolling behind the menu
        if (browser) {
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }
    }

    // Function to close menu (helper)
    function closeMenu() {
        isOpen = false;
        if (browser) {
            document.body.style.overflow = '';
        }
    }

    // Language Switcher Logic
    function setLanguage(lang) {
        document.cookie = `lang=${lang}; path=/; max-age=31536000`;
        // Reload is the simplest way to re-render SSR pages with new lang
        if (browser) {
            window.location.reload();
        }
    }
</script>

<header class="header">
    <div class="container">
        <div class="nav-wrapper">

            <!-- 1. Logo (Visible always) -->
            <a href="/" class="logo" onclick={closeMenu}>
                <span class="logo-main">{t.logo_text || '¡Pinche Poutine!'}</span>
                <span class="logo-digital">Digital</span>
            </a>

            <!-- 2. Desktop Navigation (Hidden on Mobile) -->
            <nav class="nav-desktop">
                <a href="/services">{t.nav_services || 'Services'}</a>
                <a href="/blog">{t.nav_blog || 'Blog'}</a>
                <a href="/contact" class="nav-cta">{t.nav_cta || 'Contact'}</a>
            </nav>

            <!-- 3. Language Switcher (Visible on Desktop) -->
            <div class="lang-switcher-desktop">
                <button class="lang-btn" onclick={() => setLanguage('en')}>EN</button>
                <div class="divider">|</div>
                <button class="lang-btn" onclick={() => setLanguage('es')}>ES</button>
                <div class="divider">|</div>
                <button class="lang-btn" onclick={() => setLanguage('fr')}>FR</button>
            </div>

            <!-- 4. Hamburger Button (Visible only on Mobile) -->
            <button
                class="hamburger"
                class:is-open={isOpen}
                onclick={toggleMenu}
                aria-label="Toggle navigation"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </div>

    <!-- 5. Mobile Menu Drawer (Slide-in Overlay) -->
    {#if isOpen}
        <div class="mobile-menu-overlay">
            <div class="mobile-menu-content">

                <!-- Mobile Menu Links -->
                <div class="mobile-links">
                    <a href="/services" onclick={closeMenu} class="mobile-link">{t.nav_services || 'Services'}</a>
                    <a href="/blog" onclick={closeMenu} class="mobile-link">{t.nav_blog || 'Blog'}</a>
                    <a href="/contact" onclick={closeMenu} class="mobile-link">{t.nav_contact || 'Contact'}</a>
                </div>

                <!-- Mobile Language Switcher (Inside menu for cleaner UI) -->
                <div class="mobile-lang-section">
                    <p>{t.lang_choose || 'Choose Language'}:</p>
                    <div class="mobile-lang-buttons">
                        <button class="mobile-lang-btn" onclick={() => setLanguage('en')}>{t.lang_english || 'English'}</button>
                        <button class="mobile-lang-btn" onclick={() => setLanguage('es')}>{t.lang_spanish || 'Español'}</button>
                        <button class="mobile-lang-btn" onclick={() => setLanguage('fr')}>{t.lang_french || 'Français'}</button>
                    </div>
                </div>

            </div>
        </div>
    {/if}
</header>

<style>
    /* --- CSS Variables --- */
    :global(:root) {
        --color-bg: #F9F6F0;
        --color-text: #2D3A36;
        --color-brick: #C94C35;
        --color-sage: #8DA399;
        --color-white: #FFFFFF;
    }

    /* --- Base Header Styles --- */
    .header {
        background: var(--color-bg);
        padding: 1rem 0;
        border-bottom: 1px solid rgba(45, 58, 54, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .nav-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
    }

    /* Logo */
    .logo {
        font-family: 'Outfit', sans-serif;
        font-weight: 900;
        font-size: 1.4rem;
        text-decoration: none;
        color: var(--color-text);
        text-transform: uppercase;
        letter-spacing: -0.5px;
        position: relative;
        z-index: 1001;
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
        flex-wrap: wrap;
    }

    .logo-main {
        white-space: nowrap;
    }

    .logo-digital {
        font-weight: 700;
        font-size: 0.85em;
        color: var(--color-sage);
        letter-spacing: 0.5px;
    }

    /* --- Desktop Nav --- */
    .nav-desktop {
        display: none; /* Mobile First: Hidden */
    }

    .nav-desktop a {
        font-family: 'Outfit', sans-serif;
        text-decoration: none;
        color: var(--color-text);
        font-weight: 500;
        font-size: 1.05rem;
        transition: color 0.2s;
        margin-right: 1rem;
    }

    .nav-desktop a:hover {
        color: var(--color-brick);
    }

    .nav-cta {
        background: var(--color-brick);
        color: var(--color-white) !important;
        padding: 0.5rem 1.5rem;
        border-radius: 50px;
        margin-left: 1rem;
    }

    .nav-cta:hover {
        background: #A83926 !important;
        color: var(--color-white);
    }

    /* --- Desktop Language Switcher --- */
    .lang-switcher-desktop {
        display: none; /* Mobile First: Hidden */
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        margin-left: 1.5rem;
    }

    .lang-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 2px 4px;
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
        transition: all 0.2s;
    }

    .lang-btn:hover {
        color: var(--color-brick);
        transform: translateY(-1px);
    }

    .divider {
        color: #ccc;
        font-size: 0.8rem;
    }

    /* --- Hamburger Button --- */
    .hamburger {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 2.5rem;
        height: 2.5rem;
        background: transparent;
        border: none;
        cursor: pointer;
        z-index: 1001;
        padding: 0;
    }

    .hamburger span {
        width: 2.5rem;
        height: 3px;
        background: var(--color-text);
        border-radius: 10px;
        transition: all 0.3s linear;
        transform-origin: 1px;
    }

    .hamburger.is-open span:nth-child(1) {
        transform: rotate(45deg);
    }
    .hamburger.is-open span:nth-child(2) {
        opacity: 0;
        transform: translateX(20px);
    }
    .hamburger.is-open span:nth-child(3) {
        transform: rotate(-45deg);
    }

    /* --- Mobile Menu Overlay --- */
    .mobile-menu-overlay {
        position: fixed;
        inset: 0;
        background: var(--color-text);
        color: var(--color-white);
        z-index: 999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        animation: slideIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .mobile-menu-content {
        text-align: center;
        width: 100%;
        max-width: 400px;
        padding: 2rem;
        box-sizing: border-box;
    }

    /* --- FIX FOR SCRUNCHED MENU --- */
    .mobile-links {
        display: flex;
        flex-direction: column; /* Force vertical stack */
        gap: 1.5rem;          /* Add vertical spacing */
        width: 100%;           /* Full width */
        margin-bottom: 4rem;
    }

    .mobile-link {
        font-family: 'Outfit', sans-serif;
        font-size: 2.5rem;      /* Made slightly larger */
        font-weight: 700;
        color: var(--color-white);
        text-decoration: none;
        display: block;         /* Force block to take new line */
        padding: 0.5rem 0;    /* Add breathing room */
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
        line-height: 1.2;
    }

    .mobile-link:hover {
        color: var(--color-brick);
        border-bottom-color: var(--color-brick);
        transform: translateX(10px);
    }

    /* Mobile Language Section inside Menu */
    .mobile-lang-section {
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 100%;
    }

    .mobile-lang-section p {
        margin: 0 0 1.2rem 0;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        opacity: 0.8;
    }

    .mobile-lang-buttons {
        display: flex;
        flex-direction: column; /* Stack language buttons */
        gap: 0.8rem;
    }

    .mobile-lang-btn {
        background: transparent;
        border: 2px solid var(--color-white);
        color: var(--color-white);
        padding: 1rem;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Outfit', sans-serif;
        font-size: 1rem;
    }

    .mobile-lang-btn:hover {
        background: var(--color-white);
        color: var(--color-text);
    }

    /* --- Desktop Query --- */
    @media (min-width: 769px) {
        .nav-desktop {
            display: flex;
            align-items: center;
        }

        .lang-switcher-desktop {
            display: flex;
        }

        .hamburger {
            display: none;
        }
    }
</style>
