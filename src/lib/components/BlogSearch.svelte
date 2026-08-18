<script>
    /**
     * AI-powered blog search box (hybrid: semantic + keyword, fused
     * and reranked server-side). Debounced; Escape clears; Enter
     * jumps to the top result.
     */
    let { t = {} } = $props();

    let query = $state('');
    let results = $state([]);
    let loading = $state(false);
    let error = $state('');
    let stages = $state({});
    let inputEl = $state(null);

    // Debounce: a request sequence counter cancels stale responses.
    let seq = 0;
    let timer = null;
    let abortCtl = null;

    const MIN_CHARS = 2;
    const FETCH_TIMEOUT_MS = 8000;

    async function runSearch() {
        const q = query.trim();
        if (q.length < MIN_CHARS) {
            results = [];
            loading = false;
            error = '';
            return;
        }
        loading = true;
        error = '';
        const mySeq = ++seq;
        abortCtl?.abort();
        abortCtl = new AbortController();
        const killer = setTimeout(() => abortCtl.abort(), FETCH_TIMEOUT_MS);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
                signal: abortCtl.signal
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (mySeq !== seq) return; // a newer keystroke won
            results = data.results || [];
            stages = data.stages || {};
        } catch (e) {
            if (mySeq !== seq) return;
            error = e.message;
            results = [];
        } finally {
            clearTimeout(killer);
            if (mySeq === seq) loading = false;
        }
    }

    function onInput() {
        clearTimeout(timer);
        timer = setTimeout(runSearch, 280);
    }

    function onKeydown(e) {
        if (e.key === 'Escape') {
            query = '';
            results = [];
            error = '';
        } else if (e.key === 'Enter' && results.length) {
            window.location.href = `/blog/${results[0].slug}`;
        }
    }

    /** Length-preserving accent fold — keeps index mapping 1:1. */
    function foldCh(ch) {
        const f = ch.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        return f || ch;
    }

    function escapeHtml(s) {
        return (s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * Highlight query terms in the snippet: build a folded copy with
     * identical length, locate term ranges there, then wrap the
     * ORIGINAL ranges in <mark> (HTML-escaped outside the marks).
     */
    function highlight(snippet, terms) {
        const text = snippet || '';
        const folded = [...text].map(foldCh).join('').toLowerCase();
        const ranges = [];
        for (const term of terms || []) {
            const t = [...term].map(foldCh).join('').toLowerCase();
            if (!t) continue;
            let i = folded.indexOf(t);
            while (i >= 0) {
                ranges.push([i, i + t.length]);
                i = folded.indexOf(t, i + t.length);
            }
        }
        if (!ranges.length) return escapeHtml(text);
        ranges.sort((a, b) => a[0] - b[0]);
        // merge overlaps
        const merged = [ranges[0]];
        for (const r of ranges.slice(1)) {
            const last = merged[merged.length - 1];
            if (r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
            else merged.push(r);
        }
        let out = '';
        let pos = 0;
        for (const [s, e] of merged) {
            out += escapeHtml(text.slice(pos, s));
            out += '<mark>' + escapeHtml(text.slice(s, e)) + '</mark>';
            pos = e;
        }
        out += escapeHtml(text.slice(pos));
        return out;
    }

    function stageBadges() {
        const b = [];
        if (stages.semantic) b.push('semantic');
        if (stages.lexical) b.push('keyword');
        if (stages.rerank) b.push('reranked');
        return b;
    }
</script>

<div class="blog-search">
    <div class="search-shell">
        <span class="search-icon" aria-hidden="true">⌕</span>
        <input
            bind:this={inputEl}
            bind:value={query}
            oninput={onInput}
            onkeydown={onKeydown}
            type="search"
            autocomplete="off"
            spellcheck="false"
            placeholder={t.search_placeholder || 'Search the blog — concepts work, not just keywords…'}
            aria-label={t.search_title || 'Search the blog'}
        />
        {#if loading}
            <span class="search-spinner" aria-hidden="true"></span>
        {/if}
    </div>

    {#if query.trim().length >= MIN_CHARS}
        <div class="search-panel" role="status">
            {#if error}
                <p class="search-error">
                    {t.search_error || 'Search failed'} — {error}
                </p>
            {:else if loading}
                <p class="search-status">{t.search_searching || 'Searching…'}</p>
            {:else if results.length === 0}
                <p class="search-status">{t.search_no_results || 'No matches — try another phrasing.'}</p>
            {:else}
                <ul class="search-results">
                    {#each results as r (r.lang + ':' + r.slug)}
                        <li>
                            <a href="/blog/{r.slug}" class="result-link">
                                <span class="result-match" aria-label="{t.search_match || 'relevance'}">{r.match}%</span>
                                <span class="result-main">
                                    <span class="result-title">{r.title}</span>
                                    {#if r.speaker}
                                        <span class="result-speaker">{r.speaker}</span>
                                    {/if}
                                    <span class="result-snippet">{@html highlight(r.snippet, r.terms)}</span>
                                </span>
                                <span class="result-date">{new Date(r.date).toLocaleDateString()}</span>
                            </a>
                        </li>
                    {/each}
                </ul>
                {#if stageBadges().length}
                    <p class="search-stages">
                        {t.search_stages || 'Ranked by'}: {stageBadges().join(' + ')}
                    </p>
                {/if}
            {/if}
        </div>
    {:else if query.length > 0}
        <p class="search-hint">{t.search_min_chars || 'Keep typing — a few more letters…'}</p>
    {/if}
</div>

<style>
    .blog-search {
        margin: 0 auto 2.5rem;
        max-width: 800px;
    }

    .search-shell {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.85rem 1.25rem;
        background: rgba(255, 255, 255, 0.75);
        border: 1px solid rgba(141, 163, 153, 0.35);
        border-radius: 16px;
        box-shadow: 0 5px 20px rgba(45, 58, 54, 0.06);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .search-shell:focus-within {
        border-color: var(--color-sage, #8DA399);
        box-shadow: 0 8px 28px rgba(141, 163, 153, 0.25);
    }

    .search-icon {
        font-size: 1.2rem;
        color: var(--color-sage, #8DA399);
        line-height: 1;
    }

    input[type='search'] {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        font-family: 'Outfit', sans-serif;
        font-size: 1rem;
        color: var(--color-text, #2D3A36);
    }

    input[type='search']::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

    .search-spinner {
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(141, 163, 153, 0.3);
        border-top-color: var(--color-sage, #8DA399);
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .search-panel {
        margin-top: 0.75rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(141, 163, 153, 0.25);
        border-radius: 16px;
        box-shadow: 0 10px 32px rgba(45, 58, 54, 0.08);
    }

    .search-status,
    .search-error,
    .search-hint {
        padding: 0.6rem 0.9rem;
        font-size: 0.9rem;
        color: #6B7C76;
    }

    .search-error {
        color: var(--color-brick, #A53D28);
    }

    .search-results {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .result-link {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        padding: 0.75rem 0.9rem;
        border-radius: 12px;
        text-decoration: none;
        transition: background 0.15s ease;
    }

    .result-link:hover {
        background: rgba(141, 163, 153, 0.12);
    }

    .result-match {
        flex-shrink: 0;
        min-width: 3rem;
        text-align: center;
        padding: 0.25rem 0.4rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 700;
        background: rgba(141, 163, 153, 0.16);
        color: var(--color-sage, #8DA399);
    }

    .result-main {
        flex: 1;
        min-width: 0;
    }

    .result-title {
        display: block;
        font-weight: 700;
        font-size: 0.95rem;
        line-height: 1.3;
        color: var(--color-text, #2D3A36);
    }

    .result-speaker {
        display: inline-block;
        margin: 0.2rem 0 0.3rem;
        padding: 0.08rem 0.5rem;
        border-radius: 50px;
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        background: rgba(201, 76, 53, 0.12);
        color: var(--color-brick, #A53D28);
    }

    .result-snippet {
        display: block;
        font-size: 0.84rem;
        line-height: 1.45;
        color: #6B7C76;
    }

    .result-snippet :global(mark) {
        background: rgba(184, 160, 106, 0.28);
        color: #6d5a2c;
        border-radius: 3px;
        padding: 0 0.1em;
        font-weight: 600;
    }

    .result-date {
        flex-shrink: 0;
        font-size: 0.72rem;
        color: var(--color-sage, #8DA399);
        font-weight: 600;
        padding-top: 0.3rem;
    }

    .search-stages {
        margin: 0.25rem 0 0.5rem;
        padding: 0 0.9rem;
        font-size: 0.7rem;
        letter-spacing: 0.4px;
        text-transform: uppercase;
        color: #9aa8a3;
    }

    @media (max-width: 640px) {
        .result-date {
            display: none;
        }
    }
</style>
