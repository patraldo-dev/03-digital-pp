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
    
    const FETCH_TIMEOUT_MS = 5000;
    
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
        }
    }
    
    async function runSearch() {
        if (!query.trim()) {
            results = [];
            loading = false;
            return;
        }
        
        const mySeq = ++seq;
        abortCtl?.abort();
        abortCtl = new AbortController();
        
        loading = true;
        error = null;
        
        const killer = setTimeout(() => abortCtl?.abort(), FETCH_TIMEOUT_MS);
        
        try {
            const resp = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
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
        } catch (/** @type {unknown} */ e) {
            if (mySeq !== seq) return;
            const err = e instanceof Error ? e : new Error(String(e));
            error = err.message;
            results = [];
        } finally {
            if (mySeq === seq) {
                loading = false;
            }
        }
    }
    
    function onInput() {
        clearTimeout(timer ?? undefined);
        timer = setTimeout(runSearch, 280);
    }
    
    /**
     * @param {{ semantic?: boolean; lexical?: boolean; rerank?: boolean }} stages
     * @returns {string[]}
     */
    function stageLabels(stages) {
        const b = [];
        if (stages.semantic) b.push('semantic');
        if (stages.lexical) b.push('keyword');
        if (stages.rerank) b.push('reranked');
        return b;
    }
</script>

<input
    bind:this={inputEl}
    bind:value={query}
    oninput={onInput}
    onkeydown={onKeydown}
    placeholder="Search posts..."
    class="search-input"
    disabled={loading}
/>

{#if loading}
    <div class="search-status">Searching...</div>
{/if}

{#if error}
    <div class="search-error">{error}</div>
{/if}

{#if results.length > 0}
    <ul class="search-results">
        {#each results as result (result.chunk.id)}
            <li>
                <a href="/blog/{result.chunk.slug}?lang={result.chunk.lang}">
                    <strong>{result.chunk.title || result.chunk.slug}</strong>
                    <span class="lang-badge">{result.chunk.lang}</span>
                    <p>{@html highlight(result.chunk.text, query)}</p>
                </a>
            </li>
        {/each}
    </ul>
{/if}

<style>
    .search-input {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .search-status {
        padding: 0.5rem;
        color: #666;
        font-style: italic;
    }
    .search-error {
        padding: 0.5rem;
        color: #c0392b;
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
    .search-results li a {
        text-decoration: none;
        color: inherit;
    }
    .lang-badge {
        font-size: 0.75rem;
        background: #eee;
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
    }
</style>
