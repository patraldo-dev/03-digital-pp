<script>
    // src/lib/components/SubscribeForm.svelte
    
    let { t = {}, type = 'newsletter' } = $props();
    
    /** @type {string} */
    let email = $state('');
    
    /** @type {boolean} */
    let loading = $state(false);
    
    /** @type {string} */
    let message = $state('');
    
    /** @type {string} */
    let messageType = $state('');
    
    /**
     * @param {string} key
     * @param {string} fallback
     * @returns {string}
     */
    const getText = (key, fallback) => t?.[key] || fallback;
    
    /**
     * @param {Event} e
     */
    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!email) return;
        
        loading = true;
        message = '';
        messageType = '';
        
        try {
            const resp = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, type })
            });
            
            const data = await resp.json();
            
            if (!resp.ok) {
                throw new Error(data.message || 'Failed to subscribe');
            }
            
            message = data.message || 'Please check your email to confirm!';
            messageType = 'success';
            email = '';
        } catch (/** @type {unknown} */ err) {
            const error = err instanceof Error ? err : new Error(String(err));
            message = error.message || 'Failed to subscribe';
            messageType = 'error';
        } finally {
            loading = false;
        }
    }
</script>

<form class="subscribe-form" onsubmit={handleSubmit}>
    <div class="form-group">
        <input
            type="email"
            placeholder={getText('subscribe_placeholder', 'Enter your email')}
            bind:value={email}
            required
            disabled={loading}
        />
    </div>
    
    {#if message}
        <div class="message {messageType}">
            {message}
        </div>
    {/if}
    
    <button type="submit" disabled={loading}>
        {loading ? 'Subscribing...' : getText('subscribe_button', 'Subscribe')}
    </button>
</form>

<style>
    .subscribe-form {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        align-items: center;
    }
    .form-group {
        flex: 1;
        min-width: 200px;
    }
    .form-group input {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
    }
    .form-group input:focus {
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    .message {
        width: 100%;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
    }
    .message.success {
        background: #d4edda;
        color: #155724;
    }
    .message.error {
        background: #f8d7da;
        color: #721c24;
    }
    button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        color: #fff;
        background: #28a745;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap;
    }
    button:hover:not(:disabled) {
        background: #1e7e34;
    }
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>
