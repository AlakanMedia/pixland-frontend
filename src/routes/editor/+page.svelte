<script>
	import { goto } from "$app/navigation";
    import Editor from "../../components/Editor.svelte";
</script>

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
        <Editor />
    </div>
    <button class="home-button" onclick={() => {goto("/");}} title="Go to Play" aria-label="Go to Play">
        <i class="ph ph-house"></i>
    </button>
</div>

<style>
    #principal {
        background-color: var(--bg-base);
        height: 100%;
        line-height: 1.6;
        display: flex;
        flex-direction: column;
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
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    }

    .home-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 56px;
        height: 56px;
        background: var(--accent-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        box-shadow: var(--shadow-lg);
        transition: all 0.2s ease;
        z-index: 1000;
    }

    .home-button:hover {
        background: var(--action-primary-hover);
        transform: scale(1.1);
        box-shadow: var(--shadow-xl);
    }

    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }

        .home-button {
            bottom: 1rem;
            right: 1rem;
        }
    }
</style>