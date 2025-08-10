<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        // Set current date
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Smooth scrolling for in-page navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Enhanced tab navigation with keyboard support
        document.querySelectorAll('.nav-tab').forEach((tab, index) => {
            tab.addEventListener('keydown', function(e) {
                const tabs = Array.from(document.querySelectorAll('.nav-tab'));
                let newIndex;

                switch(e.key) {
                    case 'ArrowRight':
                        newIndex = (index + 1) % tabs.length;
                        tabs[newIndex].focus();
                        tabs[newIndex].click();
                        e.preventDefault();
                        break;
                    case 'ArrowLeft':
                        newIndex = (index - 1 + tabs.length) % tabs.length;
                        tabs[newIndex].focus();
                        tabs[newIndex].click();
                        e.preventDefault();
                        break;
                    case 'Home':
                        tabs[0].focus();
                        tabs[0].click();
                        e.preventDefault();
                        break;
                    case 'End':
                        tabs[tabs.length - 1].focus();
                        tabs[tabs.length - 1].click();
                        e.preventDefault();
                        break;
                }
            });
        });
    });

    // Tab navigation functionality
    function showSection(event, sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));
        
        // Remove active class from all tabs
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Show selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Add active class to clicked tab
        event.target.classList.add('active');
    }
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

    <main class="container">
        <div class="legal-header">
            <h1>
                <i class="ph ph-scroll icon"></i>
                Legal Terms & Privacy Policy
            </h1>
            <p>
                Please read these terms carefully before using PixLand. By accessing and using our pixel art canvas platform, you agree to comply with these terms and conditions.
            </p>
        </div>

        <nav class="nav-tabs">
            <button class="nav-tab active" onclick={(e) => {showSection(e, "terms");}}>
                <i class="ph ph-file-text"></i>
                Terms of Use
            </button>
            <button class="nav-tab" onclick={(e) => {showSection(e, "privacy");}}>
                <i class="ph ph-shield-check"></i>
                Privacy Policy
            </button>
            <button class="nav-tab" onclick={(e) => {showSection(e, "usage");}}>
                <i class="ph ph-user-check"></i>
                Usage Guidelines
            </button>
            <button class="nav-tab" onclick={(e) => {showSection(e, "content");}}>
                <i class="ph ph-image"></i>
                Content Policy
            </button>
        </nav>

        <!-- Terms of Use Section -->
        <section id="terms" class="content-section active">
            <div class="section-card">
                <h2 class="section-title">
                    <i class="ph ph-file-text icon"></i>
                    Terms of Use
                </h2>

                <div class="subsection">
                    <h3><i class="ph ph-info icon"></i>1. Acceptance of Terms</h3>
                    <p>
                        By accessing, using, or participating in PixLand's collaborative pixel art canvas, you agree to be bound by these Terms of Use. These terms may be updated periodically, and continued use of the service constitutes acceptance of any modifications.
                    </p>
                    <p>
                        PixLand is a platform that allows users to create pixel art collaboratively on a shared canvas, customize color palettes, and download their creations. Users must be at least 13 years of age to use this service.
                    </p>
                </div>

                <div class="subsection">
                    <h3><i class="ph ph-user-circle icon"></i>2. User Responsibilities</h3>
                    <p>As a user of PixLand, you agree to:</p>
                    <ul>
                        <li>Use the service responsibly and in accordance with these terms</li>
                        <li>Respect other users and their creative contributions</li>
                        <li>Not engage in harassment, discrimination, or abusive behavior</li>
                        <li>Not create or contribute offensive, illegal, or inappropriate content</li>
                        <li>Not attempt to disrupt or interfere with the platform's functionality</li>
                        <li>Not use automated tools, bots, or scripts to place pixels</li>
                    </ul>
                </div>

                <div class="subsection">
                    <h3><i class="ph ph-copyright icon"></i>3. Intellectual Property</h3>
                    <p>
                        Content created on PixLand's canvas becomes part of a collaborative work. By contributing pixels to the canvas, you grant PixLand and other users a non-exclusive license to use, display, and modify your contributions as part of the collective artwork.
                    </p>
                    <p>
                        You retain rights to any original artwork you create and download from the platform. However, you acknowledge that collaborative canvas content may be built upon by other users.
                    </p>
                </div>

                <div class="highlight-box warning">
                    <h4><i class="ph ph-warning"></i>Important Notice</h4>
                    <p>
                        PixLand reserves the right to remove content, suspend accounts, or terminate access for users who violate these terms or engage in disruptive behavior.
                    </p>
                </div>
            </div>
        </section>

        <!-- Privacy Policy Section -->
        <section id="privacy" class="content-section">
            <div class="section-card">
                <h2 class="section-title">
                    <i class="ph ph-shield-check icon"></i>
                    Privacy Policy
                </h2>

                <div class="subsection">
                    <h3><i class="ph ph-database icon"></i>1. Information We Collect</h3>
                    <p>
                        PixLand collects minimal information necessary to provide our services:
                    </p>
                    <ul>
                        <li>Basic technical information: IP address, browser type, device information</li>
                        <li>Canvas interactions: Pixel placements, color choices, timing data</li>
                        <li>Session data: Temporary information stored during your visit</li>
                        <li>Optional user preferences: Color palettes, display settings</li>
                    </ul>
                </div>

                <div class="subsection">
                    <h3><i class="ph ph-cookie icon"></i>2. Cookies and Local Storage</h3>
                    <p>
                        We use cookies and browser local storage to enhance your experience:
                    </p>
                    <ul>
                        <li>Saving your color palette preferences</li>
                        <li>Remembering your canvas view settings</li>
                        <li>Maintaining session continuity</li>
                        <li>Analyzing platform usage for improvements</li>
                    </ul>
                    <p>
                        You can disable cookies in your browser settings, though this may limit some functionality.
                    </p>
                </div>

                <div class="subsection">
                    <h3><i class="ph ph-lock icon"></i>3. Data Protection</h3>
                    <p>
                        We implement appropriate security measures to protect your information. However, no internet transmission is completely secure. We do not store personal identifying information beyond what's necessary for service operation.
                    </p>
                    <p>
                        Canvas data and pixel contributions are stored to maintain the collaborative artwork and may be retained indefinitely as part of the platform's creative history.
                    </p>
                </div>

                <div class="highlight-box info">
                    <h4><i class="ph ph-info"></i>Data Retention</h4>
                    <p>
                        Canvas data is preserved to maintain the integrity of collaborative artworks. Personal session data is automatically cleared after extended periods of inactivity.
                    </p>
                </div>
            </div>
        </section>

        <!-- Usage Guidelines Section -->
        <section id="usage" class="content-section">
            <div class="section-card">
                <h2 class="section-title">
                    <i class="ph ph-user-check icon"></i>
                    Usage Guidelines
                </h2>

                <div class="subsection">
                    <h3><i class="ph ph-hand-palm icon"></i>1. Prohibited Activities</h3>
                    <ul>
                        <li><strong>No automated tools:</strong> Bots, scripts, or automated pixel placement tools are strictly forbidden</li>
                        <li><strong>No circumvention:</strong> Using VPNs, proxies, or multiple accounts to bypass cooldowns or restrictions</li>
                        <li><strong>No disruption:</strong> Intentionally overloading servers or interfering with other users' experience</li>
                        <li><strong>No malicious content:</strong> Creating offensive, hateful, or inappropriate imagery</li>
                    </ul>
                </div>

                <div class="subsection">
                    <h3><i class="ph ph-check-circle icon"></i>2. Encouraged Behavior</h3>
                    <ul>
                        <li><strong>Collaborate respectfully:</strong> Work with others to create amazing pixel art</li>
                        <li><strong>Be creative:</strong> Contribute original and interesting designs</li>
                        <li><strong>Help newcomers:</strong> Welcome new users and share tips</li>
                        <li><strong>Report issues:</strong> Help us maintain a positive community by reporting problems</li>
                    </ul>
                </div>

                <div class="subsection">
                    <h3><i class="ph ph-palette icon"></i>3. Canvas Etiquette</h3>
                    <ul>
                        <li>Respect existing artwork and consider collaborative improvements</li>
                        <li>Use the color palette thoughtfully and considerately</li>
                        <li>Avoid covering others' work without artistic purpose</li>
                        <li>Participate in community discussions about canvas direction</li>
                    </ul>
                </div>

                <div class="highlight-box success">
                    <h4><i class="ph ph-users"></i>Community First</h4>
                    <p>
                        PixLand is a collaborative space. The best creations come from users working together respectfully and creatively.
                    </p>
                </div>
            </div>
        </section>

        <!-- Content Policy Section -->
        <section id="content" class="content-section">
            <div class="section-card">
                <h2 class="section-title">
                    <i class="ph ph-image icon"></i>
                    Content Policy
                </h2>

                <div class="subsection">
                    <h3><i class="ph ph-x-circle icon"></i>1. Prohibited Content</h3>
                    <p>The following types of content are not allowed on PixLand:</p>
                    <ul>
                        <li>Hateful, discriminatory, or harassing imagery</li>
                        <li>Sexually explicit or inappropriate content</li>
                        <li>Violence, gore, or disturbing imagery</li>
                        <li>Copyrighted material used without permission</li>
                        <li>Personal information or doxxing attempts</li>
                        <li>Spam, advertising, or promotional content</li>
                        <li>Content that violates local laws or regulations</li>
                    </ul>
                </div>

                <div class="subsection">
                    <h3><i class="ph ph-flag icon"></i>2. Reporting System</h3>
                    <p>
                        If you encounter inappropriate content or behavior:
                    </p>
                    <ul>
                        <li>Report the issue through our contact system</li>
                        <li>Provide specific details about the violation</li>
                        <li>Include screenshots or coordinates when helpful</li>
                        <li>Allow our moderation team time to review and respond</li>
                    </ul>
                </div>

                <div class="subsection">
                    <h3><i class="ph ph-gavel icon"></i>3. Moderation Actions</h3>
                    <p>
                        Violations may result in:
                    </p>
                    <ul>
                        <li>Content removal or modification</li>
                        <li>Temporary cooldown extensions</li>
                        <li>Account restrictions or suspension</li>
                        <li>Permanent ban for severe or repeated violations</li>
                    </ul>
                </div>

                <div class="subsection">
                    <h3><i class="ph ph-download icon"></i>4. Content Downloads</h3>
                    <p>
                        Users can download canvas images for personal use. However:
                    </p>
                    <ul>
                        <li>Downloaded content remains subject to collaborative nature of creation</li>
                        <li>Commercial use of canvas content may require additional permissions</li>
                        <li>Individual pixel contributions are part of the collective work</li>
                        <li>Credit to PixLand and the community is appreciated when sharing</li>
                    </ul>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p><strong>PixLand</strong> - Collaborative Pixel Art Platform</p>
            <p>Last updated: <span id="currentDate"></span></p>
            <p>
                Questions or concerns? <a href="mailto:legal@pixland.com" class="contact-link">Contact us</a>
            </p>
        </div>
    </footer>

    <button class="home-button" onclick={() => {goto("/");}} title="Go to Play" aria-label="Go to Play">
        <i class="ph ph-house"></i>
    </button>
</div>

<style>
    #principal {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background-color: var(--bg-base);
        color: var(--text-primary);
        line-height: 1.6;
        scrollbar-width: thin;
        scrollbar-color: #4b5563 var(--bg-base);
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

    /* === HEADER === */
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
        margin-bottom: 2rem;
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
        padding: 2rem 0;
        margin-top: 4rem;
    }

    .footer-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 2rem;
        text-align: center;
        color: var(--text-secondary);
    }

    .footer-content p {
        margin-bottom: 0.5rem;
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
            padding: 2rem 1rem;
        }

        .header-content {
            padding: 0 1rem;
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