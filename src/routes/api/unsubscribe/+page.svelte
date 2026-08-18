<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	/** @type {string} */
	let email = '';
	
	/** @type {boolean} */
	let loading = false;
	
	/** @type {string} */
	let message = '';
	
	/** @type {boolean} */
	let success = false;

	// Get email from URL params if provided
	onMount(() => {
		const urlEmail = $page.url.searchParams.get('email');
		if (urlEmail) {
			email = urlEmail;
		}
	});

	// Locale-aware labels from the root layout load
	$: t = $page.data?.t || {};
	$: emailLabel = t.subscribe_form_label || 'Email address';

	/**
	 * Handle unsubscribe form submission
	 * @returns {Promise<void>}
	 */
	async function handleUnsubscribe() {
		if (!email.trim()) {
			message = 'Please enter your email address';
			return;
		}

		loading = true;
		message = '';

		try {
			const response = await fetch('/api/unsubscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: email.trim() })
			});

			/** @type {{success: boolean, message: string}} */
			const result = await response.json();
			
			if (result.success) {
				success = true;
				message = result.message;
			} else {
				message = result.message || 'Something went wrong. Please try again.';
			}
		} catch (error) {
			console.error('Unsubscribe error:', error);
			message = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Unsubscribe - ¡Pinche Poutine! Digital</title>
</svelte:head>

<div class="unsubscribe-page">
	<h1>Unsubscribe from Email Updates</h1>
	
	{#if success}
		<div class="success-message" role="status">
			<h2><span aria-hidden="true">✅</span> Successfully Unsubscribed</h2>
			<p>{message}</p>
			<p>We're sorry to see you go! You can always <a href="/">resubscribe</a> if you change your mind.</p>
		</div>
	{:else}
		<p>Enter your email address to unsubscribe from all email updates:</p>
		
		<form on:submit|preventDefault={handleUnsubscribe} class="unsubscribe-form">
			<div class="form-group">
				<input
					bind:value={email}
					type="email"
					name="email"
					placeholder={emailLabel}
					aria-label={emailLabel}
					autocomplete="email"
					required
					disabled={loading}
					class="email-input"
				/>
				<button type="submit" disabled={loading} class="unsubscribe-button">
					{loading ? 'Unsubscribing...' : 'Unsubscribe'}
				</button>
			</div>
		</form>

		{#if message}
			<p class="error-message" role="alert">{message}</p>
		{/if}
	{/if}
</div>

<style>
	.unsubscribe-page {
		max-width: 500px;
		margin: 2rem auto;
		padding: 2rem;
		text-align: center;
	}

	.unsubscribe-form {
		margin: 2rem 0;
	}

	.form-group {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.email-input {
		flex: 1;
		padding: 0.75rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.email-input:focus {
		outline: none;
		border-color: #3b82f6;
	}

	.unsubscribe-button {
		padding: 0.75rem 1.5rem;
		background-color: #dc2626;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.unsubscribe-button:hover:not(:disabled) {
		background-color: #b91c1c;
	}

	.unsubscribe-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.success-message {
		padding: 2rem;
		background-color: #f0fdf4;
		border: 2px solid #22c55e;
		border-radius: 0.5rem;
		color: #15803d;
	}

	.success-message h2 {
		margin: 0 0 1rem 0;
	}

	.error-message {
		color: #dc2626;
		margin-top: 0.5rem;
	}

	@media (max-width: 480px) {
		.form-group {
			flex-direction: column;
		}
	}
</style>
