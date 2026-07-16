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
     * Render a section's markdown content to sanitized HTML.
     * We render + sanitize eagerly so the markup is ready before
     * the {#each} paints. marked is sync with { async: false } (default
     * unless a tokenizer extension returns a Promise), so this is safe
     * during component init on both server and client.
     *
     * Conversation convention: a section whose title is exactly a speaker
     * label ("Patrouch:" or "ZCode:") gets a CSS class so it can be
     * styled as a dialogue turn. The title is rendered as a badge rather
     * than a heading so the visual rhythm stays calm.
     */
    const SPEAKER_RE = /^(Patrouch|ZCode|Chef Tech|Pinche Poutine):\s*$/i;

    function renderSection(section) {
        const html = marked.parse(section.content || '', { async: false });
        // DOMPurify only runs in the browser (needs a DOM). On the server
        // we trust first-party authored content; on the client we strip
        // anything marked might let through.
        const clean = browser ? DOMPurify.sanitize(html) : html;
        const isSpeaker = SPEAKER_RE.test((section.title || '').trim());
        const speakerName = isSpeaker
            ? (section.title || '').trim().replace(/:\s*$/, '')
            : null;
        return { ...section, _html: clean, _isSpeaker: isSpeaker, _speaker: speakerName };
    }

    // Pre-render sections once per post. untrack so this doesn't
    // re-run on unrelated reactive changes.
    let renderedSections = $derived.by(() => {
        const sections = data.post?.sections;
        if (!sections || !sections.length) return [];
        return sections.map(renderSection);
    });

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
            <div class="badge">{t.blog_tag || 'Blog'}</div>
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
                {#each renderedSections as section (section.title + section._html)}
                    {#if section._isSpeaker}
                        <div class="conversation-turn {section._speaker.toLowerCase().replace(/\s+/g, '-')}">
                            <span class="speaker-badge">{section._speaker}</span>
                            <div class="turn-body">{@html section._html}</div>
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
       dialogue block instead of a heading. Easy upgrade path later:
       swap sections[] for an explicit turns[] array and only the loader
       changes — this CSS keeps working. */
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
