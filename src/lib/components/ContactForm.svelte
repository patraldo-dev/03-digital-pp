<form class="contact-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
        <label for="name">Name *</label>
        <input
            type="text"
            id="name"
            bind:value={formData.name}
            required
            disabled={loading}
        />
    </div>

    <div class="form-group">
        <label for="email">Email *</label>
        <input
            type="email"
            id="email"
            bind:value={formData.email}
            required
            disabled={loading}
        />
    </div>

    <div class="form-group">
        <label for="subject">Subject *</label>
        <input
            type="text"
            id="subject"
            bind:value={formData.subject}
            required
            disabled={loading}
        />
    </div>

    <div class="form-group">
        <label for="message">Message *</label>
        <textarea
            id="message"
            bind:value={formData.message}
            rows="6"
            required
            disabled={loading}
        ></textarea>
    </div>

<input
    type="text"
    name="website"
    style="display: none !important; opacity: 0; height: 0; width: 0; position: absolute;"
    tabindex="-1"
    autocomplete="off"
/>

    {#if message}
        <div class="message" class:success={messageType === 'success'} class:error={messageType === 'error'}>
            {message}
        </div>
    {/if}

    <button type="submit" class="btn" disabled={loading}>
        {#if loading}
            Sending...
        {:else}
            Send Message
        {/if}
    </button>
</form>

<script>
    let formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    let loading = false;
    let message = '';
    let messageType = '';

    async function handleSubmit() {
        loading = true;
        message = '';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                message = result.message || 'Thank you! Your message has been sent successfully.';
                messageType = 'success';
                
                // Reset form
                formData = {
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                };
            } else {
                message = result.error || 'Sorry, there was an error sending your message. Please try again.';
                messageType = 'error';
            }
        } catch (error) {
            console.error('Contact form error:', error);
            message = 'Sorry, there was an error sending your message. Please try again.';
            messageType = 'error';
        } finally {
            loading = false;
        }
    }
</script>

<style>
    .contact-form {
        max-width: 600px;
        margin: 0 auto;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #333;
    }

    input,
    textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        font-family: inherit;
    }

    input:focus,
    textarea:focus {
        outline: none;
        border-color: #007cba;
    }

    input:disabled,
    textarea:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }

    textarea {
        resize: vertical;
        min-height: 120px;
    }

    .message {
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-weight: 500;
    }

    .message.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .message.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    button {
        width: 100%;
        padding: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>
