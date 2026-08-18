<div class="admin-layout">
    <nav class="admin-nav">
        <div class="admin-header">
            <h1><a href="/admin">Admin Panel</a></h1>
        </div>
        <ul class="nav-links">
            <li><a href="/admin/subscribers" class:active={$page.url.pathname === '/admin/subscribers'} aria-current={$page.url.pathname === '/admin/subscribers' ? 'page' : undefined}><span aria-hidden="true">📧</span> Subscribers</a></li>
            <li><a href="/" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">🌐</span> View Site</a></li>
        </ul>
    </nav>

    <div class="admin-main">
        <slot />
    </div>
</div>

<script>
    import { page } from '$app/stores';
</script>

<style>
    .admin-layout {
        display: flex;
        min-height: 100vh;
        background: #f8f9fa;
    }

    .admin-nav {
        width: 250px;
        background: #2c3e50;
        color: white;
        padding: 0;
        flex-shrink: 0;
    }

    .admin-header {
        padding: 2rem 1.5rem;
        border-bottom: 1px solid #34495e;
    }

    .admin-header h1 {
        margin: 0;
        font-size: 1.5rem;
    }

    .admin-header a {
        color: white;
        text-decoration: none;
    }

    .nav-links {
        list-style: none;
        margin: 0;
        padding: 1rem 0;
    }

    .nav-links li {
        margin: 0;
    }

    .nav-links a {
        display: block;
        padding: 1rem 1.5rem;
        color: #bdc3c7;
        text-decoration: none;
        transition: all 0.3s ease;
        border-left: 4px solid transparent;
    }

    .nav-links a:hover,
    .nav-links a.active {
        background: #34495e;
        color: white;
        border-left-color: #3498db;
    }

    .admin-main {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
    }

    /* Global admin styles */
    :global(.admin-main h1) {
        color: #2c3e50;
        margin-bottom: 2rem;
        font-size: 2.5rem;
    }

    :global(.admin-main h2) {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        font-size: 1.8rem;
    }

    :global(.admin-card) {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 2rem;
        margin-bottom: 2rem;
    }

    :global(.admin-table) {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    :global(.admin-table th),
    :global(.admin-table td) {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    :global(.admin-table th) {
        background: #f8f9fa;
        font-weight: 600;
        color: #2c3e50;
    }

    :global(.admin-table tr:hover) {
        background: #f8f9fa;
    }

    :global(.status-badge) {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    :global(.status-confirmed) {
        background: #d4edda;
        color: #155724;
    }

    :global(.status-pending) {
        background: #fff3cd;
        color: #856404;
    }

    @media (max-width: 768px) {
        .admin-layout {
            flex-direction: column;
        }

        .admin-nav {
            width: 100%;
            order: 2;
        }

        .admin-main {
            order: 1;
            padding: 1rem;
        }

        .nav-links {
            display: flex;
            padding: 0.5rem;
            overflow-x: auto;
        }

        .nav-links li {
            flex-shrink: 0;
        }

        .nav-links a {
            padding: 0.75rem 1rem;
            white-space: nowrap;
            border-left: none;
            border-bottom: 4px solid transparent;
        }

        .nav-links a:hover,
        .nav-links a.active {
            border-left: none;
            border-bottom-color: #3498db;
        }
    }
</style>
