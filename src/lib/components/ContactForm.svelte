<script>
    // src/lib/components/ContactForm.svelte
    
    let { t = {} } = $props();
    
    /** @type {{ name: string; email: string; subject: string; message: string }} */
    let formData = $state({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    
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
    const label = (key, fallback) => t?.[key] || fallback;
    
    /**
     * @param {Event} e
     */
    async function handleSubmit(e) {
        e.preventDefault();
        
        loading = true;
        message = '';
        messageType = '';
        
        try {
            const resp = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await resp.json();
            
            if (!resp.ok) {
                throw new Error(data.error || 'Failed to send message');
            }
            
            message = 'Message sent successfully!';
            messageType = 'success';
            formData = { name: '', email: '', subject: '', message: '' };
        } catch (/** @type {unknown} */ err) {
            const error = err instanceof Error ? err : new Error(String(err));
            message = error.message || 'Failed to send message';
            messageType = 'error';
        } finally {
            loading = false;
        }
    }
</script>

<form class="contact-form" onsubmit={handleSubmit}>
    <div class="form-group">
        <label for="name">{label('contact_name', 'Name')}</label>
        <input
            id="name"
            type="text"
            bind:value={formData.name}
            required
            disabled={loading}
        />
    </div>
    
    <div class="form-group">
        <label for="email">{label('contact_email', 'Email')}</label>
        <input
            id="email"
            type="email"
            bind:value={formData.email}
            required
            disabled={loading}
        />
    </div>
    
    <div class="form-group">
        <label for="subject">{label('contact_subject', 'Subject')}</label>
        <input
            id="subject"
            type="text"
            bind:value={formData.subject}
            required
            disabled={loading}
        />
    </div>
    
    <div class="form-group">
        <label for="message">{label('contact_message', 'Message')}</label>
        <textarea
            id="message"
            bind:value={formData.message}
            rows="5"
            required
            disabled={loading}
        ></textarea>

    </div>
    
    {#if message}
        <div class="message {messageType}">
            {message}
        </div>
    {/if}
    
    <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : label('contact_send', 'Send Message')}
    </button>
</form>

<style>
    .contact-form {
        max-width: 600px;
        margin: 0 auto;
    }
    .form-group {
        margin-bottom: 1rem;
    }
    .form-group label {
        display: block;
        margin-bottom: 0.25rem;
        font-weight: 500;
        color: #2c3e50;
    }
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        transition: border-color 0.2s;
    }
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    .message {
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
    .message.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    .message.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        color: #fff;
        background: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }
    button:hover:not(:disabled) {
        background: #0056b3;
    }
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>
