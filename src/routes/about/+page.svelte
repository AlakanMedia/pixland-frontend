<script>
	import { goto } from "$app/navigation";
</script>

<div id="principal">
    <div class="container">
        <header class="header">
            <div class="logo">
                <i class="ph ph-grid-four"></i>
                PixLand
            </div>
            <p class="subtitle">
                A free online pixel art playground where creativity meets community. Paint, create, and share your digital artwork on our collaborative canvas.
            </p>
        </header>

        <main class="main-content">
            <div class="card">
                <h2>
                    <i class="ph ph-paint-brush"></i>
                    What is PixLand?
                </h2>
                <p>
                    PixLand is a free online pixel art game designed for artists, gamers, and anyone who loves to create. 
                    Our shared canvas allows you to paint alongside other creators in real-time, building a constantly 
                    evolving masterpiece together.
                </p>
                <p>
                    Whether you're a seasoned pixel artist or just starting out, PixLand provides all the tools you need 
                    to bring your imagination to life. Create stunning artwork, download your creations, and become part 
                    of our growing creative community.
                </p>
            </div>

            <div class="card">
                <h2>
                    <i class="ph ph-sparkle"></i>
                    Features
                </h2>
                <div class="features">
                    <div class="feature-item">
                        <i class="ph ph-palette"></i>
                        <h3>Custom Palettes</h3>
                        <p>Create and customize your own color palettes for unique artistic expression</p>
                    </div>
                    <div class="feature-item">
                        <i class="ph ph-users-three"></i>
                        <h3>Real-time Collaboration</h3>
                        <p>Paint alongside other artists on our shared canvas in real-time</p>
                    </div>
                    <div class="feature-item">
                        <i class="ph ph-download-simple"></i>
                        <h3>Download Creations</h3>
                        <p>Save and download your pixel art masterpieces in high quality</p>
                    </div>
                    <div class="feature-item">
                        <i class="ph ph-heart"></i>
                        <h3>100% Free</h3>
                        <p>No subscriptions, no ads, just pure creative fun for everyone</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>
                    <i class="ph ph-globe"></i>
                    Our Community
                </h2>
                <p>
                    PixLand has grown into a vibrant community of pixel artists from around the world. 
                    Every day, hundreds of creators come together to contribute to our ever-changing canvas, 
                    sharing techniques, inspiration, and friendship along the way.
                </p>
                <div class="community-stats">
                    <div class="stat-item">
                        <div class="stat-number">10K+</div>
                        <div class="stat-label">Active Artists</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">50K+</div>
                        <div class="stat-label">Artworks Created</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">∞</div>
                        <div class="stat-label">Fun & Creativity</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>
                    <i class="ph ph-rocket-launch"></i>
                    Getting Started
                </h2>
                <p>
                    Jump right in! No account required, no downloads necessary. Just visit our canvas, 
                    pick up your digital brush, and start creating. Whether you want to add a single pixel 
                    or craft an elaborate scene, every contribution makes PixLand more amazing.
                </p>
                <p>
                    New to pixel art? Don't worry! Our community is incredibly welcoming and always happy 
                    to share tips and techniques. The best way to learn is by doing, so dive in and start experimenting!
                </p>
            </div>
        </main>

        <div class="actions">
            <a href="/" class="btn btn-primary">
                <i class="ph ph-play"></i>
                Start Creating
            </a>
            <a href="https://github.com/AlakanMedia" class="btn btn-secondary">
                <i class="ph ph-coffee"></i>
                Support PixLand
            </a>
        </div>

        <div class="creator-note">
            <p>
                PixLand was created as a passion project for the love of pixel art and community. 
                It's built by creators, for creators, with no corporate agenda – just pure creative joy.
            </p>
        </div>
    </div>

    <button class="home-button" onclick={() => {goto("/");}} title="Go to Play" aria-label="Go to Play">
        <i class="ph ph-house"></i>
    </button>
</div>

<style>
    :global(*) {
		margin: 0;
        padding: 0;
        box-sizing: border-box;
	}

    #principal {
        width: 100%;
        background-color: var(--bg-base);
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .logo {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--accent-primary);
        margin-bottom: 1rem;
    }

    .logo i {
        font-size: 2.5rem;
    }

    .subtitle {
        color: var(--text-secondary);
        font-size: 1.2rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .main-content {
        display: grid;
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .card {
        background: var(--bg-elevated-1);
        border: 1px solid var(--border-default);
        border-radius: 12px;
        padding: 2rem;
        box-shadow: var(--shadow-md);
    }

    .card h2 {
        color: var(--text-primary);
        font-size: 1.5rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .card h2 i {
        color: var(--accent-secondary);
    }

    .card p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }

    .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .feature-item {
        background: var(--bg-elevated-2);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;
    }

    .feature-item i {
        font-size: 2rem;
        color: var(--accent-primary);
        margin-bottom: 0.5rem;
    }

    .feature-item h3 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }

    .feature-item p {
        color: var(--text-tertiary);
        font-size: 0.9rem;
    }

    .community-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .stat-item {
        text-align: center;
        padding: 1rem;
        background: var(--bg-elevated-3);
        border-radius: 8px;
    }

    .stat-number {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--accent-secondary);
    }

    .stat-label {
        color: var(--text-tertiary);
        font-size: 0.9rem;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-top: 3rem;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
        border: 1px solid transparent;
        cursor: pointer;
    }

    .btn-primary {
        background-color: var(--action-primary);
        color: var(--action-primary-text);
        border-color: var(--action-primary);
    }

    .btn-primary:hover {
        background-color: var(--action-primary-hover);
        border-color: var(--action-primary-hover);
        transform: translateY(-1px);
        box-shadow: var(--shadow-colored);
    }

    .btn-secondary {
        background-color: var(--action-secondary);
        color: var(--action-secondary-text);
        border-color: var(--action-secondary);
    }

    .btn-secondary:hover {
        background-color: var(--action-secondary-hover);
        border-color: var(--action-secondary-hover);
        transform: translateY(-1px);
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

    .creator-note {
        text-align: center;
        margin-top: 3rem;
        padding: 1.5rem;
        background: var(--bg-elevated-2);
        border-radius: 12px;
        border-left: 4px solid var(--accent-tertiary);
    }

    .creator-note p {
        color: var(--text-secondary);
        font-style: italic;
    }

    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }
        
        .logo {
            font-size: 2rem;
        }
        
        .features {
            grid-template-columns: 1fr;
        }
        
        .actions {
            flex-direction: column;
            align-items: center;
        }
        
        .home-button {
            bottom: 1rem;
            right: 1rem;
        }
    }
</style>