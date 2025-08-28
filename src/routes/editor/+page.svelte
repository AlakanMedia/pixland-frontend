<div id="principal">
	<header class="header">
		<div class="header-content">
			<a href="/" class="logo">
                <i class="ph ph-file-text logo-icon"></i>
				<div class="logo-text">
					<h1>PixLand Editor</h1>
					<p>A collaborative editor where anyone can freely write and edit in real time, sharing ideas without limits.</p>
				</div>
			</a>
		</div>
	</header>
    <div class="container">

    </div>
</div>

<style>
    #principal {
        background-color: var(--bg-base);
        line-height: 1.6;
    }

    .header {
        background-color: var(--bg-elevated-1);
        border-bottom: 1px solid var(--border-default);
        padding: 1.5rem 0;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: var(--shadow-sm);
    }

    .header-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: var(--text-primary);
    }

    .logo-icon {
        font-size: 2rem;
        color: var(--accent-primary);
    }

    .logo-text h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
    }

    .logo-text p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }
</style>