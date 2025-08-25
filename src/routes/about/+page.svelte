<script>
	import { goto } from "$app/navigation";
</script>

<div id="principal">
	<header class="header">
		<div class="header-content">
			<a href="/" class="logo">
				<i class="ph ph-palette logo-icon"></i>
				<div class="logo-text">
					<h1>PixLand</h1>
					<p>Collaborative Pixel Art Canvas</p>
				</div>
			</a>
		</div>
	</header>

    <div class="container">
        <main class="main-content">
            <div class="card">
                <h2>
                    <i class="ph ph-paint-brush"></i>
                    What is PixLand?
                </h2>
                <p>
                    PixLand is a collaborative, online pixel art game where you can leave your mark on a
                    massive, shared canvas. Place pixels one by one, team up with friends, or just relax and
                    watch the digital world evolve in real-time.
                </p>
                <p>
                    As you contribute to the canvas, you'll gain experience and level up, unlocking new
                    rewards and colors to expand your artistic toolkit. It's a simple concept with endless
                    possibilities, built for anyone who loves to create.
                </p>
            </div>

            <div class="card">
                <h2>
                    <i class="ph ph-sparkle"></i>
                    Features
                </h2>
                <div class="features">
                    <div class="feature-item">
                        <i class="ph ph-users-three"></i>
                        <h3>Real-time Canvas</h3>
                        <p>Paint alongside other artists on our shared canvas and see your art come to life instantly.</p>
                    </div>
                    <div class="feature-item">
                        <i class="ph ph-trophy"></i>
                        <h3>Level Up & Unlock</h3>
                        <p>Place pixels to gain XP, level up, and earn new rewards to show off your dedication.</p>
                    </div>
                    <div class="feature-item">
                        <i class="ph ph-crop"></i>
                        <h3>Canvas Image Exporter</h3>
                        <p>Capture a snapshot of any part of the canvas by defining coordinates to download your favorite creations.</p>
                    </div>
                    <div class="feature-item">
                        <i class="ph ph-heart"></i>
                        <h3>100% Free & For Fun</h3>
                        <p>No subscriptions, no hidden costs. Just pure, creative fun built as a passion project.</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>
                    <i class="ph ph-rocket-launch"></i>
                    Getting Started
                </h2>
                <p>It couldn't be easier. Jump right in—no account required, no downloads necessary. Just head to the canvas, pick a color, and place your first pixel.</p>
                <p>Whether you want to add a single dot or craft an elaborate scene, every contribution makes PixLand a more interesting place. Go on, give it a try!</p>
            </div>
            <div class="card">
                <h2>
            	    <i class="ph ph-binoculars"></i>
            	    An Ode to Our Inspiration
                </h2>
                <p>If you're looking at our layout and thinking, "Hey, this feels... familiar," you've got a good eye! PixLand's design is heavily inspired by (okay, fine, lovingly copied from) the awesome <a href="https://pixelzone.io" target="_blank" rel="noopener noreferrer">pixelzone.io</a>.</p>
                <p>They built something amazing, and this project is, in many ways, a tribute to their great work. We're just standing on the shoulders of giants... and maybe borrowing their fashion sense.</p>
            </div>
        </main>

        <div class="actions">
            <a href="/" class="btn btn-primary">
                <i class="ph ph-play"></i>
                Start Creating
            </a>
            <a href="https://github.com/AlakanMedia" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                <i class="ph ph-coffee"></i>
                Support the Creator
            </a>
        </div>

        <div class="creator-note">
            <p>PixLand is a one-person passion project, built in my spare time for the love of pixel art and online communities. It's made by a creator, for creators, with no corporate agenda—just a fun place to draw.</p>
        </div>
    </div>

    <button class="home-button" onclick={() => {goto("/");}} title="Go to Play" aria-label="Go to Play">
        <i class="ph ph-house"></i>
    </button>
</div>

<style>
    #principal {
        width: 100%;
        background-color: var(--bg-base);
        line-height: 1.6;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
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

    .card a {
        color: var(--accent-primary);
        text-decoration: underline;
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
        line-height: 1.6;
    }

    .card p:last-child {
        margin-bottom: 0;
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
        display: block; /* Para centrar el icono correctamente */
    }

    .feature-item h3 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }

    .feature-item p {
        color: var(--text-tertiary);
        font-size: 0.9rem;
        margin-bottom: 0;
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
        margin-bottom: 0;
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