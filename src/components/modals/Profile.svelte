<script>
    import { ui, user } from "../../shared.svelte.js";
    import { showAlert, formatToLocalDate, getUserLevel, MESSAGES_TYPES } from "$lib/utils.js";
	import { getUserInformation, deleteCookies } from "../../pixlandApi.js";

    let userLevel = $state(getUserLevel(user.pixelsPlaced));

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
        user.id = null;
        user.name = null;
        user.pixelsPlaced = null;
        user.createdAt = null;
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

<div id="profile-card">
    <div id="profile-header">
        <button
            class="profile-button"
            aria-label="Update user information"
            onclick={async () => {updateUserInfo();}}
        >
            <img
                id="profile-image"
                src="/profile_placeholder.png"
                alt="Update user information"
            />
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

<style>
    hr {
        width: 100%;
        border: 1px solid var(--border-subtle);
    }

    #profile-card {
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
        cursor: pointer;
        border-radius: 50%;
    }

    .profile-button img {
        display: block; /* Para evitar espacios extra debajo de la imagen */
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--border-accent);
        transition: transform 0.1s ease;
    }

    .profile-button:active img {
        transform: scale(0.95);
    }

    .profile-text {
        overflow: hidden;
        text-overflow: ellipsis;
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
        font-size: 0.85rem;
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
</style>