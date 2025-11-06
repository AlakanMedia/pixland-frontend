<script>
    import { goto } from "$app/navigation";
    import PageHeader from "../../components/PageHeader.svelte";

	let activeTab = $state("terms");

    const tabs = [
        { id: "terms", label: "Terms of Use", icon: "ph-file-text" },
        { id: "privacy", label: "Privacy Policy", icon: "ph-shield-check" },
        { id: "usage", label: "Usage Guidelines", icon: "ph-user-check" },
        { id: "content", label: "Content Policy", icon: "ph-image" }
    ];

	// La navegación con teclado también es un caso de uso avanzado del DOM.
	// Esta función ahora es mucho más simple y no necesita consultar el DOM.
	function handleKeydown(e, currentIndex) {
		const tabCount = tabs.length;
		let newIndex;

		switch (e.key) {
			case 'ArrowRight':
			case 'ArrowDown':
				newIndex = (currentIndex + 1) % tabCount;
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				newIndex = (currentIndex - 1 + tabCount) % tabCount;
				break;
			case 'Home':
				newIndex = 0;
				break;
			case 'End':
				newIndex = tabCount - 1;
				break;
			default:
				return; // Salir si no es una tecla de navegación
		}

		e.preventDefault();
		// Cambiamos el estado reactivo, y Svelte se encarga del resto.
		activeTab = tabs[newIndex].id;

		// Movemos el foco al nuevo tab. Necesitaremos bind:this en el HTML.
		// Usamos un pequeño timeout para asegurar que el DOM se actualice antes de mover el foco.
		setTimeout(() => {
			const nextTab = document.querySelector(`[data-tabid="${tabs[newIndex].id}"]`);
			nextTab?.focus();
		}, 0);
    }
</script>

<div id="principal">
    <PageHeader />
    <main class="container">
        <div class="legal-header">
            <h1>
                <i class="ph ph-scroll icon"></i>
                Legal & Privacy Stuff
            </h1>
            <p>Here's the simple, no-fluff breakdown of how things work at Pixland. By using theplatform, you agree to these terms.</p>
        </div>

        <div class="nav-tabs" role="tablist">
            {#each tabs as tab, index}
                <button
                    class="nav-tab"
                    class:active={activeTab === tab.id}
                    onclick={() => (activeTab = tab.id)}
                    onkeydown={(e) => handleKeydown(e, index)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={tab.id}
                    tabindex={activeTab === tab.id ? 0 : -1}
                    data-tabid={tab.id}
                >
                    <i class="ph {tab.icon}"></i>
                    {tab.label}
                </button>
            {/each}
        </div>

        {#if activeTab === "terms"}
            <section id="terms" class="content-section active">
                <div class="section-card">
                    <h2 class="section-title"><i class="ph ph-file-text icon"></i> Terms of Use</h2>
                    <div class="subsection">
                        <h3><i class="ph ph-info icon"></i>1. The Basics</h3>
                        <p>
                            Welcome to Pixland. This is a collaborative art project. By placing a pixel, you're
                            part of it. We expect you to be at least 13 years old to participate. These terms
                            might change, and if you keep using the site, it means you're cool with the new ones.
                        </p>
                    </div>
                    <div class="subsection">
                        <h3><i class="ph ph-user-circle icon"></i>2. Your Responsibilities</h3>
                        <p>We trust you to be responsible. Your main obligations are simple:</p>
                        <ul>
                            <li>Don't try to break the site or overload our servers — creative chaos is fine, server destruction is not.</li>
                            <li><strong>Do not use bots, scripts, or any automated tools to place pixels.</strong> Only real, genuine humans clicking one pixel at a time... probably.</li>
                        </ul>
                        <p>Regarding content, this canvas is a space for free expression. <strong>Pretty much anything goes.</strong> We don't police art, ideas, or messages. Your creations are your own responsibility.</p>
                    </div>
                    <div class="subsection">
                        <h3><i class="ph ph-copyright icon"></i>3. Intellectual Property (or lack thereof)</h3>
                        <p>This is simple: <strong>there is none.</strong> Everything created on the Pixland canvas is dedicated to the <strong>public domain</strong>.</p>
                        <p>That means any art you create here is free for anyone—including yourself—to use for any purpose, personal or commercial, without any credit or attribution required. By placing a pixel, you agree to waive all rights to your contribution. Go wild with it.</p>
                    </div>
                    <div class="highlight-box warning">
                        <h4><i class="ph ph-warning"></i>A Quick Heads-Up</h4>
                        <p>While we champion free expression, we will take action against users who are actively trying to harm the platform's functionality (like using bots or DDoSing). Play fair.</p>
                    </div>
                </div>
            </section>

        {:else if activeTab === "privacy"}
            <section id="privacy" class="content-section active">
                <div class="section-card">
                    <h2 class="section-title"><i class="ph ph-shield-check icon"></i> Privacy Policy</h2>

                    <div class="subsection">
                        <h3><i class="ph ph-database icon"></i>1. What We Store About You</h3>
                        <p>We keep our data collection to the absolute minimum needed to run the service. If you create an account, this is what we store:</p>
                        <ul>
                            <li>Your <strong>username</strong> (which is public).</li>
                            <li>Your <strong>email address</strong> (kept private).</li>
                            <li>Your <strong>password</strong> (which is hashed, meaning even we can't see it).</li>
                            <li>Your saved <strong>platform settings</strong> (like selected palette, show grid and other options).</li>
                        </ul>
                    </div>
                    <div class="subsection">
                        <h3><i class="ph ph-cookie icon"></i>2. Cookies</h3>
                        <p>We use a single, essential cookie. Its only job is to store your access token.</p>
                        <p>This token proves that you're logged in, so you don't have to log in again every time the page loads. That's it. We don't use cookies for tracking, advertising, or anything else.</p>
                    </div>
                    <div class="highlight-box info">
                        <h4><i class="ph ph-info"></i>Our Promise</h4>
                        <p>We will never sell or share your personal data with third parties. This is a passion project, not a data-harvesting business.</p>
                    </div>
                </div>
            </section>

        {:else if activeTab === "usage"}
            <section id="usage" class="content-section active">
                <div class="section-card">
                    <h2 class="section-title"><i class="ph ph-user-check icon"></i> Usage Guidelines</h2>
                    <div class="subsection">
                        <h3><i class="ph ph-hand-palm icon"></i>1. Prohibited Technical Activities</h3>
                        <p>To keep the game fair and fun for everyone, the following are strictly forbidden:</p>
                        <ul>
                            <li><strong>No automated tools:</strong> Bots, scripts, or any form of automated pixel placement will result in a ban.</li>
                            <li><strong>No circumvention:</strong> Don't use VPNs, proxies, or other means to get around cooldown timers or other restrictions.</li>
                            <li><strong>No disruption:</strong> Any attempt to intentionally crash the server or disrupt the service for other users is off-limits.</li>
                        </ul>
                    </div>
                    <div class="subsection">
                        <h3><i class="ph ph-check-circle icon"></i>2. Encouraged Behavior</h3>
                        <ul>
                            <li><strong>Be creative:</strong> The canvas is your oyster. Make something cool.</li>
                            <li><strong>Collaborate (or don't):</strong> Team up with others to build massive projects, or carve out your own little corner. It's up to you.</li>
                            <li><strong>Experiment:</strong> Try new things, develop new techniques, and see what happens. The canvas is constantly changing.</li>
                        </ul>
                    </div>
                    <div class="highlight-box success">
                        <h4><i class="ph ph-robot"></i>The Golden Rule</h4>
                        <p>If a human is placing the pixel, you're good. If a machine is doing it for you, you're not.</p>
                    </div>
                </div>
            </section>

        {:else if activeTab === "content"}
            <section id="content" class="content-section active">
                <div class="section-card">
                    <h2 class="section-title"><i class="ph ph-image icon"></i> Content Policy</h2>
                    <div class="subsection">
                        <h3><i class="ph ph-scales icon"></i>1. Our Stance on Content</h3>
                        <p>Pixland is a platform for free expression. We do not moderate artwork, political statements, offensive content, or anything else you choose to create. The canvas reflects the raw creativity (and chaos) of the internet.</p>
                        <p>However, there are two hard lines we draw to protect individuals and comply with the law.</p>
                    </div>
                    <div class="subsection">
                        <h3><i class="ph ph-gavel icon"></i>2. Prohibited Content</h3>
                        <p>The only content that will be removed and can lead to a ban is:</p>
                        <ul>
                            <li><strong>Personal Information:</strong> Posting someone's private, identifying information without their consent (doxxing).</li>
                        </ul>
                    </div>
                    <div class="subsection">
                        <h3><i class="ph ph-download icon"></i>3. Content Downloads</h3>
                        <p>As stated in our Terms of Use, all art on the canvas is in the public domain. You can download an image of any section of the canvas and use it for whatever you want. No strings attached.</p>
                    </div>
                </div>
            </section>
        {/if}
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p>Last updated: 11/06/2025</p>
            <p>Questions? <a href="mailto:alakan439@gmail.com" class="contact-link">Contact us</a></p>
        </div>
    </footer>

    <button
        class="home-button"
        onclick={() => {goto('/');}}
        title="Go to Play"
        aria-label="Go to Play"
    >
        <i class="ph ph-house"></i>
    </button>
</div>

<style>
    #principal {
        background-color: var(--bg-base);
        color: var(--text-primary);
        line-height: 1.6;
    }

    #principal::-webkit-scrollbar {
        width: 8px;
    }

    #principal::-webkit-scrollbar-track {
        background: var(--bg-base);
    }

    #principal::-webkit-scrollbar-thumb {
        background-color: #4b5563;
        border-radius: 4px;
    }

    ::selection {
        background-color: var(--selection-bg);
        color: var(--text-primary);
    }

    /* === MAIN CONTENT === */
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .legal-header {
        text-align: center;
        margin-bottom: 3rem;
        padding: 2rem;
        background-color: var(--bg-elevated-1);
        border-radius: 12px;
        border: 1px solid var(--border-default);
    }

    .legal-header h1 {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--text-primary);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .legal-header .icon {
        font-size: 2.5rem;
        color: var(--accent-primary);
    }

    .legal-header p {
        font-size: 1.125rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
    }

    /* === NAVIGATION === */
    .nav-tabs {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
        background-color: var(--bg-elevated-1);
        padding: 0.5rem;
        border-radius: 12px;
        border: 1px solid var(--border-default);
        overflow-x: auto;
    }

    .nav-tab {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.875rem;
        font-weight: 500;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .nav-tab:hover {
        background-color: var(--hover-overlay);
        color: var(--text-primary);
    }

    .nav-tab.active {
        background-color: var(--action-primary);
        color: var(--action-primary-text);
    }

    /* === CONTENT SECTIONS === */
    .content-section {
        display: none;
    }

    .content-section.active {
        display: block;
    }

    .section-card {
        background-color: var(--bg-elevated-1);
        border: 1px solid var(--border-default);
        border-radius: 12px;
        padding: 2rem;
        box-shadow: var(--shadow-sm);
    }

    .section-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .section-title .icon {
        font-size: 1.5rem;
        color: var(--accent-primary);
    }

    .subsection {
        margin-bottom: 2rem;
    }

    .subsection h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .subsection h3 .icon {
        font-size: 1rem;
        color: var(--accent-secondary);
    }

    .subsection p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        line-height: 1.7;
    }

    .subsection ul {
        list-style: none;
        padding-left: 0;
    }

    .subsection li {
        color: var(--text-secondary);
        margin-bottom: 0.75rem;
        padding-left: 1.5rem;
        position: relative;
        line-height: 1.7;
    }

    .subsection li::before {
        content: "•";
        color: var(--accent-primary);
        font-weight: bold;
        position: absolute;
        left: 0;
    }

    /* === HIGHLIGHT BOXES === */
    .highlight-box {
        background-color: var(--bg-elevated-2);
        border: 1px solid var(--border-prominent);
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1.5rem 0;
    }

    .highlight-box.warning {
        background-color: var(--state-warning-bg);
        border-color: var(--state-warning-border);
    }

    .highlight-box.info {
        background-color: var(--state-info-bg);
        border-color: var(--state-info-border);
    }

    .highlight-box.success {
        background-color: var(--state-success-bg);
        border-color: var(--state-success-border);
    }

    .highlight-box h4 {
        color: var(--text-primary);
        font-weight: 600;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .highlight-box.warning h4 {
        color: var(--state-warning);
    }

    .highlight-box.info h4 {
        color: var(--state-info);
    }

    .highlight-box.success h4 {
        color: var(--state-success);
    }

    /* === FOOTER === */
    .footer {
        background-color: var(--bg-elevated-1);
        border-top: 1px solid var(--border-default);
        padding: 1.5rem 0;
    }

    .footer-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 2rem;
        text-align: center;
        color: var(--text-secondary);
    }

    .contact-link {
        color: var(--accent-primary);
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .contact-link:hover {
        color: var(--accent-secondary);
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

    /* === RESPONSIVE === */
    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }

        .legal-header h1 {
            font-size: 2rem;
            flex-direction: column;
            gap: 0.5rem;
        }

        .nav-tabs {
            flex-direction: column;
        }

        .nav-tab {
            justify-content: center;
        }

        .section-card {
            padding: 1.5rem;
        }

        .home-button {
            bottom: 1rem;
            right: 1rem;
        }
    }
</style>