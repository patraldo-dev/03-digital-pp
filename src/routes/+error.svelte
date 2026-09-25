<script>
	import { page } from '$app/stores';

	$: t = $page.data?.t || {};
	$: status = $page.status || 404;
	$: heading =
		status === 404
			? t.error_not_found || 'Page not found'
			: t.error_generic || 'Something went wrong';
</script>

<svelte:head>
	<title>{status} - ¡Pinche Poutine! Digital</title>
</svelte:head>

<div class="error-page">
	<p class="error-code" aria-hidden="true">{status}</p>
	<h1>{heading}</h1>
	<p class="error-message">{$page.error?.message || ''}</p>
	<a href="/" class="error-home">{t.error_back_home || 'Back to home'}</a>
</div>

<style>
	.error-page {
		min-height: 60vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 4rem 2rem;
	}

	.error-code {
		font-size: clamp(5rem, 18vw, 9rem);
		font-weight: 900;
		line-height: 1;
		margin: 0;
		color: var(--color-brick);
		opacity: 0.25;
	}

	h1 {
		font-size: clamp(1.8rem, 5vw, 2.5rem);
		font-weight: 800;
		color: var(--color-text);
		margin: 1rem 0 0.5rem;
	}

	.error-message {
		color: #5F6E68;
		max-width: 480px;
		line-height: 1.6;
		margin: 0 0 2rem;
	}

	.error-home {
		display: inline-block;
		background: var(--color-brick);
		color: var(--color-white);
		padding: 0.9rem 2.2rem;
		border-radius: 100px;
		font-weight: 700;
		text-decoration: none;
		transition: transform 0.2s ease;
	}

	.error-home:hover {
		transform: translateY(-2px);
	}
</style>
