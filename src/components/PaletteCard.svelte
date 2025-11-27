<script>
    import { deletePalette, updateUserConfigurations } from "../pixlandApi.js";
    import { MESSAGES_TYPES, showAlert, changeColorSchema } from "$lib/utils.js";
    import { drawingState } from "../shared.svelte.js";

    let {
        paletteId,
        creatorName,
        paletteName,
        numLikes,
        paletteColors,
        paletteType,
        onDelete
    } = $props();

    async function handleDeletePalette() {
        const response = await deletePalette(paletteId);

        if (response.state === MESSAGES_TYPES.SUCCESS) {
            showAlert(MESSAGES_TYPES.SUCCESS, "Color Palette Deleted", "Your color palette has been successfully removed.");    
            onDelete(paletteId);
        }
        else {
            showAlert(MESSAGES_TYPES.ERROR, "Failed to Delete Color Palette", "omething went wrong while trying to delete your color palette. Please try again.");    
        }
    }

    async function handleChangePalette() {
        const userResponse = await updateUserConfigurations({
            settings: { palette: paletteId }
        });

        if (userResponse.state !== MESSAGES_TYPES.SUCCESS) {
            showAlert(MESSAGES_TYPES.ERROR, "Error Updating Settings", "An unexpected error occurred while saving your changes. Please try again later.");
            return;
        }

        changeColorSchema(paletteColors);

        drawingState.name = paletteName;
        drawingState.palette = paletteId;
        drawingState.needsUpdate = true;
    }
</script>

<div class="palette-card">
    <div class="color-grid">
        {#each Object.entries(paletteColors) as [key, color] (key)}
            <button
                class="color-box"
                style="background-color: {color};"
                aria-label={color}
                data-color={color.toUpperCase()}
            >
            </button>
        {/each}
    </div>

    <div class="card-content">
        <div class="card-header">
            <div class="author-info">
                <div class="author-top-row">
                    <div class="author-name">{paletteType === "default" ? "Pixland" : creatorName}</div>
                </div>
                <div class="palette-name">{paletteName}</div>
            </div>
            <div class="palette-actions">
                <div class="like-count" aria-live="polite" aria-atomic="true" title="Number of likes">
                    <i class="ph-fill ph-heart" aria-hidden="true"></i>
                    <span>{paletteType === "default" ? "∞" : numLikes}</span>
                </div>
                <div class="action-buttons">
                    {#if paletteType === "mine"}
                        <button
                            class="btn-icon btn-danger"
                            aria-label="Delete palette"
                            onclick={async (e) => {
                                e.stopPropagation();
                                await handleDeletePalette();
                            }}
                        >
                            <i class="ph ph-trash"></i>
                        </button>
                    {:else}
                        <button class="btn-icon btn-like" aria-label="Like">
                            <i class="ph ph-hand-heart"></i>
                        </button>
                    {/if}
                    <button
                        class="btn-icon btn-apply"
                        aria-label="Select palette"
                        onclick={async (e) => { await handleChangePalette(); }}
                        disabled={paletteId === drawingState.palette}
                    >
                        <i class="ph ph-palette"></i>
                    </button>
                    <button class="btn-icon btn-details" aria-label="View details">
                        <i class="ph ph-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .palette-card {
        background: white;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        max-width: 260px;
        height: fit-content;
        border-radius: 14px;
    }

    .color-grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(2, 1fr);
        padding: 10px;
        background: #f8f9fa;
    }

    .color-box {
        width: 30px;
        height: 30px;
        border: none;
        cursor: pointer;
        transition: transform 0.2s ease;
        position: relative;
    }
    .color-box:hover {
        transform: scale(1.10);
        z-index: 10;
    }
    .color-box:hover::after {
        content: attr(data-color);
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 11px;
        white-space: nowrap;
        z-index: 100;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .card-content {
        padding: 10px;
    }
    .card-header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 8px;
      }

    .author-info {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .author-top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
    }
    .author-name {
        font-weight: 600;
        font-size: 16px;
        color: #2d3748;
    }
    .palette-name {
        font-size: 13px;
        color: #718096;
    }

    /* Like count integrado como “píldora” */
    .like-count {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #4a5568;
        font-weight: 600;
        background: #fff5f5;
        border: 1px solid #fed7d7;
        padding: 4px 10px;
        border-radius: 20px;
    }
    .like-count i {
        font-size: 16px;
        color: #ff6b6b;
    }

    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 8px;
    }
    .btn-icon {
        width: 30px;
        height: 30px;
        border: 2px solid #e2e8f0;
        background: white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-size: 20px;
        color: #4a5568;
    }
    .btn-icon:hover {
        transform: scale(1.1);
        border-color: #cbd5e0;
    }

    .btn-apply:hover,
    .btn-apply:disabled {
        border-color: var(--orange-500);
        color: var(--orange-500);
    }

    .btn-like:hover {
        border-color: var(--emerald-500);
        color: var(--emerald-500);
    }

    .btn-details:hover {
        border-color: var(--info-500);
        color: var(--info-500);
    }

    .btn-danger:hover {
        border-color: var(--error-500);
        color: var(--error-500);
    }

    .btn-icon i {
        transition: all 0.3s ease;
    }

    .palette-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    @keyframes heartBeat {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.4); }
        50% { transform: scale(1.1); }
    }
</style>