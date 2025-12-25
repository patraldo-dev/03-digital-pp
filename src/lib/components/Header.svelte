<script>
    // Language Switcher Logic
    function setLanguage(lang) {
        // Set a cookie for 1 year
        document.cookie = `lang=${lang}; path=/; max-age=31536000`;
        // Reload the page to apply the new language
        window.location.reload();
    }
</script>

<header class="header">
    <div class="container">
        <div class="nav-wrapper">
            <!-- Logo Area -->
            <a href="/" class="logo">¡Pinche Poutine!</a>

            <!-- Navigation -->
            <nav class="nav">
                <a href="/about">About</a>
                <a href="/services">Services</a>
                <a href="/blog">Blog</a>
                <a href="/contact" class="nav-cta">Contact</a>
            </nav>

            <!-- Language Switcher -->
            <div class="lang-switcher">
                <button 
                    class="lang-btn" 
                    aria-label="Switch to English"
                    onclick={() => setLanguage('en')}
                >
                    EN
                </button>
                <div class="divider">|</div>
                <button 
                    class="lang-btn" 
                    aria-label="Cambiar a Español"
                    onclick={() => setLanguage('es')}
                >
                    ES
                </button>
                <div class="divider">|</div>
                <button 
                    class="lang-btn" 
                    aria-label="Passer au Français"
                    onclick={() => setLanguage('fr')}
                >
                    FR
                </button>
            </div>
        </div>
    </div>
</header>

<style>
    .header {
        background: var(--color-white, #F9F6F0);
        padding: 1rem 0;
        border-bottom: 1px solid rgba(45, 58, 54, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .nav-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo {
        font-weight: 900;
        font-size: 1.2rem;
        text-decoration: none;
        color: var(--color-text, #2D3A36);
        text-transform: uppercase;
        letter-spacing: -0.5px;
    }

    .nav {
        display: flex;
        gap: 2rem;
        align-items: center;
    }

    .nav a {
        text-decoration: none;
        color: var(--color-text, #2D3A36);
        font-weight: 500;
        transition: color 0.2s;
    }

    .nav a:hover {
        color: var(--color-brick, #C94C35);
    }

    .nav-cta {
        background: var(--color-brick, #C94C35);
        color: white !important;
        padding: 0.5rem 1.5rem;
        border-radius: 50px;
    }

    .nav-cta:hover {
        background: #A83926 !important;
        color: white;
    }

    /* Language Switcher */
    .lang-switcher {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .lang-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 2px 4px;
        font-size: 0.85rem;
        transition: all 0.2s;
    }

    .lang-btn:hover {
        color: var(--color-brick, #C94C35);
        transform: translateY(-1px);
    }

    .divider {
        color: #ccc;
        font-size: 0.8rem;
    }

    /* Mobile handling (basic) */
    @media (max-width: 768px) {
        .nav {
            display: none; /* You'd usually want a hamburger menu here */
        }
        
        .lang-switcher {
            gap: 0.25rem;
        }
    }
</style>
