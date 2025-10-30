<script>
	import { onMount, tick } from "svelte";
    import { ui } from "../shared.svelte.js";
    import { fade, scale } from "svelte/transition";
    import GenerateImage from "./modals/GenerateImage.svelte";
    import Login from "./modals/Login.svelte";
    import Profile from "./modals/Profile.svelte";
	import Settings from "./modals/Settings.svelte";

    let container;
    let containerChild;

    onMount(async () => {
        container.focus();
        await tick();
    });

    function closeModal(event) {
        function closeActiveModal() {
            if (ui.generateImageModalIsOpen) {
                ui.generateImageModalIsOpen = false;
            }
            else if (ui.loginModalIsOpen) {
                ui.loginModalIsOpen = false;
            }
            else if (ui.profileModalIsOpen) {
                ui.profileModalIsOpen = false;
            }
            else if (ui.settingsModalIsOpen) {
                ui.settingsModalIsOpen = false;
            }
        }

        if (event.type === "pointerup") {
            if (event.target !== containerChild && !containerChild.contains(event.target)) {
                event.stopPropagation();
                event.preventDefault();
                closeActiveModal();
            }
        }
        else if (event.type === "keydown" && event.key === "Escape") {
            event.stopPropagation();
            event.preventDefault();
            closeActiveModal();
        }
    }
</script>

<div
    id="modal-container"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onpointerup={(e) => {closeModal(e);}}
    onkeydown={(e) => {closeModal(e);}}
    bind:this={container}
    transition:fade={{duration: 600}}
>
    <div bind:this={containerChild} in:scale={{duration: 900}}>
        {#if ui.generateImageModalIsOpen}
            <GenerateImage/>
        {:else if ui.loginModalIsOpen}
            <Login/>
        {:else if ui.profileModalIsOpen}
            <Profile/>
        {:else if ui.settingsModalIsOpen}
            <Settings/>
        {/if}
    </div>
</div>

<style>
    #modal-container {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: var(--overlay-bg);
        display: flex;
        justify-content: center;
        align-items: center;
        touch-action: none;
    }
</style>