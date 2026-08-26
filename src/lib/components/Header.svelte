<script>
    // src/lib/components/Header.svelte
    
    let { lang = 'en', t = {} } = $props();
    
    /** @type {boolean} */
    let menuOpen = $state(false);
    
    /**
     * @param {string} newLang
     */
    function setLanguage(newLang) {
        document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
        window.location.reload();
    }
</script>

<header>
    <div class="container">
        <div class="header-inner">
            <a href="/" class="logo">
                <span>📝</span>
                <span>{t.site_title || 'My Blog'}</span>
            </a>
            
            <button class="menu-toggle" onclick={() => menuOpen = !menuOpen}>
                ☰
            </button>
            
            <nav class={menuOpen ? 'open' : ''}>
                <ul>
                    <li><a href="/">{t.nav_home || 'Home'}</a></li>
                    <li><a href="/blog">{t.nav_blog || 'Blog'}</a></li>
                    <li><a href="/contact">{t.nav_contact || 'Contact'}</a></li>
                    <li class="lang-switcher">
                        <button onclick={() => setLanguage('en')} class:active={lang === 'en'}>EN</button>
                        <button onclick={() => setLanguage('es')} class:active={lang === 'es'}>ES</button>
                        <button onclick={() => setLanguage('fr')} class:active={lang === 'fr'}>FR</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</header>

<style>
    header {
        background: #fff;
        border-bottom: 1px solid #e9ecef;
        padding: 1rem 0;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }
    .header-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        font-size: 1.25rem;
        font-weight: 600;
        color: #2c3e50;
    }
    .logo span:first-child {
        font-size: 1.5rem;
    }
    .menu-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
    }
    nav ul {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    nav a {
        text-decoration: none;
        color: #495057;
        transition: color 0.2s;
    }
    nav a:hover {
        color: #007bff;
    }
    .lang-switcher {
        display: flex;
        gap: 0.25rem;
    }
    .lang-switcher button {
        background: none;
        border: 1px solid #ced4da;
        padding: 0.25rem 0.5rem;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 500;
        transition: all 0.2s;
    }
    .lang-switcher button:hover {
        background: #e9ecef;
    }
    .lang-switcher button.active {
        background: #007bff;
        color: #fff;
        border-color: #007bff;
    }
    @media (max-width: 768px) {
        .menu-toggle {
            display: block;
        }
        nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #fff;
            padding: 1rem;
            border-bottom: 1px solid #e9ecef;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        nav.open {
            display: block;
        }
        nav ul {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
        }
        nav ul li {
            padding: 0.5rem 0;
        }
        .lang-switcher {
            justify-content: center;
        }
    }
</style>
