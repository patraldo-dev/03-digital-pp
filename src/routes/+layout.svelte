<script>
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import '../app.css';
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div style="display: contents">
    <Header />
    <main>
        <slot />
    </main>
    <Footer />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
    }

    main {
        min-height: calc(100vh - 200px);
        padding: 2rem 0;
    }

    :global(.container) {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    :global(.btn) {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: #007cba;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.3s ease;
    }

    :global(.btn:hover) {
        background: #005a8b;
    }

    :global(.btn-secondary) {
        background: #6c757d;
    }

    :global(.btn-secondary:hover) {
        background: #5a6268;
    }
</style>
