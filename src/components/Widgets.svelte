<script>
    import ColorPalette from "../components/ColorPalette.svelte";
    import PixelQueue from "./PixelQueue.svelte";
    import Options from "../components/Options.svelte";
    import Alert from "./Alert.svelte";
    import ModalContainer from "./ModalContainer.svelte";
    import { ui, user } from "../shared.svelte.js";
	import { scale } from "svelte/transition";
    import { padWithZeros } from "$lib/utils.js";
</script>

<ColorPalette/>
<div id="current-users">
    <i class="ph-bold ph-users-three"></i>
    {padWithZeros(ui.activeUsers, 2)}
</div>
<Options/>
{#if user.isLoggedIn}
    <input
        id="button-profile"
        type="image"
        src="/profile_placeholder.png"
        alt="profile_photo"
        onclick={() => {ui.profileModalIsOpen = true;}}
        transition:scale
    />
    <PixelQueue/>
{/if}
{#if ui.loginModalIsOpen || ui.profileModalIsOpen || ui.settingsModalIsOpen}
    <ModalContainer/>
{/if}
{#if ui.alert.show}
    <Alert/>
{/if}

<style>
    #button-profile {
        position: fixed;
        top: 0.5rem;
        right: 0.5rem;
        width: 42px;
        height: 42px;
        border: 2px solid var(--border-accent);
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
        background-color: var(--overlay-bg);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        color: var(--text-primary);
        font-size: 1.5rem;
    }
</style>