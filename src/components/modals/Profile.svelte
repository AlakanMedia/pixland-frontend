<script>
    import { fade } from "svelte/transition";
    import { ui, user } from "../../shared.svelte.js";
    import { showAlert, formatToLocalDate, getUserLevel, MESSAGES_TYPES, getAvailableProfileImages } from "$lib/utils.js";
	import { getUserInformation, deleteCookies, updateUserConfigurations, deleteUser } from "../../pixlandApi.js";

    let userLevel = $state(getUserLevel(user.pixelsPlaced));
    let userProfileImages = $state(getAvailableProfileImages(user.pixelsPlaced));
    let showUserImages = $state(false);
    let showConfirmDeletion = $state(false);
    let verificationText = $state("");
    let confirmButtonDisabled = $derived(verificationText !== "delete");

    function getPercentageOfLimit(limit, current) {
        return ((current / limit) * 100).toFixed(2);
    }

    async function updateUserInfo() {
        const response = await getUserInformation();

        if (response.state !== MESSAGES_TYPES.SUCCESS) {
            showAlert(MESSAGES_TYPES.ERROR, "User Info Error", "There was an issue retrieving your user information. Please try again later.");
        }
        else {
            const userInfo = response.data.info;

            user.name = userInfo.username;
            user.pixelsPlaced = userInfo.pixels_placed;
            userLevel = getUserLevel(user.pixelsPlaced);
        }
    }

    async function logOut() {
        await deleteCookies();

        user.id = null;
        user.name = null;
        user.pixelsPlaced = null;
        user.createdAt = null;
        user.profileImage = null;
        user.isLoggedIn = false;
        user.disconnect = true;

        ui.profileModalIsOpen = false;
    }

    async function changeUserImage(event, imagePath) {
        event.stopPropagation();
        const response = await updateUserConfigurations({ profile_image: imagePath });

        if (response.state === MESSAGES_TYPES.SUCCESS) {
            user.profileImage = imagePath;
        }
        else {
            showAlert(MESSAGES_TYPES.ERROR, "Profile Picture Update Failed", "An error occurred while updating your profile picture. Please try again.");    
        }

        showUserImages = false;
    }

    async function handleDeleteUser() {
        const response = await deleteUser(user.id);

        if (response.state === MESSAGES_TYPES.SUCCESS) {
            showAlert(MESSAGES_TYPES.SUCCESS, "User Deleted Successfully", "The user has been removed from the system without issues.");    
            await logOut();
        }
        else {
            showAlert(MESSAGES_TYPES.ERROR, "Error Deleting User", "There was a problem while trying to remove the user. Please try again.");    
        }
    }
</script>

<div id="profile-card">
    {#if showUserImages}
        <div id="select-image-container" transition:fade>
            <div id="container-header">
                <div class="header-icon-text">
                    <i class="ph ph-user-circle"></i>
                    <h4>change image</h4>
                </div>
                <button
                    aria-label="Close image window"
                    onclick={(e) => {
                        e.stopPropagation();
                        showUserImages = false;
                    }}
                >
                    <i class="ph-bold ph-x"></i>
                </button>
            </div>
            <hr>
            <div id="select-image-gallery">
                {#each userProfileImages as image}
                    <button 
                        class="profile-image-selection"
                        disabled={!image.unlocked}
                        onclick={async (e) => {changeUserImage(e, image.src);}}
                    >
                        <img src={image.src} alt={`Profile picture of ${image.levelName}`}/>
                    </button> 
                {/each}
            </div>
        </div>
    {/if}
    <div id="profile-header">
        <button
            class="profile-button"
            aria-label="Update user information"
            onclick={async () => {await updateUserInfo();}}
        >
            <img
                src={user.profileImage}
                alt="Update user information"
            />
            <div
                id="image-button"
                role="button"
                tabindex="0"
                aria-label="Change profile image"
                onclick={(e) => {
                    e.stopPropagation();
                    showUserImages = !showUserImages;
                }}
                onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        showUserImages = !showUserImages;
                    }
                }}
            >
                <i class="ph-bold ph-pencil-simple"></i>
            </div>
        </button>
        <h2 class="profile-text">{user.name}</h2>
        <p class="profile-text">{userLevel.message}</p>
    </div>
    <div id="progress-container">
        <div class="progress-info">
            <span>progress toward the next level</span>
            <span id="progress-percentage">{getPercentageOfLimit(userLevel.pixelsToNextLevel, user.pixelsPlaced)}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style={`width: ${getPercentageOfLimit(userLevel.pixelsToNextLevel, user.pixelsPlaced)}%;`}></div>
        </div>
    </div>
    <hr>
    <div id="profile-stats">
        <div class="stat-container">
            <div class="stat-icon">
                <i class="ph-fill ph-paint-brush"></i>
            </div>
            <div class="stat-value">{userLevel.level}</div>
            <div class="stat-label">level</div>
        </div>
        <div class="stat-container">
            <div class="stat-icon">
                <i class="ph-fill ph-grid-four"></i>
            </div>
            <div class="stat-value">{user.pixelsPlaced}</div>
            <div class="stat-label">pixels placed</div>
        </div>
        <div class="stat-container">
            <div class="stat-icon">
                <i class="ph ph-calendar-dots"></i>
            </div>
            <div class="stat-value">{formatToLocalDate(user.createdAt)}</div>
            <div class="stat-label">created at</div>
        </div>
    </div>
    <hr>
    <div id="profile-actions">
        <button
            class="btn btn-primary"
            title="Sign Out"
            onclick={async () => {await logOut();}}
        >
            <i class="ph-bold ph-sign-out"></i>
            sign out
        </button>
        <button
            class="btn btn-danger"
            title="Delete Account"
            onclick={() => {showConfirmDeletion = true;}}
        >
            <i class="ph-bold ph-trash"></i>
            delete
        </button>
    </div>
    {#if showConfirmDeletion}
        <div id="verification-container">
            <p class="verification-prompt">Type "delete" to confirm:</p>
            <input
                class="verification-input"
                type="text"
                placeholder="delete"
                bind:value={verificationText}
            />
            <div id="verification-buttons">
                <button
                    class="mini-button confirm-mini"
                    disabled={confirmButtonDisabled}
                    onclick={async () => {await handleDeleteUser();}}
                >
                    confirm
                </button>
                <button
                    class="mini-button cancel-mini"
                    onclick={() => {
                        showConfirmDeletion = false;
                        verificationText = "";
                    }}
                >
                    cancel
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    hr {
        width: 100%;
        border: 1px solid var(--border-subtle);
    }

    #profile-card {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 12px;
        background-color: var(--bg-elevated-1);
        border: 1px solid var(--border-default);
        border-radius: 6px;
        box-shadow: var(--shadow-colored);
        gap: 12px;
        width: 302px;
    }

    #select-image-container {
        position: absolute;
        top: 122px;
        width: calc(100% - 24px);
        background-color: var(--bg-elevated-1);
        border: 1px solid var(--border-default);
        border-radius: 6px;
        padding: 0.5rem;
        z-index: 2;
    }

    #select-image-container > hr {
        margin: 0.5rem 0;
    }

    #container-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
    }

    #container-header > button {
        border: none;
        border-radius: 50%;
        padding: 0.25rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--action-ghost);
        color: var(--text-primary);
        transition: background-color 0.3s ease;
    }

    #container-header > button:hover {
        background-color: var(--action-tertiary-hover);
    }

    .header-icon-text {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-primary);
    }

    .header-icon-text > i {
        font-size: 1.5rem;
        color: var(--accent-secondary);
    }

    #select-image-gallery {
        display: grid;
        grid-auto-flow: column; 
        grid-auto-columns: 54px; 
        grid-template-rows: repeat(3, 54px);
        gap: 0.5rem; 
        overflow-x: auto;
        overflow-y: hidden;
    }

    .profile-image-selection {
        border: none;
        background: none;
    }

    .profile-image-selection:disabled {
        cursor: not-allowed;
    }

    .profile-image-selection > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        image-rendering: pixelated;
        background-color: var(--gray-400);
        border-radius: 0.25rem;
    }

    .profile-image-selection:disabled > img {
        filter: grayscale(100%);
    }

    #profile-header {
        padding: 0 8px;
        text-align: center;
    }

    #profile-header > h2 {
        color: var(--text-primary);
    }

    #profile-header > p {
        color: var(--text-secondary);
    }

    .profile-button {
        background: none;
        border: none;
        padding: 0;
        border-radius: 50%;
        position: relative;
    }

    .profile-button img {
        display: block; /* Para evitar espacios extra debajo de la imagen */
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--border-accent);
        image-rendering: pixelated;
        background-color: var(--gray-400);
        transition: transform 0.1s ease;
    }

    .profile-button:active img {
        transform: scale(0.95);
    }

    #image-button {
        position: absolute;
        border-radius: 50%;
        background-color: var(--action-tertiary);
        color: var(--action-tertiary-text);
        bottom: 0px;
        right: 0px;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
    }

    #image-button:hover {
        background-color: var(--action-tertiary-hover);
    }

    #image-button > i {
        font-size: 1.25rem;
    }

    .profile-text {
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 6px;
    }

    #profile-stats {
        padding: 0px 8px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .stat-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .stat-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--accent-tertiary);
        border-radius: 6px;
    }

    .stat-icon i {
        font-size: 20px;
        color: var(--text-primary);
    }

    .stat-value {
        font-weight: 700;
        font-size: 1rem;
        color: var(--text-secondary);
    }

    .stat-label {
        color: var(--text-tertiary);
        font-size: 0.75rem;
        margin-left: auto;
    }

    #profile-actions {
        width: 100%;
        padding: 0 8px;
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: bold;
        height: 42px;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .btn-primary {
        color: var(--action-primary-text);
        background-color: var(--action-primary);
    }

    .btn-primary:hover {
        background-color: var(--action-primary-hover);
        box-shadow: var(--shadow-md);
    }

    .btn-danger {
        color: var(--action-primary-text);
        background-color: var(--error-500);
    }

    .btn-danger:hover {
        background-color: var(--error-600);
        box-shadow: var(--shadow-md);
    }

    #progress-container {
        width: 100%;
        padding: 0 8px;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .progress-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: var(--text-tertiary);
    }

    .progress-bar {
        height: 10px;
        background-color: var(--bg-base);
        border-radius: 4px;
        border: 1px solid var(--border-prominent);
        overflow: hidden;
    }

    .progress-fill {
        position: relative;
        height: 100%;
        background-color: var(--action-secondary);
        border-radius: 4px;
        transition: width 0.5s ease;
        overflow: hidden;
    }

    .progress-fill::before {
        content: "";
        position: absolute;
        top: 0;
        left: -50%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: shimmer 4s infinite;
    }

    @keyframes shimmer {
        0% { transform: translateX(0); }
        100% { transform: translateX(300%); }
    }

    #verification-container {
        width: 100%;
        padding: 0 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .verification-prompt {
        width: 100%;
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .verification-input {
        width: 100%;
        padding: 8px 10px;
        background-color: var(--input-bg);
        border: 1px solid var(--input-border);
        border-radius: 4px;
        color: var(--input-text);
        font-size: 1rem;
        transition: border-color 0.2s ease;
    }

    .verification-input:focus {
        outline: none;
        border-color: var(--input-border-focus);
    }

    .verification-input::placeholder {
        color: var(--input-placeholder);
    }

    #verification-buttons {
        width: 100%;
    }

    .mini-button {
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }

    .confirm-mini {
        background-color: var(--state-error);
        color: white;
    }

    .confirm-mini:hover:not(:disabled) {
        background-color: var(--error-600);
    }

    .confirm-mini:disabled {
        background-color: var(--action-primary-disabled);
        cursor: not-allowed;
        opacity: 0.6;
    }

    .cancel-mini {
        background-color: transparent;
        color: var(--text-tertiary);
        border: 1px solid var(--border-default);
    }

    .cancel-mini:hover {
        background-color: var(--action-ghost-hover);
        color: var(--text-secondary);
    }
</style>