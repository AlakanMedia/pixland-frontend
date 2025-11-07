<script>
    import ColorPalette from "../components/ColorPalette.svelte";
    import PixelQueue from "./PixelQueue.svelte";
    import Options from "../components/Options.svelte";
    import Alert from "./Alert.svelte";
    import ModalContainer from "./ModalContainer.svelte";
    import { ui, user, mousePosition, canvasInfo } from "../shared.svelte.js";
	import { scale } from "svelte/transition";
    import { padWithZeros, getEffectiveCellSize } from "$lib/utils.js";

    let effectiveCellSize = $derived(getEffectiveCellSize());
    let xCellMouse = $derived(Math.floor((canvasInfo.cameraOffsetX + mousePosition.coords.current.x) / effectiveCellSize));
    let yCellMouse = $derived(Math.floor((canvasInfo.cameraOffsetY + mousePosition.coords.current.y) / effectiveCellSize));
</script>

<ColorPalette/>
<div id="info-widgets">
    <div id="current-users">
        <i class="ph-bold ph-users-three"></i>
        {padWithZeros(ui.activeUsers, 2)}
    </div>
    <div id="mouse-position">
        <p>x: {padWithZeros(xCellMouse, 4)}</p>
        <p>y: {padWithZeros(yCellMouse, 4)}</p>
    </div>
</div>
<Options/>
{#if user.isLoggedIn}
    <input
        id="button-profile"
        type="image"
        src={user.profileImage}
        alt="profile_photo"
        onclick={() => {ui.profileModalIsOpen = true;}}
        transition:scale
    />
    <PixelQueue/>
{/if}
{#if ui.generateImageModalIsOpen || ui.loginModalIsOpen || ui.profileModalIsOpen || ui.settingsModalIsOpen}
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
        image-rendering: pixelated;
        background-color: var(--gray-400);
        transition: transform 0.1s ease;
    }

    #button-profile:active {
        transform: scale(0.96);
    }

    #info-widgets {
        position: fixed;
        bottom: 0.5rem;
        left: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0.5rem;
    }

    #current-users {
        height: 42px;
        border-radius: 6px;
        background-color: var(--overlay-bg);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        color: var(--text-primary);
        font-size: 1.25rem;
    }

    #current-users > i {
        font-size: 1.5rem;
    }

    #mouse-position {
        border-radius: 6px;
        background-color: var(--overlay-bg);
        padding: 0.5rem;
        color: var(--text-primary);
        font-size: 1.25rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>