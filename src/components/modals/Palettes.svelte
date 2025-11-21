<script>
    import { onMount } from "svelte";
    import { getPalettesByType, savePalette } from "../../pixlandApi.js";
    import { MESSAGES_TYPES, showAlert } from "$lib/utils.js";
    import { user } from "../../shared.svelte.js";
    import PaletteCard from "../PaletteCard.svelte";

    // Constantes de configuración
    const STEP = 6;
    const OPTIONS_CONFIG = [
        { id: "mine", label: "Mine" },
        { id: "explore", label: "Explore" },
        { id: "default", label: "Default" },
    ];

    // Estado Reactivo (Svelte 5 Runes)
    let optionSelected = $state("mine");
    let fetchingPalettes = $state(true);
    let palettes = $state([]);
    let hasMorePages = $state(false);
    let showAddPaletteSection = $state(false);
    let isSavingPalette = $state(false);
    let paletteNameInput = $state("");
    
    // Estado de paginación independiente por pestaña
    let paginationState = $state({
        mine: 0,
        explore: 0,
        default: 0
    });

    let COLORS = $state([
        { varName: "c01", varHex: "#000000" },
        { varName: "c02", varHex: "#111111" },
        { varName: "c03", varHex: "#222222" },
        { varName: "c04", varHex: "#333333" },
        { varName: "c05", varHex: "#444444" },
        { varName: "c06", varHex: "#555555" },
        { varName: "c07", varHex: "#666666" },
        { varName: "c08", varHex: "#777777" },
        { varName: "c09", varHex: "#888888" },
        { varName: "c10", varHex: "#999999" },
        { varName: "c11", varHex: "#AAAAAA" },
        { varName: "c12", varHex: "#BBBBBB" },
        { varName: "c13", varHex: "#CCCCCC" },
        { varName: "c14", varHex: "#DDDDDD" },
        { varName: "c15", varHex: "#EEEEEE" },
        { varName: "c16", varHex: "#FFFFFF" },
    ]);

    onMount(async () => {
        await loadPalettes();
    });

    async function loadPalettes(showLoader = true) {
        if (showLoader) fetchingPalettes = true; // Solo mostramos spinner si se pide

        const currentPage = paginationState[optionSelected];
        const skip = STEP * currentPage;

        try {
            const data = await getPalettesByType(optionSelected, skip);

            if (data && data.data && data.data.info) {
                hasMorePages = data.data.info.has_more;
                palettes = data.data.info.palettes || [];
            } else {
                palettes = [];
                hasMorePages = false;
            }
        } catch (error) {
            console.error("Error fetching palettes:", error);
            // Solo mostramos alerta si era una carga explicita, para no molestar en recargas silenciosas
            if (showLoader) showAlert(MESSAGES_TYPES.ERROR, "Error", "Failed to load palettes.");
            palettes = [];
        } finally {
            if (showLoader) fetchingPalettes = false;
        }
    }

    async function changeTab(id) {
        if (optionSelected === id) return; // Evitar recarga si es la misma pestaña
        optionSelected = id;
        await loadPalettes();
    }

    async function changePage(direction) {
        const currentPage = paginationState[optionSelected];
        
        // Validaciones de seguridad
        if (direction === -1 && currentPage <= 0) return;
        if (direction === 1 && !hasMorePages) return;

        // Actualizar el estado de paginación
        paginationState[optionSelected] += direction;
        
        await loadPalettes();
    }

    function getContrastColor(hex) {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);

        return (((r * 299) + (g * 587) + (b * 114)) / 1000) >= 128 ? "#000000" : "#FFFFFF";
    }

    function generateRandomPalette() {
        function getRandomHex() {
            return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        }

        for (let i = 0; i < COLORS.length; i++) {
            COLORS[i].varHex = getRandomHex();
        }
    }

    async function handleSave() {
        const paletteNameToSend = paletteNameInput.trim();

        if (!paletteNameToSend) return;

        const response = await savePalette({
            name: paletteNameToSend,
            colors: COLORS.map(palette => palette.varHex),
            creator: user.name,
        })

        if (response.state !== MESSAGES_TYPES.SUCCESS) {
            const data = response.data;

            if (data && data.code === 409) {
                showAlert(MESSAGES_TYPES.ERROR, "Palette Name Already Exists", `A palette with name '${paletteNameToSend}' is already saved. Please choose a different name and try again.`);
            }
            else {
                showAlert(MESSAGES_TYPES.ERROR, "Failed to Save Color Palette", "Something went wrong while saving your color palette. Please try again or check your connection.");
            }

            return;
        }

        const paletteInfo = response.data.info.palette;

        // Optimización: Solo agregamos a la lista si estamos en la pestaña "mine" y en la página 0
        // para que el usuario vea su creación inmediatamente.
        if (optionSelected === 'mine' && paginationState.mine === 0) {
            palettes.push(paletteInfo);
        }

        isSavingPalette = false;
        paletteNameInput = "";

        showAlert(MESSAGES_TYPES.SUCCESS, "Color Palette Saved", "Your color palette has been successfully saved and is now ready to use.");
    }

    async function removePaletteFromList(idToDelete) {
        // 1. Optimistic UI: Borrado visual inmediato
        if (palettes) {
            palettes = palettes.filter(p => p.id !== idToDelete);
        }

        // 2. Lógica de Paginación Post-Borrado
        if (palettes.length === 0 && paginationState[optionSelected] > 0) {
            // CASO A: Si borré el último elemento de la página y no es la página 0,
            // retrocedemos automáticamente a la página anterior.
            changePage(-1);
        } else {
            // CASO B: Quedó un hueco (ej: hay 5 items en vez de 6).
            // Hacemos una recarga silenciosa (showLoader = false) para traer
            // el elemento que se "corrió" desde la siguiente página.
            await loadPalettes(false);
        }
    }
</script>

<div id="palettes">
    <div id="palettes-header">
        <i class="ph ph-palette"></i>
        <h2>Palettes</h2>
    </div>

    <nav id="options-container">
        {#each OPTIONS_CONFIG as { id, label }}
            <button
                class={["option-button", optionSelected === id ? "option-selected" : ""]}
                onclick={(e) => {
                    e.stopPropagation();
                    changeTab(id);
                }}
            >
                {label}
            </button>
        {/each}
    </nav>

    {#if fetchingPalettes}
        <div id="loader-container">
            <span class="loader"></span>
        </div>
    {:else if showAddPaletteSection}
        <div id="palette-creator">
            <aside class="creator-sidebar">
                <button
                    class="action-button"
                    title="Mix palette"
                    aria-label="Mix palette"
                    onclick={(e) => {
                        e.stopPropagation();
                        generateRandomPalette();
                    }}
                >
                    <i class="ph-bold ph-shuffle-simple"></i>
                </button>
                <div class="save-action-wrapper">
                    <button
                        class="action-button {isSavingPalette ? 'active' : ''}"
                        title="Save palette"
                        aria-label="Save palette"
                        onclick={(e) => {
                            e.stopPropagation();
                            isSavingPalette = !isSavingPalette;
                            if(isSavingPalette) setTimeout(() => document.getElementById('name-input')?.focus(), 50);
                        }}
                    >
                        <i class="ph-bold ph-floppy-disk"></i>
                    </button>
                
                    {#if isSavingPalette}
                        <div class="floating-input-container">
                            <input 
                                id="name-input"
                                type="text" 
                                placeholder="Name..." 
                                bind:value={paletteNameInput}
                                onkeydown={async(e) => {
                                    if (e.key !== "Enter") return;
                                    await handleSave();
                                }}
                                onclick={(e) => e.stopPropagation()} 
                            />
                            <button 
                                class="confirm-save-btn" 
                                title="Confirm saved"
                                aria-label="Confirm saved"
                                onclick={async (e) => {
                                    e.stopPropagation();
                                    await handleSave();
                                }}
                            >
                                <i class="ph-bold ph-check"></i>
                            </button>
                        </div>
                    {/if}
                </div>
                <button
                    class="action-button"
                    title="Copy CSS"
                    aria-label="Copy CSS"
                >
                    <i class="ph-bold ph-file-css"></i>
                </button>
                <button
                    class="action-button"
                    title="Copy JSON"
                    aria-label="Copy JSON"
                >
                    <i class="ph-bold ph-brackets-curly"></i>
                </button>
                <button
                    class="action-button"
                    title="Close"
                    aria-label="Close the menu to create a palette"
                    onclick={(e) => {
                        e.stopPropagation();
                        showAddPaletteSection = false;
                    }}
                >
                    <i class="ph-bold ph-x"></i>
                </button>
            </aside>

            <div id="separator"></div>

            <main class="creator-main-content">
                <div class="creator-palette-grid" id="paletteGrid">
                    {#each COLORS as color}
                        <div class="color-slot" style="background-color: {color.varHex};">
                            <span
                                class="hex-code"
                                style="color: {getContrastColor(color.varHex)};"
                            >
                                {color.varHex}
                            </span>
                            <input
                                class="color-input"
                                type="color"
                                bind:value={color.varHex}
                            />
                        </div> 
                    {/each}
                </div>
            </main>
        </div>
    {:else}
        {#if Array.isArray(palettes) && palettes.length > 0}
            <div id="pagination">
                <button
                    class="pagination-button"
                    aria-label="Previous"
                    disabled={paginationState[optionSelected] === 0}
                    onclick={() => changePage(-1)}
                >
                    <i class="ph-bold ph-caret-left"></i>
                </button>
                
                <button
                    class="pagination-button"
                    aria-label="Next"
                    disabled={!hasMorePages}
                    onclick={() => changePage(1)}
                >
                    <i class="ph-bold ph-caret-right"></i>
                </button>
            </div>
            <div id="palette-card-container">
                {#each palettes as {id, creator, name, likes, colors}}
                    <PaletteCard
                        paletteId={id}
                        creatorName={creator}
                        paletteName={name}
                        numLikes={likes}
                        paletteColors={colors}
                        paletteType={optionSelected}
                        onDelete={removePaletteFromList}
                    />
                {/each}
            </div>
        {:else}
            <div style="text-align:center; padding: 20px; opacity: 0.7;">
                <p>No palettes found.</p>
            </div>
        {/if}
    {/if}

    {#if optionSelected === "mine" && !showAddPaletteSection && !fetchingPalettes}
        <button
            id="add-palette-button"
            class="action-button"
            aria-label="Add new palette"
            onclick={(e) => {
                e.preventDefault();
                showAddPaletteSection = true;
            }}
        >
            <i class="ph-bold ph-plus"></i>
        </button>
    {/if}
</div>

<style>
    #palettes {
        position: relative;
        padding: 12px;
        background-color: var(--bg-elevated-1);
        box-shadow: var(--shadow-colored);
        border: 1px solid var(--border-default);
        border-radius: 6px;
        color: var(--text-primary);
        width: 974px;
        height: 536px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .action-button {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        padding: 0.25rem;
    }

    #add-palette-button {
        position: absolute;
        bottom: 0.5rem;
        left: 0.5rem;
    }

    #palettes-header {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    #palettes-header > i {
        font-size: 2rem;
        color: var(--accent-primary);
    }

    #options-container {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
    }

    .option-button {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.875rem;
        font-weight: 500;
        white-space: nowrap;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }

    .option-button:hover:not(.option-selected) {
        background-color: var(--hover-overlay);
        color: var(--text-primary);
    }

    .option-selected {
        background-color: var(--action-primary);
        color: var(--action-primary-text);
    }

    #pagination {
        display: flex;
        gap: 2px;
    }

    #pagination .pagination-button:first-child {
        border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
    }

    #pagination .pagination-button:last-child {
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
    }

    .pagination-button {
        padding: 4px;
        font-size: 1rem;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pagination-button:disabled {
        cursor: not-allowed;
        background-color: aqua;
    }

    #palette-card-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr); 
        gap: 0.75rem;
    }

    #loader-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #palette-creator {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
    }

    .creator-sidebar {
        width: var(--sidebar-width);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }

    .creator-main-content {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .creator-palette-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 8px;
        height: 100%;
        width: 100%;
    }

    .color-slot {
        position: relative;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        min-height: 0; /* Importante para Grid + Flex */
    }

    .color-input {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        opacity: 0; cursor: pointer;
    }

    .hex-code {
        font-family: monospace;
        font-size: 0.75rem; /* Texto más pequeño */
        font-weight: bold;
        text-transform: uppercase;
        pointer-events: none;
        background: rgba(255,255,255,0.2);
        padding: 2px 6px;
        border-radius: 4px;
        backdrop-filter: blur(1px);
        opacity: 0.9;
    }

    #separator {
        width: 1px;
        height: 92%;
        background-color: #FFFFFF;
    }

    .save-action-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    /* Estilo para cuando el botón está activo */
    .action-button.active {
        background-color: var(--action-primary, #007bff); /* O tu color de acento */
        color: white;
    }
    
    .floating-input-container {
        position: absolute;
        /* Posicionamiento clave: */
        left: 100%; /* Empieza justo donde termina el botón */
        top: 50%; /* Centrado verticalmente respecto al botón */
        transform: translateY(-50%); /* Ajuste fino del centro vertical */
        
        margin-left: 12px; /* Un pequeño espacio entre el botón y el input */
        display: flex;
        gap: 4px;
        background-color: var(--bg-elevated-1);
        border: 1px solid var(--border-default);
        padding: 4px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 100; /* Asegura que flote sobre los colores */
        
        /* Animación opcional de entrada */
        animation: popIn 0.2s ease-out forwards;
    }
    
    .floating-input-container input {
        background: transparent;
        border: 1px solid var(--border-default);
        color: var(--text-primary);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.875rem;
        width: 140px;
        outline: none;
    }
    
    .floating-input-container input:focus {
        border-color: var(--accent-primary, #888);
    }
    
    .confirm-save-btn {
        background: var(--action-primary, #333);
        color: white;
        border: none;
        border-radius: 4px;
        width: 28px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .confirm-save-btn:hover {
        opacity: 0.9;
    }
    
    @keyframes popIn {
        from { opacity: 0; transform: translate(-10px, -50%); }
        to { opacity: 1; transform: translate(0, -50%); }
    }
</style>