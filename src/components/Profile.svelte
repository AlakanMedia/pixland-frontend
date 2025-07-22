<script>
	import { onMount, tick } from "svelte";
    import { ui, user } from "../shared.svelte.js";
	import { fade, scale } from "svelte/transition";
    import { showAlert, formatToLocalDate, getUserLevel } from "../utils.js";
	import { getUserInformation, deleteCookies } from "../pixlandApi.js";

    let profileUsername = $state("...");
    let profileLevel = $state("...");
    let profileMessage = $state("...");
    let profileCreatedAt = $state("...");
    let profilePixelxPlaced = $state(0);

    let profile;
    let profileContainer;

    onMount(async () => {
        profileContainer.focus();
        await tick();

        const response = await getUserInformation();

        if (response.state !== "success") {
            showAlert("error", "User Info Error", "There was an issue retrieving your user information. Please try again later.");
        }
        else {
            const userInfo = response.data.info;
            const userLevel = getUserLevel(userInfo.pixels_placed);

            profileUsername = userInfo.username;
            profileLevel = userLevel.level;
            profileMessage = userLevel.message;
            profileCreatedAt = userInfo.created_at;
            profilePixelxPlaced = userInfo.pixels_placed;
        }
    });

    function closeProfile(event) {
        if (event.type === "click"){
            if (event.target !== profile && !profile.contains(event.target)) {
                ui.profileModalIsOpen = false;
            }
        }
        else if (event.type === "keydown") {
            if (event.key === "Escape") {
                ui.profileModalIsOpen = false;
            }
        }
    }

    async function logOut() {
        user.id = null;
        user.isLoggedIn = false;

        if (user.websocket) {
            user.websocket.send(JSON.stringify({
                type: "registered_to_anonymous",
                data: null,
            }));
        }

        ui.profileModalIsOpen = false;

        await deleteCookies();
    }
</script>

<div
    id="profile-container"
    onclick={(e) => {closeProfile(e);}}
    onkeydown={(e) => {closeProfile(e);}}
    role="dialog"
    tabindex="0"
    bind:this={profileContainer}
    transition:fade={{duration: 600}}
>
    <div id="profile-card" bind:this={profile} in:scale={{duration: 900}}>
        <div id="profile-header">
            <img id="profile-image" src="/profile_placeholder.png" alt="profile_photo"/>
            <h2 class="profile-text">{profileUsername}</h2>
            <p class="profile-text">{profileMessage}</p>
        </div>
        <div id="profile-stats">
            <div class="stat-container">
                <div class="stat-icon">
                    <i class="ph-fill ph-paint-brush"></i>
                </div>
                <div class="stat-value">{profileLevel}</div>
                <div class="stat-label">level</div>
            </div>
            <div class="stat-container">
                <div class="stat-icon">
                    <i class="ph-fill ph-grid-four"></i>
                </div>
                <div class="stat-value">{profilePixelxPlaced}</div>
                <div class="stat-label">pixels placed</div>
            </div>
            <div class="stat-container">
                <div class="stat-icon">
                    <i class="ph ph-calendar-dots"></i>
                </div>
                <div class="stat-value">{formatToLocalDate(profileCreatedAt)}</div>
                <div class="stat-label">created at</div>
            </div>
        </div>
        <div id="profile-actions">
            <button class="btn btn-primary" onclick={async () => {logOut();}}>
              <i class="ph-bold ph-sign-out"></i>
              sign out
            </button>
            <button class="btn btn-danger" title="Delete Account">
              <i class="ph-bold ph-trash"></i>
              delete
            </button>
        </div>
    </div>
</div>

<style>
    #profile-container {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: var(--overlay-bg);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #profile-card {
        width: 320px;
        background-color: var(--bg-elevated-2);
        border-radius: 6px;
        box-shadow: var(--shadow-colored);
        overflow: hidden;
        transition: transform 0.2s ease;
    }

    #profile-header {
        padding: 24px;
        text-align: center;
        border-bottom: 1px solid var(--border-default);
    }

    #profile-header > h2 {
        color: var(--text-primary);
    }

    #profile-header > p {
        color: var(--text-secondary);
    }

    #profile-image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--border-accent);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .profile-text {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    #profile-stats {
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-default);
    }

    .stat-container {
        display: flex;
        align-items: center;
        margin: 16px 0;
    }

    .stat-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        background-color: var(--accent-tertiary);
        border-radius: 6px;
    }

    .stat-icon i {
        font-size: 20px;
        color: var(--text-primary);
    }

    .stat-value {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--text-secondary);
    }

    .stat-label {
        color: var(--text-tertiary);
        font-size: 0.85rem;
        margin-left: auto;
    }

    #profile-actions {
        padding: 24px;
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: bold;
        height: 42px;
        overflow: hidden;
    }

    .btn-primary {
        color: var(--action-primary-text);
        background-color: var(--action-primary);
        border: 2px solid var(--border-default);
    }

    .btn-primary:hover {
        background-color: var(--action-primary-hover);
    }

    .btn-danger {
        color: var(--action-tertiary-text);
        background-color: var(--action-tertiary);
        border: 2px solid var(--border-default);
    }

    .btn-danger:hover {
        background-color: var(--action-tertiary-hover);
    }
</style>