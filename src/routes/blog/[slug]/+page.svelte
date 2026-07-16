<script>
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import mermaid from 'mermaid';
    import { marked } from 'marked';
    import DOMPurify from 'dompurify';
    import { untrack } from 'svelte';

    // Svelte 5: Get props
    let { data } = $props();

    // Get translations from page data
    let t = $derived($page.data?.t || {});

    // Configure marked (idempotent — safe to call once)
    marked.setOptions({
        breaks: true,
        gfm: true
    });

    /**
     * Turns longer than this many characters (plain text) start
     * collapsed with a preview + fade, so the reader can scan a
     * whole conversation quickly and expand what interests them.
     * Below the threshold the turn renders in full.
     */
    const PREVIEW_CHARS = 240;

    const SPEAKER_RE = /^(Patrouch|ZCode|Chef Tech|Pinche Poutine):\s*$/i;

    /** Display names for language codes, for badges/chips. */
    const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français' };

    /** The reader's UI locale (from cookie via layout). */
    let readerLang = $derived($page.data?.lang || 'en');

    /** The language the post was actually written in. */
    let postLang = $derived(data.post?.original_lang || data.post?.source_lang || 'en');

    /** Whether this post is being shown in a language other than the reader's. */
    let isForeignToReader = $derived(postLang !== readerLang);

    /** Strip markdown/HTML to approximate visible length. */
    function plainLength(md) {
        return (md || '')
            .replace(/```[\s\S]*?```/g, ' ')   // code fences
            .replace(/`[^`]*`/g, ' ')          // inline code
            .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
            .replace(/[#>*_~|-]/g, ' ')        // markdown punctuation
            .replace(/\s+/g, ' ')
            .trim().length;
    }

    function renderSection(section, idx) {
        const html = marked.parse(section.content || '', { async: false });
        const clean = browser ? DOMPurify.sanitize(html) : html;
        const isSpeaker = SPEAKER_RE.test((section.title || '').trim());
        const speakerName = isSpeaker
            ? (section.title || '').trim().replace(/:\s*$/, '')
            : null;
        const len = plainLength(section.content || '');
        const isLong = isSpeaker && len > PREVIEW_CHARS;
        // A turn may carry its own `lang` field when the speaker
        // switched languages (e.g. a Spanish reply in an English thread).
        const turnLang = section.lang || null;
        return {
            ...section,
            _idx: idx,
            _html: clean,
            _isSpeaker: isSpeaker,
            _speaker: speakerName,
            _isLong: isLong,
            _expanded: false,
            _turnLang: turnLang
        };
    }

    // Pre-render sections once per post.
    let renderedSections = $derived.by(() => {
        const sections = data.post?.sections;
        if (!sections || !sections.length) return [];
        return sections.map((s, i) => renderSection(s, i));
    });

    // Global expand-all override: null = each turn uses its own state,
    // true = force all open, false = force all collapsed.
    let forceExpand = $state(null);

    // Whether any turn is long enough to warrant the toolbar at all.
    let hasLongTurns = $derived(renderedSections.some((s) => s._isLong));

    function isExpanded(section) {
        if (forceExpand !== null) return forceExpand;
        return section._expanded || !section._isLong;
    }

    function toggleTurn(section) {
        // Only meaningful in per-turn mode (forceExpand === null)
        section._expanded = !section._expanded;
    }

    // Fallback htmlContent (legacy posts without sections) — sanitize on client.
    let safeHtmlContent = $derived.by(() => {
        const html = data.post?.htmlContent || '';
        return browser ? DOMPurify.sanitize(html) : html;
    });

    // Initialize Mermaid once (browser only)
    $effect(() => {
        if (!browser) return;
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
        });
    });

    // Render Mermaid diagrams after content lands in the DOM
    $effect(() => {
        if (!browser) return;
        // Re-run whenever the rendered sections change
        renderedSections;
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('.post-content .mermaid');
            if (elements.length) {
                mermaid.run({ querySelector: '.post-content .mermaid' });
            }
        }, 100);
        return () => clearTimeout(timer);
    });
</script>

<svelte:head>
    <title>{data.post?.title} - ¡Pinche Poutine! Digital</title>
    <meta name="description" content={data.post?.excerpt} />
</svelte:head>

<!-- Background Blobs -->
<div class="bg-wrap">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
</div>

<article class="blog-post">
    <div class="container">
        <header class="post-header">
            <a href="/blog" class="back-link">← {t.blog_post_back || 'Back to Blog'}</a>
            <div class="badges-row">
                <div class="badge">{t.blog_tag || 'Blog'}</div>
                {#if isForeignToReader}
                    <div class="lang-badge" title={t.blog_original_lang_tip || 'This text is shown in its original language'}>
                        {t.blog_original_lang || 'Originally in'} {LANG_NAMES[postLang] || postLang}
                    </div>
                {/if}
            </div>
            <h1>{data.post?.title}</h1>
            <div class="post-meta">
                <span class="post-date">{new Date(data.post?.date).toLocaleDateString()}</span>
                <span class="post-author">by {data.post?.author}</span>
            </div>
            {#if data.post?.tags && data.post.tags.length > 0}
                <div class="post-tags">
                    {#each data.post.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            {/if}
        </header>

        <div class="post-content">
            {#if renderedSections.length > 0}
                {#if hasLongTurns}
                    <div class="turn-toolbar">
                        <button
                            class="turn-toggle"
                            onclick={() => (forceExpand = forceExpand === true ? null : true)}
                            class:active={forceExpand === true}
                        >{t.blog_expand_all || 'Expand all'}</button>
                        <button
                            class="turn-toggle"
                            onclick={() => (forceExpand = forceExpand === false ? null : false)}
                            class:active={forceExpand === false}
                        >{t.blog_collapse_all || 'Collapse all'}</button>
                    </div>
                {/if}

                {#each renderedSections as section (section._idx)}
                    {#if section._isSpeaker}
                        <div
                            class="conversation-turn {section._speaker.toLowerCase().replace(/\s+/g, '-')}"
                            class:collapsed={section._isLong && !isExpanded(section)}
                        >
                            <div class="turn-header">
                                <span class="speaker-badge">{section._speaker}</span>
                                {#if section._turnLang}
                                    <span class="turn-lang-chip lang-{section._turnLang}">{LANG_NAMES[section._turnLang] || section._turnLang}</span>
                                {/if}
                            </div>
                            <div class="turn-body">{@html section._html}</div>
                            {#if section._isLong}
                                <button class="turn-expand-btn" onclick={() => toggleTurn(section)}>
                                    {#if isExpanded(section)}
                                        {t.blog_collapse || 'Show less'} ▲
                                    {:else}
                                        {t.blog_expand || 'Read more'} ▼
                                    {/if}
                                </button>
                            {/if}
                        </div>
                    {:else}
                        {#if section.title}
                            <h2>{section.title}</h2>
                        {/if}
                        <div class="section-body">{@html section._html}</div>
                    {/if}
                {/each}
            {:else}
                {@html safeHtmlContent}
            {/if}
        </div>

        <footer class="post-footer">
            {#if data.previousPost || data.nextPost}
                <nav class="post-navigation">
                    {#if data.previousPost}
                        <a href="/blog/{data.previousPost.slug}" class="nav-link prev">
                            <span class="nav-label">← {t.blog_post_prev || 'Previous'}</span>
                            <span class="nav-title">{data.previousPost.title}</span>
                        </a>
                    {/if}
                    {#if data.nextPost}
                        <a href="/blog/{data.nextPost.slug}" class="nav-link next">
                            <span class="nav-label">{t.blog_post_next || 'Next'} →</span>
                            <span class="nav-title">{data.nextPost.title}</span>
                        </a>
                    {/if}
                </nav>
            {/if}
        </footer>
    </div>
</article>

<style>
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
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        position: relative;
        z-index: 2;
    }

    /* --- Badge --- */
    .badges-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        margin-bottom: 2rem;
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
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--color-brick);
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    /* Original-language indicator. Subdued but clear. */
    .lang-badge {
        display: inline-block;
        padding: 0.45rem 1.1rem;
        background: rgba(141, 163, 153, 0.14);
        border: 1px solid rgba(141, 163, 153, 0.4);
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.3px;
        color: var(--color-sage);
        cursor: help;
    }

    /* --- Blog Post --- */
    .blog-post {
        padding: 4rem 0 6rem;
        min-height: calc(100vh - 200px);
    }

    .post-header {
        max-width: 800px;
        margin: 0 auto 4rem;
        padding: 0 1rem;
    }

    .back-link {
        display: inline-block;
        color: var(--color-sage);
        text-decoration: none;
        margin-bottom: 2rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .back-link:hover {
        color: var(--color-brick);
        transform: translateX(-5px);
    }

    .post-header h1 {
        font-size: clamp(2rem, 5vw, 3rem);
        line-height: 1.2;
        color: var(--color-text);
        margin: 0 0 1.5rem 0;
        font-weight: 800;
    }

    .post-meta {
        display: flex;
        gap: 1.5rem;
        color: #6B7C76;
        font-size: 0.95rem;
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 2px solid rgba(141, 163, 153, 0.2);
    }

    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    .tag {
        background: rgba(141, 163, 153, 0.15);
        color: var(--color-sage);
        padding: 0.5rem 1rem;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
    }

    .tag:hover {
        background: var(--color-sage);
        color: var(--color-white);
    }

    /* --- Post Content --- */
    .post-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
        line-height: 1.8;
        color: var(--color-text);
    }

    .post-content :global(h1),
    .post-content :global(h2),
    .post-content :global(h3) {
        color: var(--color-text);
        margin-top: 3rem;
        margin-bottom: 1.5rem;
        line-height: 1.3;
        font-weight: 700;
    }

    .post-content :global(h1) {
        font-size: 2.5rem;
        font-weight: 800;
        background: linear-gradient(135deg, var(--color-brick) 0%, var(--color-sage) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        padding-bottom: 1rem;
        border-bottom: 3px solid rgba(141, 163, 153, 0.3);
    }

    .post-content :global(h2) {
        font-size: 1.8rem;
    }

    .post-content :global(h3) {
        font-size: 1.4rem;
    }

    .post-content :global(p) {
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
        line-height: 1.8;
    }

    .post-content :global(ul),
    .post-content :global(ol) {
        margin-bottom: 1.5rem;
        padding-left: 2rem;
    }

    .post-content :global(li) {
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
        line-height: 1.7;
    }

    .post-content :global(pre) {
        background: #f6f8fa;
        padding: 2rem;
        border-radius: 16px;
        overflow-x: auto;
        margin-bottom: 2rem;
        border: 1px solid rgba(141, 163, 153, 0.2);
    }

    .post-content :global(code) {
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.9em;
    }

    .post-content :global(p code) {
        background: rgba(141, 163, 153, 0.15);
        color: var(--color-sage);
        padding: 0.25rem 0.6rem;
        border-radius: 8px;
        font-weight: 500;
    }

    .post-content :global(a) {
        color: var(--color-brick);
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .post-content :global(a:hover) {
        color: var(--color-sage);
        text-decoration: underline;
    }

    .post-content :global(blockquote) {
        border-left: 4px solid var(--color-brick);
        padding-left: 2rem;
        margin: 2rem 0;
        color: #6B7C76;
        font-style: italic;
        font-size: 1.15rem;
        background: rgba(201, 76, 53, 0.05);
        padding-top: 1rem;
        padding-bottom: 1rem;
        border-radius: 0 16px 16px 0;
    }

    .post-content :global(hr) {
        border: none;
        height: 2px;
        background: linear-gradient(90deg, var(--color-brick), var(--color-sage));
        margin: 3rem 0;
        border-radius: 2px;
    }

    /* --- Mermaid Diagrams --- */
    .post-content :global(.mermaid) {
        display: flex;
        justify-content: center;
        margin: 2.5rem 0;
        padding: 2rem;
        background: var(--color-white);
        border-radius: 16px;
        border: 1px solid rgba(141, 163, 153, 0.2);
        box-shadow: 0 5px 20px rgba(45, 58, 54, 0.05);
        overflow-x: auto;
    }

    .post-content :global(.mermaid svg) {
        max-width: 100%;
        height: auto;
    }

    /* --- Conversation Turns (sections-as-turns) ---
       A section whose title is "Patrouch:" or "ZCode:" renders as a
       dialogue block instead of a heading. Long turns collapse to a
       preview so the reader can scan the whole exchange, then expand
       what interests them. Easy upgrade path later: swap sections[]
       for an explicit turns[] array and only the loader changes. */
    .post-content :global(.conversation-turn) {
        margin: 2.5rem 0;
        padding: 1.5rem 1.75rem;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.55);
        border: 1px solid rgba(141, 163, 153, 0.18);
        box-shadow: 0 4px 18px rgba(45, 58, 54, 0.04);
    }

    .post-content :global(.conversation-turn.patrouch) {
        border-left: 4px solid var(--color-brick);
    }

    .post-content :global(.conversation-turn.zcode) {
        border-left: 4px solid var(--color-sage);
    }

    .post-content :global(.conversation-turn.chef-tech),
    .post-content :global(.conversation-turn.pinche-poutine) {
        border-left: 4px solid #B8A06A;
    }

    .post-content :global(.speaker-badge) {
        display: inline-block;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 0.3rem 0.8rem;
        border-radius: 50px;
        margin-bottom: 0.85rem;
        background: rgba(141, 163, 153, 0.18);
        color: var(--color-sage);
    }

    .post-content :global(.conversation-turn.patrouch .speaker-badge) {
        background: rgba(201, 76, 53, 0.14);
        color: var(--color-brick);
    }

    /* Per-turn language switch: header row holds speaker + lang chip */
    .post-content :global(.turn-header) {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-wrap: wrap;
    }

    .post-content :global(.turn-header .speaker-badge) {
        margin-bottom: 0;
    }

    .post-content :global(.turn-lang-chip) {
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        padding: 0.18rem 0.55rem;
        border-radius: 50px;
        background: rgba(45, 58, 54, 0.08);
        color: #6B7C76;
        border: 1px solid rgba(45, 58, 54, 0.12);
    }

    .post-content :global(.turn-lang-chip.lang-es) {
        background: rgba(201, 76, 53, 0.1);
        color: var(--color-brick);
        border-color: rgba(201, 76, 53, 0.25);
    }

    .post-content :global(.turn-lang-chip.lang-fr) {
        background: rgba(141, 163, 153, 0.14);
        color: var(--color-sage);
        border-color: rgba(141, 163, 153, 0.3);
    }

    .post-content :global(.turn-lang-chip.lang-en) {
        background: rgba(184, 160, 106, 0.14);
        color: #8a7548;
        border-color: rgba(184, 160, 106, 0.3);
    }

    /* Collapsed preview: clamp the turn body to a few lines and fade
       the bottom edge into the card. The "Read more" button sits below. */
    .post-content :global(.conversation-turn.collapsed .turn-body) {
        max-height: 7.5em;
        overflow: hidden;
        position: relative;
    }

    .post-content :global(.conversation-turn.collapsed .turn-body)::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3em;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.85) 100%
        );
        pointer-events: none;
    }

    .post-content :global(.turn-expand-btn) {
        display: block;
        margin: 1rem 0 0;
        padding: 0.35rem 1rem;
        background: transparent;
        border: 1px solid rgba(141, 163, 153, 0.4);
        border-radius: 50px;
        color: var(--color-sage);
        font-family: 'Outfit', sans-serif;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .post-content :global(.turn-expand-btn:hover) {
        background: rgba(141, 163, 153, 0.12);
        border-color: var(--color-sage);
    }

    /* Toolbar: Expand all / Collapse all */
    .turn-toolbar {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
        margin-bottom: 2rem;
    }

    .turn-toggle {
        padding: 0.4rem 1rem;
        background: transparent;
        border: 1px solid rgba(141, 163, 153, 0.35);
        border-radius: 50px;
        color: #6B7C76;
        font-family: 'Outfit', sans-serif;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .turn-toggle:hover {
        border-color: var(--color-sage);
        color: var(--color-sage);
    }

    .turn-toggle.active {
        background: rgba(141, 163, 153, 0.16);
        border-color: var(--color-sage);
        color: var(--color-sage);
    }

    .post-content :global(.conversation-turn .turn-body p:last-child) {
        margin-bottom: 0;
    }

    .post-content :global(.section-body p:last-child) {
        margin-bottom: 0;
    }

    /* --- Post Footer --- */
    .post-footer {
        max-width: 800px;
        margin: 5rem auto 0;
        padding: 0 1rem;
    }

    .post-navigation {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        border-top: 2px solid rgba(141, 163, 153, 0.2);
        padding-top: 3rem;
    }

    .nav-link {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        border-radius: 24px;
        background: var(--color-white);
        text-decoration: none;
        transition: all 0.4s ease;
        border: 1px solid rgba(45, 58, 54, 0.05);
        box-shadow: 0 5px 20px rgba(45, 58, 54, 0.05);
    }

    .nav-link:hover {
        transform: translateY(-5px);
        border-color: rgba(141, 163, 153, 0.4);
        box-shadow: 0 15px 35px rgba(141, 163, 153, 0.2);
    }

    .nav-link.prev {
        align-items: flex-start;
    }

    .nav-link.next {
        align-items: flex-end;
        text-align: right;
    }

    .nav-label {
        font-size: 0.85rem;
        color: var(--color-sage);
        margin-bottom: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .nav-title {
        font-weight: 700;
        color: var(--color-text);
        font-size: 1.05rem;
        line-height: 1.4;
    }

    @media (max-width: 768px) {
        .blog-post {
            padding: 3rem 0 4rem;
        }

        .post-header h1 {
            font-size: 2rem;
        }

        .post-meta {
            flex-direction: column;
            gap: 0.5rem;
        }

        .post-navigation {
            grid-template-columns: 1fr;
        }

        .post-content :global(h1) {
            font-size: 1.8rem;
        }

        .post-content :global(h2) {
            font-size: 1.5rem;
        }

        .post-content :global(p) {
            font-size: 1.05rem;
        }

        .post-content :global(.conversation-turn) {
            padding: 1.1rem 1.25rem;
        }
    }
</style>
