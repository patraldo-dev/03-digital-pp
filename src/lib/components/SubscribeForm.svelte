<script>
	import { page } from '$app/stores';
	
	let { 
		type = 'newsletter'
	} = $props();

	let email = $state('');
	let loading = $state(false);
	let message = $state('');
	let success = $state(false);

	async function handleSubmit(e) {
		e.preventDefault();
		
		if (!email.trim()) {
			message = 'Please enter your email address';
			return;
		}

		loading = true;
		message = '';

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim(), type })
			});

			const result = await response.json();
			
			if (result.success) {
				success = true;
				email = '';
				message = 'Please check your email to confirm your subscription.';
				
				setTimeout(() => {
					success = false;
					message = '';
				}, 5000);
			} else {
				message = result.message || 'Something went wrong. Please try again.';
			}
		} catch (error) {
			console.error('Subscription error:', error);
			message = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="subscribe-form">
	{#if success}
		<div class="success-message">
			<h3>🎉 Thank you!</h3>
			<p>{message}</p>
			<p class="reset-hint">Form will reset in a few seconds...</p>
		</div>
	{:else}
		<form onsubmit={handleSubmit}>
			<div class="form-group">
				<input
					bind:value={email}
					type="email"
					placeholder="Enter your email address"
					required
					disabled={loading}
					class="email-input"
				/>
				<button type="submit" disabled={loading} class="submit-button">
					{loading ? 'Subscribing...' : 'Subscribe'}
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
