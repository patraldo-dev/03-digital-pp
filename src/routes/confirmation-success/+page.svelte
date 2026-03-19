<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
	let error = false;
	let already = false;
	let expired = false;
	let errorMessage = '';
	
	onMount(() => {
		error = $page.url.searchParams.get('error');
		already = $page.url.searchParams.get('already') === 'true';
		expired = $page.url.searchParams.get('expired') === 'true';
		
		// Set error message based on error type
		if (error === 'invalid') {
			errorMessage = 'Invalid confirmation link';
		} else if (error === 'expired') {
			errorMessage = 'Confirmation link has expired';
		} else if (error === 'server') {
			errorMessage = 'An error occurred. Please try again.';
		}
	});
</script>

<svelte:head>
	<title>Subscription Confirmed</title>
</svelte:head>

<main class="container">
	<div class="success-card">
		{#if error && !already}
			<div class="icon error">✗</div>
			<h1>Oops!</h1>
			<p>{errorMessage}</p>
		{:else}
			<div class="icon">✓</div>
			<h1>
				{#if already}
					Already Subscribed!
				{:else}
					Subscription Confirmed!
				{/if}
			</h1>
			<p>
				{#if already}
					You're already subscribed to our updates. Thanks for being part of our community!
				{:else}
					Thank you for confirming your subscription. You'll start receiving updates soon!
				{/if}
			</p>
		{/if}
		<a href="/" class="home-button">Return to Home</a>
	</div>
</main>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
	}
	
	.success-card {
		background: white;
		border-radius: 8px;
		padding: 3rem 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	
	.icon {
		font-size: 4rem;
		color: #22c55e;
		margin-bottom: 1rem;
	}
	
	.icon.error {
		color: #ef4444;
	}
	
	h1 {
		color: #1f2937;
		margin-bottom: 1rem;
	}
	
	p {
		color: #6b7280;
		margin-bottom: 2rem;
		line-height: 1.6;
	}
	
	.home-button {
		display: inline-block;
		background-color: #007cba;
		color: white;
		padding: 0.75rem 1.5rem;
		text-decoration: none;
		border-radius: 4px;
		transition: background-color 0.2s;
	}
	
	.home-button:hover {
		background-color: #005a87;
	}
</style>
