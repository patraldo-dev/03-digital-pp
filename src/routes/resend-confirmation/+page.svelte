<script>
	let email = '';
	let type = 'newsletter';
	let loading = false;
	let message = '';
	let success = false;
	
	async function resendConfirmation() {
		if (!email) return;
		
		loading = true;
		message = '';
		
		try {
			const response = await fetch('/api/resend-confirmation', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, type })
			});
			
			const result = await response.json();
			message = result.message;
			success = result.success;
		} catch (error) {
			message = 'Failed to resend confirmation email';
			success = false;
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Resend Confirmation</title>
</svelte:head>

<main class="container">
	<div class="form-card">
		<h1>Resend Confirmation Email</h1>
		<p>Didn't receive your confirmation email? Enter your details below to resend it.</p>
		
		<form on:submit|preventDefault={resendConfirmation}>
			<div class="form-group">
				<label for="email">Email Address</label>
				<input 
					type="email" 
					id="email" 
					bind:value={email} 
					required 
					placeholder="your@email.com"
				/>
			</div>
			
			<div class="form-group">
				<label for="type">Subscription Type</label>
				<select id="type" bind:value={type}>
					<option value="newsletter">Newsletter</option>
					<option value="events">Events</option>
				</select>
			</div>
			
			<button type="submit" disabled={loading || !email}>
				{loading ? 'Sending...' : 'Resend Confirmation'}
			</button>
		</form>
		
		{#if message}
			<div class="message" class:success class:error={!success}>
				{message}
			</div>
		{/if}
	</div>
</main>

<style>
	.container {
		max-width: 500px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	.form-card {
		background: white;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	
	h1 {
		margin-bottom: 0.5rem;
		color: #1f2937;
	}
	
	p {
		margin-bottom: 2rem;
		color: #6b7280;
	}
	
	.form-group {
		margin-bottom: 1rem;
	}
	
	label {
		display: block;
		margin-bottom: 0.25rem;
		color: #374151;
		font-weight: 500;
	}
	
	input, select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 1rem;
	}
	
	button {
		width: 100%;
		padding: 0.75rem;
		background-color: #007cba;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	button:hover:not(:disabled) {
		background-color: #005a87;
	}
	
	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	.message {
		margin-top: 1rem;
		padding: 0.75rem;
		border-radius: 4px;
		text-align: center;
	}
	
	.message.success {
		background-color: #d1fae5;
		color: #065f46;
		border: 1px solid #10b981;
	}
	
	.message.error {
		background-color: #fef2f2;
		color: #991b1b;
		border: 1px solid #ef4444;
	}
</style>
