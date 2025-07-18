<script>
	import { onMount, tick } from "svelte";
    import { modals, user } from "../shared.svelte.js";
	import { fade, scale } from "svelte/transition";
    import { showAlert, formatToLocalDate } from "../utils.js";
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
                modals.profileIsOpen = false;
            }
        }
        else if (event.type === "keydown") {
            if (event.key === "Escape") {
                modals.profileIsOpen = false;
            }
        }
    }

    async function logOut() {
        user.id = "";
        user.logged = false;

        if (user.websocket) {
            user.websocket.send(JSON.stringify({
                type: "registered_to_anonymous",
                data: null,
            }));
        }

        modals.profileIsOpen = false;

        await deleteCookies();
    }

    function getUserLevel(pixelsPlaced) {
        if (pixelsPlaced >= 0 && pixelsPlaced <= 1000) {
            return {level: "Pixel Peasant", message: "You've placed your first humble dot."};
        }
        else if (pixelsPlaced > 1000 && pixelsPlaced <= 4000) {
            return {level: "Color Dabbler", message: "Starting to make a mess — in style."};
        }
        else if (pixelsPlaced > 4000 && pixelsPlaced <= 10000) {
            return {level: "Dot Dropper", message: "You're making tiny waves in the canvas ocean."};
        }
        else if (pixelsPlaced > 10000 && pixelsPlaced <= 15000) {
            return {level: "Hue Hustler", message: "You've got an eye for color and no shame in clicking."};
        }
        else if (pixelsPlaced > 15000 && pixelsPlaced <= 25000) {
            return {level: "Shade Slinger", message: "Flipping palettes like a cowboy flips coins."};
        }
        else if (pixelsPlaced > 25000 && pixelsPlaced <= 50000) {
            return {level: "Grid Graffiti", message: "Who needs permission to paint?"};
        }
        else if (pixelsPlaced > 50000 && pixelsPlaced <= 75000) {
            return {level: "Palette Pioneer", message: "Blazing trails through pixels unknown."};
        }
        else if (pixelsPlaced > 75000 && pixelsPlaced <= 100000) {
            return {level: "Canvas Commander", message: "You don't paint pixels — you order them around."};
        }
        else if (pixelsPlaced > 100000 && pixelsPlaced <= 150000) {
            return {level: "Bitmaster", message: "The binary bows to your will."};
        }
        else if (pixelsPlaced > 150000 && pixelsPlaced <= 200000) {
            return {level: "Pixel Picasso", message: "Your mess is starting to look like art."};
        }
        else if (pixelsPlaced > 200000 && pixelsPlaced <= 300000) {
            return {level: "Color Overlord", message: "You control more shades than the sunset."};
        }
        else if (pixelsPlaced > 300000 && pixelsPlaced <= 500000) {
            return {level: "The Dithering Duke", message: "Smoothing edges like a royal."};
        }
        else if (pixelsPlaced > 500000 && pixelsPlaced <= 750000) {
            return {level: "Hue Sorcerer", message: "Summoning colors with a click and a curse."};
        }
        else if (pixelsPlaced > 750000 && pixelsPlaced <= 1000000) {
            return {level: "Render Ruler", message: "The canvas is your kingdom. The cursor is your crown."};
        }
        else if (pixelsPlaced > 1000000 && pixelsPlaced <= 2000000) {
            return {level: "Pixel Prophet", message: "You see the final image before it even exists."};
        }
        else if (pixelsPlaced > 2000000) {
            return {level: "The Glitch God", message: "Reality bends at the power of your pixels."};
        }
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