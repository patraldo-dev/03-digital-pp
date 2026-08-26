<script>
    // src/routes/confirmation-success/+page.svelte
    
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    
    /** @type {string | null} */
    let error = $state(null);
    
    /** @type {boolean} */
    let already = $state(false);
    
    /** @type {string} */
    let errorMessage = $state('');
    
    /** @type {string} */
    let email = $state('');
    
    /** @type {string} */
    let status = $state('verifying');
    
    onMount(() => {
        const errorParam = $page.url.searchParams.get('error');
        const emailParam = $page.url.searchParams.get('email');
        const alreadyParam = $page.url.searchParams.get('already');
        
        // Set state
        error = errorParam;
        email = emailParam || '';
        already = alreadyParam === 'true';
        
        // Set error message based on error type
        if (error === 'invalid') {
            errorMessage = 'Invalid confirmation link';
            status = 'error';
        } else if (error === 'expired') {
            errorMessage = 'Confirmation link has expired';
            status = 'error';
        } else if (error === 'server') {
            errorMessage = 'An error occurred. Please try again.';
            status = 'error';
        } else if (!error) {
            status = 'success';
        }
    });
</script>

<div class="confirmation-page">
    <div class="container">
        {#if status === 'verifying'}
            <div class="card">
                <h1>Verifying...</h1>
                <p>Please wait while we confirm your subscription.</p>
            </div>
        {:else if status === 'success'}
            <div class="card success">
                <h1>✅ Confirmed!</h1>
                <p>Your email has been confirmed successfully.</p>
                {#if email}
                    <p class="email">{email}</p>
                {/if}
                <p>You'll now receive updates from us.</p>
                <a href="/" class="button">Go Home</a>
            </div>
        {:else if status === 'error'}
            <div class="card error">
                <h1>❌ {errorMessage}</h1>
                <p>There was a problem confirming your subscription.</p>
                {#if error === 'expired'}
                    <p>The confirmation link has expired. Please try subscribing again.</p>
                    <a href="/subscribe" class="button">Subscribe Again</a>
                {:else if error === 'invalid'}
                    <p>The confirmation link is invalid. Please make sure you copied the full URL.</p>
                    <a href="/subscribe" class="button">Subscribe Again</a>
                {:else}
                    <p>Please try again later or contact support.</p>
                    <a href="/" class="button">Go Home</a>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .confirmation-page {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 0;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 0 1rem;
        width: 100%;
    }
    .card {
        background: #fff;
        border-radius: 8px;
        padding: 2.5rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
    }
    .card.success {
        border-top: 4px solid #28a745;
    }
    .card.error {
        border-top: 4px solid #dc3545;
    }
    .card h1 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 2rem;
    }
    .card p {
        margin-bottom: 1rem;
        color: #555;
        line-height: 1.6;
    }
    .card .email {
        background: #f8f9fa;
        padding: 0.5rem;
        border-radius: 4px;
        font-weight: 500;
        color: #2c3e50;
    }
    .button {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        transition: background 0.2s;
        margin-top: 0.5rem;
    }
    .button:hover {
        background: #0056b3;
    }
</style>
