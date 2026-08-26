<script>
    // src/lib/components/BlogSearch.svelte
    
    let { t = /** @type {Record<string, string>} */ ({}) } = $props();
    
    /** @type {string} */
    let query = $state('');
    
    /** @type {any[]} */
    let results = $state([]);
    
    /** @type {boolean} */
    let loading = $state(false);
    
    /** @type {string | null} */
    let error = $state(null);
    
    /** @type {number} */
    let seq = 0;
    
    /** @type {number | null} */
    let timer = $state(null);
    
    /** @type {AbortController | null} */
    let abortCtl = $state(null);
    
    /** @type {HTMLInputElement | null} */
    let inputEl = $state(null);
    
    const FETCH_TIMEOUT_MS = 10000;  // Increased from 5000
    
    /**
     * @param {string} ch
     * @returns {string}
     */
    function foldCh(ch) {
        const f = ch.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        return f || ch;
    }
    
    /**
     * @param {string} s
     * @returns {string}
     */
    function escapeHtml(s) {
        return (s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    /**
     * @param {string} snippet
     * @param {string} terms
     * @returns {string}
     */
    function highlight(snippet, terms) {
        const text = snippet || '';
        if (!terms) return escapeHtml(text);
        const words = terms.split(' ').filter(w => w.length > 2);
        if (!words.length) return escapeHtml(text);
        
        let result = escapeHtml(text);
        for (const word of words) {
            const escaped = escapeHtml(word);
            const regex = new RegExp(`(${escaped})`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        }
        return result;
    }
    
    /**
     * @param {KeyboardEvent} e
     */
    function onKeydown(e) {
        if (e.key === 'Escape') {
            inputEl?.blur();
            results = [];
            query = '';
        }
    }
    
    async function runSearch() {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            results = [];
            loading = false;
            error = null;
            return;
        }
        
        if (trimmedQuery.length < 2) {
            results = [];
            loading = false;
            return;
        }
        
        const mySeq = ++seq;
        
        // Abort previous request
        if (abortCtl) {
            abortCtl.abort();
        }
        abortCtl = new AbortController();
        
        loading = true;
        error = null;
        
        const killer = setTimeout(() => {
            if (abortCtl) {
                abortCtl.abort();
            }
        }, FETCH_TIMEOUT_MS);
        
        try {
            const resp = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
                signal: abortCtl.signal
            });
            clearTimeout(killer);
            
            if (mySeq !== seq) return;
            
            if (!resp.ok) {
                const errData = await resp.json();
                throw new Error(errData.error || 'Search failed');
            }
            
            const data = await resp.json();
            results = data.results || [];
            error = null;
        } catch (/** @type {unknown} */ e) {
            if (mySeq !== seq) return;
            const err = e instanceof Error ? e : new Error(String(e));
            // Ignore aborted requests - they're expected
            if (err.name === 'AbortError' || err.message.includes('aborted')) {
                return;
            }
            error = err.message;
            results = [];
        } finally {
            if (mySeq === seq) {
                loading = false;
            }
        }
    }
    
    function onInput() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(runSearch, 400);  // Slightly longer delay
    }
    
    /**
     * @param {{ semantic?: boolean; lexical?: boolean; rerank?: boolean }} stages
     * @returns {string[]}
     */
    function stageLabels(stages) {
        const b = [];
        if (stages?.semantic) b.push('semantic');
        if (stages?.lexical) b.push('keyword');
        if (stages?.rerank) b.push('reranked');
        return b;
    }
</script>

<input
    bind:this={inputEl}
    bind:value={query}
    oninput={onInput}
    onkeydown={onKeydown}
    placeholder={t.search_placeholder || 'Search posts...'}
    class="search-input"
    disabled={loading}
/>

{#if loading}
    <div class="search-status">{t.search_searching || 'Searching…'}</div>
{/if}

{#if error}
    <div class="search-error">{error}</div>
{/if}

{#if results.length > 0}
    <ul class="search-results">
        {#each results as result (result.chunk?.id || result.slug)}
            <li>
                <a href="/blog/{result.slug}?lang={result.lang}">
                    <strong>{result.title || result.slug}</strong>
                    <span class="lang-badge">{result.lang}</span>
                    {#if result.match}
                        <span class="match-badge">{result.match}%</span>
                    {/if}
                    {#if result.snippet}
                        <p>{@html highlight(result.snippet, query)}</p>
                    {/if}
                </a>
            </li>
        {/each}
    </ul>
{:else if query.length >= 2 && !loading && !error}
    <div class="no-results">{t.search_no_results || 'No matches — try another phrasing.'}</div>
{/if}

<style>
    .search-input {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fff;
        color: #333;
    }
    .search-input:focus {
        outline: none;
        border-color: #5a6e65;
        box-shadow: 0 0 0 2px rgba(90, 110, 101, 0.2);
    }
    .search-input:disabled {
        opacity: 0.6;
    }
    .search-status {
        padding: 0.5rem 0;
        color: #666;
        font-style: italic;
    }
    .search-error {
        padding: 0.5rem 0;
        color: #c0392b;
    }
    .no-results {
        padding: 0.5rem 0;
        color: #888;
        font-style: italic;
    }
    .search-results {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0;
    }
    .search-results li {
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
    }
    .search-results li:last-child {
        border-bottom: none;
    }
    .search-results li a {
        text-decoration: none;
        color: inherit;
        display: block;
    }
    .search-results li a:hover {
        background: #f8f9fa;
        border-radius: 4px;
    }
    .lang-badge {
        font-size: 0.75rem;
        background: #eee;
        padding: 0.125rem 0.5rem;
        border-radius: 3px;
        margin-left: 0.5rem;
    }
    .match-badge {
        font-size: 0.75rem;
        background: #5a6e65;
        color: #fff;
        padding: 0.125rem 0.5rem;
        border-radius: 3px;
        margin-left: 0.5rem;
    }
    .search-results p {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
        color: #555;
    }
    .search-results :global(mark) {
        background: #ffdd57;
        padding: 0 0.125rem;
        border-radius: 2px;
    }
</style>
