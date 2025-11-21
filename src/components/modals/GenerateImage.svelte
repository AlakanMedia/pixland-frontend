<script>
    import { generateImage, getImageStatus } from "../../pixlandApi.js";
    import { MESSAGES_TYPES, showAlert, callWithProgress } from "$lib/utils.js";
    import { drawingState } from "../../shared.svelte.js";

    let topLeftX = $state(0);
    let topLeftY = $state(0);
    let downRightX = $state(100);
    let downRightY = $state(100);

    let isLoading = $state(false);
    let imageWasGenerated = $state(false);

    let imageUrl = $state(null);
    let imageName = $state(null);

    async function handleImageGeneration() {
        if (topLeftX >= downRightX || topLeftY >= downRightY) {
            showAlert(MESSAGES_TYPES.ERROR, "Invalid Coordinates", "Please check your input, the coordinates you entered are not valid.");
            return;
        }

        imageWasGenerated = false;
        isLoading = true;

        const response = await generateImage(drawingState.palette, [topLeftX, topLeftY], [downRightX, downRightY]);

        if (response.state !== MESSAGES_TYPES.SUCCESS) {
            showAlert(MESSAGES_TYPES.ERROR, "Image Request Failed", "We couldn't process your request. Please check your input and try again.");
            isLoading = false;
            return;
        }

        const taskId = response.data.info.task_id;
        const result = await callWithProgress(getImageStatus, [taskId], 4);
        
        if (!result) {
            showAlert(MESSAGES_TYPES.ERROR, "Image Generation Error", "Something went wrong while creating the image. Please try again later.");
            isLoading = false;
            return;
        }

        imageWasGenerated = true;
        isLoading = false;

        imageUrl = result.result.download_url;
        imageName = result.task_id
    }
</script>

<div id="generate-image">
    <div class="input-section">
        <div class="coord-header">
            <i class="ph-bold ph-arrow-square-up-left"></i>
            <h3>up left</h3>
        </div>
        <div class="input-row">
            <div class="input-group">
                <label class="input-label" for="top-left-x">x:</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    id="top-left-x"
                    class={["input-field", topLeftX >= downRightX ? "error" : ""]}
                    placeholder="0"
                    bind:value={topLeftX}
                >
            </div>
            <div class="input-group">
                <label class="input-label" for="top-left-y">y:</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    id="top-left-y"
                    class={["input-field", topLeftY >= downRightY ? "error" : ""]}
                    placeholder="0"
                    bind:value={topLeftY}
                >
            </div>
        </div>
    </div>
    <div class="input-section">
        <div class="coord-header">
            <i class="ph-bold ph-arrow-square-down-right"></i>
            <h3>down right</h3>
        </div>
        <div class="input-row">
            <div class="input-group">
                <label class="input-label" for="down-right-x">x:</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    id="down-right-x"
                    class="input-field"
                    placeholder="100"
                    bind:value={downRightX}
                >
            </div>
            <div class="input-group">
                <label class="input-label" for="down-right-y">y:</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    id="down-right-y"
                    class="input-field"
                    placeholder="100"
                    bind:value={downRightY}
                >
            </div>
        </div>
    </div>
    <hr>
    <div id="buttons-section">
        <button
            id="generate-button"
            disabled={isLoading}
            onclick={async () => {handleImageGeneration();}}
        >
            {#if isLoading}
                <span class="loader"></span>
            {:else}
                <i class="ph-bold ph-dna"></i>
                <p>generate</p>
            {/if}
        </button>
        {#if imageWasGenerated}
            <a
                id="download-button"
                href={imageUrl}
                download={`${imageName}.png`}
            >
                <i class="ph-bold ph-download-simple"></i>
                <p>download</p>
            </a>
        {/if}
    </div>
</div>

<style>
    hr {
        width: 100%;
        border: 1px solid var(--border-subtle);
    }

    #generate-image {
        background-color: var(--bg-elevated-1);
        box-shadow: var(--shadow-colored);
        border: 1px solid var(--border-default);
        border-radius: 6px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        color: var(--text-primary);
    }

    .input-section {
        padding: 0 8px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    #buttons-section {
        padding: 0 8px;
        display: flex;
        gap: 12px;
    }

    #buttons-section > button {
        flex: 1;
    }

    .coord-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .coord-header > i {
        color: var(--accent-secondary);
        font-size: 1.5rem;
    }

    .input-row {
        display: flex;
        gap: 1rem;
    }

    .input-field {
        max-width: 100px;
        width: 100%;
        background-color: var(--input-bg);
        border: 1px solid var(--input-border);
        border-radius: 6px;
        padding: 0.75rem;
        color: var(--input-text);
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .input-field:focus {
        outline: none;
        border-color: var(--input-border-focus);
    }

    .input-field::placeholder {
        color: var(--input-placeholder);
    }

    #generate-button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        height: 42px;
        padding: 8px 12px;
        border-radius: 6px;
        border: none;
        color: var(--action-primary-text);
        background-color: var(--action-primary);
        transition: all 0.3s ease;
        font-size: 1rem;
    }

    #generate-button:hover {
        background-color: var(--action-primary-hover);
        box-shadow: var(--shadow-md);
    }

    #generate-button:disabled {
        cursor: default;
        background-color: var(--action-primary-disabled);
    }

    #download-button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        height: 42px;
        padding: 8px 12px;
        border-radius: 6px;
        border: none;
        color: var(--action-secondary-text);
        background-color: var(--action-secondary);
        transition: all 0.3s ease;
        font-size: 1rem;
        text-decoration: none;
    }

    #download-button:hover {
        background-color: var(--action-secondary-hover);
        box-shadow: var(--shadow-md);
    }

    .error {
        border-color: var(--state-error-border) !important;
    }
</style>