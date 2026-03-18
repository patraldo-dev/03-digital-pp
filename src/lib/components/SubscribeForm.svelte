<script>
	import { page } from '$app/stores';
	
	/**
	 * @typedef {'newsletter' | 'events'} SubscriptionType
	 */

	let { 
		type = 'newsletter', 
		placeholder, 
		buttonText 
	} = $props();

	// Get translations from page context
	let t = $page.data?.t || {};
	
	let email = '';
	let loading = false;
	let message = '';
	let success = false;

	function getPlaceholder() {
		return placeholder || t?.subscribe_form_placeholder || 'Enter your email address';
	}
	
	function getButtonText() {
		return buttonText || t?.subscribe_form_button || 'Subscribe';
	}
	
	function getSubscribingText() {
		return t?.subscribe_form_subscribing || 'Subscribing...';
	}
	
	function getThanksText() {
		return t?.subscribe_form_thanks || '🎉 Thank you!';
	}
	
	function getResetHint() {
		return t?.subscribe_form_reset_hint || 'Form will reset in a few seconds...';
	}
	
	function getErrorEmpty() {
		return t?.subscribe_form_error_empty || 'Please enter your email address';
	}
	
	function getErrorNetwork() {
		return t?.subscribe_form_error_network || 'Network error. Please try again.';
	}
	
	function getErrorGeneric() {
		return t?.subscribe_form_error_generic || 'Something went wrong. Please try again.';
	}
	
	function getSuccessMessage(apiMessage) {
		return t?.subscribe_form_success_message || apiMessage;
	}

	/**
	 * Handle form submission
	 * @returns {Promise<void>}
	 */
	async function handleSubmit() {
		if (!email.trim()) {
			message = getErrorEmpty();
			return;
		}

		loading = true;
		message = '';

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: email.trim(), type })
			});

			const result = await response.json();
			
			if (result.success) {
				success = true;
				email = '';
				message = getSuccessMessage(result.message);
			} else {
				message = result.message || getErrorGeneric();
			}
		} catch (error) {
			console.error('Subscription error:', error);
			message = getErrorNetwork();
		} finally {
			loading = false;
		}
	}

	/**
	 * Reset form after success
	 */
	function resetForm() {
		success = false;
		message = '';
		email = '';
	}

	// Auto-reset form after 5 seconds on success
	$effect(() => {
		if (success) {
			const timer = setTimeout(() => {
				resetForm();
			}, 5000);
			return () => clearTimeout(timer);
		}
	});
</script>

<div class="subscribe-form">
	{#if success}
		<div class="success-message">
			<h3>{getThanksText()}</h3>
			<p>{message}</p>
			<p class="reset-hint">{getResetHint()}</p>
		</div>
	{:else}
		<form on:submit|preventDefault={handleSubmit}>
			<div class="form-group">
				<input
					bind:value={email}
					type="email"
					placeholder={getPlaceholder()}
					required
					disabled={loading}
					class="email-input"
				/>
				<button type="submit" disabled={loading} class="submit-button">
					{loading ? getSubscribingText() : getButtonText()}
				</button>
			</div>
		</form>
	{/if}

	{#if message && !success}
		<p class="error-message">{message}</p>
	{/if}
</div>

<style>
	.subscribe-form {
		max-width: 400px;
		margin: 0 auto;
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

	.submit-button {
		padding: 0.75rem 1.5rem;
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.submit-button:hover:not(:disabled) {
		background-color: #2563eb;
	}

	.submit-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.success-message {
		text-align: center;
		padding: 2rem;
		background-color: #f0fdf4;
		border: 2px solid #22c55e;
		border-radius: 0.5rem;
		color: #15803d;
	}

	.success-message h3 {
		margin: 0 0 0.5rem 0;
	}

	.reset-hint {
		font-size: 0.875rem;
		color: #16a34a;
		margin-top: 1rem;
		font-style: italic;
	}

	.error-message {
		color: #dc2626;
		text-align: center;
		margin-top: 0.5rem;
	}

	@media (max-width: 480px) {
		.form-group {
			flex-direction: column;
		}
	}
</style>
