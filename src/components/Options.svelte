<script>
	import { goto } from "$app/navigation";
    import { ui, user } from "../shared.svelte.js";

    let optionIsOpen = $state(false);
</script>

<button
    id="dots-button"
    aria-label="Options"
    onclick={(e) => {
        e.stopPropagation();
        optionIsOpen = !optionIsOpen;
    }}
>
    <i class="ph-fill ph-dots-three-outline" style="color: white"></i>
</button>
{#if optionIsOpen}
    <div id="options-menu">
        {#if user.isLoggedIn}
            <button
                class="option-button"
                onclick={(e) => {
                    e.stopPropagation();
                    ui.generateImageModalIsOpen = true;
                    optionIsOpen = false;
                }}
            >
                <i class="ph-bold ph-image"></i>
                <p>generate</p>
            </button> 
            <button
                class="option-button"
                onclick={(e) => {
                    e.stopPropagation();
                    ui.palettesModalIsOpen = true;
                    optionIsOpen = false;
                }}
            >
                <i class="ph-bold ph-palette"></i>
                <p>palettes</p>
            </button> 
        {:else}
            <button
                class="option-button"
                onclick={(e) => {
                    e.stopPropagation();
                    ui.loginModalIsOpen = true;
                    optionIsOpen = false;
                }}
            >
                <i class="ph-bold ph-user"></i>
                <p>login</p>
            </button> 
        {/if}
        <button
            class="option-button"
            onclick={(e) => {
                e.stopPropagation();
                ui.settingsModalIsOpen = true;
                optionIsOpen = false;
            }}
        >
            <i class="ph-bold ph-gear"></i>
            <p>settings</p>
        </button> 
        <button class="option-button" onclick={() => {goto("/editor");}}>
            <i class="ph-bold ph-file-text"></i>
            <p>editor</p>
        </button> 
        <button class="option-button" onclick={() => {goto("/legals");}}>
            <i class="ph-bold ph-gavel"></i>
            <p>legals</p>
        </button> 
        <button class="option-button" onclick={() => {goto("/about");}}>
            <i class="ph-bold ph-info"></i>
            <p>about</p>
        </button> 
    </div>
{/if}

<style>
    #dots-button {
        position: fixed;
        top: 0.5rem;
        left: 0.5rem;
        width: 42px;
        height: 42px;
        border: none;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--overlay-bg);
        font-size: 1.5rem;
        transition: transform 0.1s ease;
    }

    #dots-button:active {
        transform: scale(0.96);
    }

    #options-menu {
        position: fixed;
        top: calc(42px + 1rem);
        left: 0.5rem;
        background-color: var(--overlay-bg);
        border-radius: 12px;
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .option-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.25rem;
        padding: 8px 12px;
        background-color: var(--action-primary);
        color: var(--action-primary-text);
        border: none;
        border-radius: 6px;
        transition: background-color 0.3s ease;
    }

    .option-button:hover {
        background-color: var(--action-primary-hover);
    }

    .option-button > p {
        font-size: 1rem;
        font-weight: bold;
    }
</style>