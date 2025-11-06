<header class="header">
    <div class="header-content">
        <a href="/" class="logo">
            <img class="pixland-logo" src="favicon.png" alt="Pixland logo" />
            <div class="logo-text">
                <h1>Pixland</h1>
                <p>Collaborative Pixel Art Canvas</p>
            </div>
        </a>
    </div>
</header>

<style>
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

    .pixland-logo {
        width: 60px;
        height: 60px;
        object-fit: contain;
        image-rendering: pixelated;
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

    @media (max-width: 768px) {
        .header-content {
            padding: 0 1rem;
        }

        .logo {
            font-size: 2rem;
        }
    }
</style>