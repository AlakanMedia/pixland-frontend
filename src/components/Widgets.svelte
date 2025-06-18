<script>
    import ColorPalette from "../components/ColorPalette.svelte";
    import Options from "../components/Options.svelte";
    import Login from "./Login.svelte";
    import Alert from "./Alert.svelte";
    import { modals, alertCard, user, appInfo } from "../shared.svelte.js";
	import { scale } from "svelte/transition";
	import Profile from "./Profile.svelte";
</script>

<ColorPalette/>
<div id="current-users">
    <i class="ph ph-bold ph-users-three"></i>
    {appInfo.activeUsers}
</div>
<Options/>
{#if modals.loginIsOpen}
    <Login/>
{/if}
{#if user.logged}
    <input
        id="button-profile"
        type="image"
        src="/profile_placeholder.png"
        alt="profile_photo"
        onclick={() => {modals.profileIsOpen = true;}}
        transition:scale
    />
{/if}
{#if modals.profileIsOpen}
    <Profile/> 
{/if}
{#if alertCard.show}
    <Alert/>
{/if}

<style>
    #button-profile {
        position: fixed;
        top: 0.5rem;
        right: 0.5rem;
        width: 42px;
        height: 42px;
        border: 2px solid black;
        border-radius: 50%;
        transition: transform 0.1s ease;
    }

    #button-profile:active {
        transform: scale(0.96);
    }

    #current-users {
        position: fixed;
        bottom: 0.5rem;
        left: 0.5rem;
        height: 42px;
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 6px 12px;
        color: white;
        font-size: 1.5rem;
    }
</style>