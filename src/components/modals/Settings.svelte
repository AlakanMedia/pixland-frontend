<script>
    import { ui, drawingState, user } from "../../shared.svelte.js";
	import { getPalette, updateUserConfigurations } from "../../pixlandApi.js";
    import { changeColorSchema, showAlert } from "../../utils.js";

    let palette = $state(drawingState.palette);
    let showGrid = $state(drawingState.showGrid);
    let PALETTES = $state(["default", "reversed"]);

    async function saveConfiguration() {
        if (user.isLoggedIn) {
            if (showGrid !== drawingState.showGrid || palette !== drawingState.palette) {
                let response = await updateUserConfigurations({
                    settings: {
                        show_grid: showGrid,
                        palette: palette,
                    }
                });

                if (response.state !== "success") {
                    showAlert("error", "Error Updating Settings", "An unexpected error occurred while saving your changes. Please try again later.");
                    return;
                }

                if (palette !== drawingState.palette) {
                    response = await getPalette(palette);

                    if (response.state !== "success") {
                        showAlert("error", "Error Updating Color Palette", "An unexpected error occurred while trying to update the color palette. Please try again later.");
                        return;
                    }

                    changeColorSchema(response.data.info.colors);
                }

                drawingState.showGrid = showGrid;
                drawingState.palette = palette;
                drawingState.needsUpdate = true;
            }
        }
        else {
            if (showGrid !== drawingState.showGrid) {
                drawingState.showGrid = showGrid;
                drawingState.needsUpdate = true;
            }
        }

        ui.settingsModalIsOpen = false;
    }
</script>

<div id="settings">
    <div id="settings-header" class="settings-icon-text">
        <i class="ph ph-gear-six"></i>
        <h2>Settings</h2>
    </div>
    <hr>
    <div id="settings-options">
        <div class="display-option">
            <div class="settings-icon-text">
                <i class="ph ph-ruler"></i>
                <h4>show grid</h4>
            </div>
            <label class="switch">
                <input type="checkbox" bind:checked={showGrid}>
                <span class="slider"></span>
            </label>
        </div>

        {#if user.isLoggedIn}
            <div class="display-option">
                <div class="settings-icon-text">
                    <i class="ph ph-palette"></i>
                    <h4>change palette</h4>
                </div>
             <select bind:value={palette}>
              	{#each PALETTES as plt}
              		<option value={plt}>
              			{plt}
              		</option>
                 {/each}
             </select>
            </div>
        {/if}
    </div>
    <hr>
    <div id="settings-buttons">
        <button id="restore-button" onclick={async () => {await saveConfiguration();}}>
            <i class="ph ph-clock-counter-clockwise"></i>
            <p>restore</p>
        </button>
        <button id="save-button" onclick={async () => {await saveConfiguration();}}>
            <i class="ph ph-floppy-disk"></i>
            <p>save</p>
        </button>
    </div>
</div>

<style>
    #settings {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: var(--bg-elevated-1);
        box-shadow: var(--shadow-colored);
        border: 1px solid var(--border-default);
        border-radius: 6px;
        width: 260px;
        padding: 12px;
        color: var(--text-primary);
        gap: 12px;
    }

    #settings > hr {
        width: 100%;
        border: 1px solid var(--border-subtle);
    }

    #settings-header i {
        font-size: 2rem;
        color: var(--accent-primary);
    }

    .settings-icon-text {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    #settings-options {
        padding: 0 8px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    #settings-options i {
        font-size: 1.5rem;
        color: var(--accent-secondary);
    }

    .display-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #settings-buttons {
        width: 100%;
        padding: 0 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
    }

    #settings-buttons > button {
        border: none;
        border-radius: 6px;
        padding: 8px 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    #settings-buttons > button > i{
        font-size: 1.5rem;
    }

    #save-button {
        background-color: var(--action-primary);
        color: var(--action-primary-text);
    }

    #save-button:hover {
        background-color: var(--action-primary-hover);
        box-shadow: var(--shadow-md);
    }

    #restore-button {
        background-color: var(--action-secondary);
        color: var(--action-secondary-text);
    }

    #restore-button:hover {
        background-color: var(--action-secondary-hover);
        box-shadow: var(--shadow-md);
    }

    /* ========== Switch Button - From Uiverse.io by namecho ========== */
    .switch {
        --button-width: 2.5em;
        --button-height: 1.5em;
        --toggle-diameter: 1em;
        --button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
        --toggle-shadow-offset: 10px;
        --toggle-wider: 3em;
        --color-grey: var(--action-primary-disabled);
        --color-green: var(--action-primary-active);
    }

    .slider {
        cursor: pointer;
        display: inline-block;
        width: var(--button-width);
        height: var(--button-height);
        background-color: var(--color-grey);
        border-radius: calc(var(--button-height) / 2);
        position: relative;
        transition: 0.3s all ease-in-out;
    }

    .slider::after {
        content: "";
        display: inline-block;
        width: var(--toggle-diameter);
        height: var(--toggle-diameter);
        background-color: var(--text-primary);
        border-radius: calc(var(--toggle-diameter) / 2);
        position: absolute;
        top: var(--button-toggle-offset);
        transform: translateX(var(--button-toggle-offset));
        box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
        transition: 0.3s all ease-in-out;
    }

    .switch input[type="checkbox"]:checked + .slider {
        background-color: var(--color-green);
    }

    .switch input[type="checkbox"]:checked + .slider::after {
        transform: translateX(calc(var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset)));
        box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
    }

    .switch input[type="checkbox"] {
        display: none;
    }

    .switch input[type="checkbox"]:active + .slider::after {
        width: var(--toggle-wider);
    }

    .switch input[type="checkbox"]:checked:active + .slider::after {
        transform: translateX(calc(var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset)));
    }
    /* ========== End Switch Button ========== */
</style>