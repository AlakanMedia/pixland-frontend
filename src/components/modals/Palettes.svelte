<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { getPalettesByType, savePalette } from "../../pixlandApi.js";
    import { MESSAGES_TYPES, showAlert } from "$lib/utils.js";
    import { user, drawingState } from "../../shared.svelte.js";
    import PaletteCard from "../PaletteCard.svelte";

    // --- CONFIGURACIÓN Y ESTADO ---
    const STEP = 6;
    const OPTIONS_CONFIG = [
        { id: "mine", label: "Mine" },
        { id: "explore", label: "Explore" },
        { id: "default", label: "Default" },
    ];

    let optionSelected = $state("mine");
    let fetchingPalettes = $state(true);
    let palettes = $state([]);
    let hasMorePages = $state(false);
    let showAddPaletteSection = $state(false);
    let newPalettesAdded = $state(false);

    // Estados para la búsqueda de paletas
    let showSearchInput = $state(false);
    let searchTerm = $state(""); 

    // Estado del Creador
    let isSavingPalette = $state(false);
    let paletteNameInput = $state("");
    
    // Estado de Paginación
    let paginationState = $state({ mine: 0, explore: 0, default: 0 });

    // Colores Iniciales
    let COLORS = $state(Array.from({ length: 16 }, (_, i) => {
        const val = Math.floor(i * (255/15)).toString(16).padStart(2, '0');
        return { varName: `c${(i+1).toString().padStart(2,'0')}`, varHex: `#${val}${val}${val}` };
    }));

    // --- LÓGICA ---
    onMount(async () => await loadPalettes());

    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    async function loadPalettes(showLoader = true) {
        if (showLoader) fetchingPalettes = true;
        const currentPage = paginationState[optionSelected];
        
        try {
            const data = await getPalettesByType(optionSelected, STEP * currentPage, searchTerm);
            
            hasMorePages = data?.data?.info?.has_more ?? false;
            palettes = data?.data?.info?.palettes ?? [];
        } catch (error) {
            console.error(error);
            if (showLoader) showAlert(MESSAGES_TYPES.ERROR, "Error", "Failed to load palettes.");
            palettes = [];
        } finally {
            if (showLoader) fetchingPalettes = false;
        }
    }

    const handleSearchInput = debounce(async () => {
        paginationState[optionSelected] = 0; // Se reinicia la paginación al buscar
        await loadPalettes(false);
    }, 500);

    function toggleSearch() {
        showSearchInput = !showSearchInput;
        if (!showSearchInput) {
            if (searchTerm) {
                searchTerm = "";
                paginationState[optionSelected] = 0;
                loadPalettes();
            }
        } else {
            setTimeout(() => document.getElementById('search-input-field')?.focus(), 50);
        }
    }

    async function changeTab(id) {
        if (optionSelected === id) return;
        optionSelected = id;
        await loadPalettes();
    }

    async function changePage(direction) {
        const current = paginationState[optionSelected];
        if ((direction === -1 && current <= 0) || (direction === 1 && !hasMorePages)) return;
        paginationState[optionSelected] += direction;
        await loadPalettes();
    }

    // Utilidades de color
    const getContrast = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        return ((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128 ? "#000" : "#FFF";
    };

    function generateRandomPalette() {
        COLORS.forEach(c => c.varHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
    }

    async function handleSave() {
        const name = paletteNameInput.trim();
        if (!name) return;

        const res = await savePalette({ name, colors: COLORS.map(p => p.varHex), creator: user.name });

        if (res.state !== MESSAGES_TYPES.SUCCESS) {
            const isConflict = res.data?.code === 409;
            showAlert(MESSAGES_TYPES.ERROR, isConflict ? "Name Exists" : "Error", isConflict ? "Choose another name." : "Failed to save.");
            return;
        }

        newPalettesAdded = true; 
        isSavingPalette = false;
        paletteNameInput = "";
        showAlert(MESSAGES_TYPES.SUCCESS, "Saved", "Palette saved successfully.");
    }

    async function removePaletteFromList(id) {
        palettes = palettes.filter(p => p.id !== id);
        if (palettes.length === 0 && paginationState[optionSelected] > 0) changePage(-1);
        else if (palettes.length < STEP) await loadPalettes(false); // Rellenar hueco
    }

    function toggleSaveMode() {
        isSavingPalette = !isSavingPalette;
    }

    async function closeCreator() {
        showAddPaletteSection = false;

        if (newPalettesAdded) {
            newPalettesAdded = false;

            // Opcional: Volver a la página 0 para ver las nuevas paletas creadas
            // asumiendo que el backend las devuelve ordenadas por fecha descendente.
            // paginationState.mine = 0; 

            await loadPalettes();
        }
    }
</script>

{#snippet loader()}
    <div class="center-content full-height">
        <span class="loader"></span>
    </div>
{/snippet}

{#snippet navControls()}
    {#if !fetchingPalettes && !showAddPaletteSection}
        <div id="nav-buttons">
            <div id="pagination">
                <button
                    class="icon-btn page-btn"
                    disabled={paginationState[optionSelected] === 0}
                    onclick={() => changePage(-1)}
                    title="Previous page"
                    aria-label="Previous page"
                >
                    <i class="ph-bold ph-caret-left"></i>
                </button>
                <button
                    class="icon-btn page-btn"
                    disabled={!hasMorePages}
                    onclick={() => changePage(1)}
                    title="Next page"
                    aria-label="Next page"
                >
                    <i class="ph-bold ph-caret-right"></i>
                </button>
            </div>

            {#if optionSelected === "mine"}
                <button 
                    class="icon-btn btn-palette-action" 
                    onclick={() => showAddPaletteSection = true}
                    aria-label="Add new palette"
                >
                    <i class="ph-bold ph-plus"></i>
                </button>
            {:else}
               <div class="search-wrapper">
                    <button 
                        class="icon-btn btn-palette-action {showSearchInput ? 'active' : ''}" 
                        aria-label="Search palette"
                        onclick={toggleSearch}
                    >
                        {#if showSearchInput}
                            <i class="ph-bold ph-x"></i>
                        {:else}
                            <i class="ph-bold ph-magnifying-glass"></i>
                        {/if}
                    </button>

                    {#if showSearchInput}
                        <div class="floating-search" transition:fade={{ duration: 150 }}>
                            <input 
                                id="search-input-field"
                                type="text" 
                                placeholder="Find by name..." 
                                bind:value={searchTerm}
                                oninput={handleSearchInput}
                            />
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
{/snippet}

{#snippet paletteList()}
    {#if palettes.length > 0}
        <div class="grid-layout">
            {#each palettes as p (p.id)}
                <PaletteCard 
                    paletteId={p.id} 
                    creatorName={p.creator} 
                    paletteName={p.name} 
                    numLikes={p.likes} 
                    paletteColors={p.colors} 
                    paletteType={optionSelected} 
                    onDelete={removePaletteFromList} 
                />
            {/each}
        </div>
    {:else}
        <div class="center-content full-height opacity-70">
            <p>No palettes found.</p>
        </div>
    {/if}
{/snippet}

{#snippet creator()}
    <div id="palette-creator">
        <aside class="creator-sidebar">
            <button
                class="icon-btn"
                title="Random palette"
                aria-label="Random palette"
                onclick={generateRandomPalette}
            >
                <i class="ph ph-shuffle-simple"></i>
            </button>
            
            <div class="save-wrapper">
                <button
                    class="icon-btn {isSavingPalette ? 'active' : ''}"
                    title="Save palette"
                    aria-label="Save palette"
                    onclick={toggleSaveMode}
                >
                    <i class="ph ph-floppy-disk"></i>
                </button>
            
                {#if isSavingPalette}
                    <div class="floating-input" transition:fade={{ duration: 100 }}>
                        <input 
                            type="text" 
                            placeholder="Name..." 
                            bind:value={paletteNameInput}
                            onkeydown={(e) => e.key === "Enter" && handleSave()}
                        />
                        <button
                            class="mini-btn"
                            aria-label="Send palette"
                            onclick={handleSave}
                        >
                            <i class="ph-bold ph-check"></i>
                        </button>
                    </div>
                {/if}
            </div>

            <button
                class="icon-btn close-btn"
                title="Close"
                aria-label="Close"
                onclick={async () => { await closeCreator(); }}
            >
                <i class="ph ph-x"></i>
            </button>
        </aside>

        <div class="vertical-sep"></div>

        <main class="creator-grid">
            {#each COLORS as color}
                <div class="color-slot" style:background-color={color.varHex}>
                    <span class="hex-code" style:color={getContrast(color.varHex)}>
                        {color.varHex}
                    </span>
                    <input class="color-input" type="color" bind:value={color.varHex} />
                </div> 
            {/each}
        </main>
    </div>
{/snippet}

<div id="palettes-container">
    <header class="header">
        <i class="ph ph-palette"></i>
        <h2>Palettes</h2>
    </header>

    <nav class="tabs">
        {#each OPTIONS_CONFIG as opt}
            <button 
                class="tab-btn {optionSelected === opt.id ? 'selected' : ''}" 
                onclick={() => changeTab(opt.id)}
            >
                {opt.label}
            </button>
        {/each}
    </nav>

    {@render navControls()}

    <div class="content-area">
        {#if fetchingPalettes}
            {@render loader()}
        {:else if showAddPaletteSection}
            {@render creator()}
        {:else}
            {@render paletteList()}
        {/if}
    </div>

    <div class="badge">
        <span class="dot"></span>
        <p>{drawingState.name || "default"}</p>
    </div>
</div>

<style>
    #palettes-container {
        --p-width: 830px;
        --p-height: 478px;
        --btn-size: 30px;
        
        position: relative;
        padding: 12px;
        background-color: var(--bg-elevated-1);
        box-shadow: var(--shadow-colored);
        border: 1px solid var(--border-default);
        border-radius: 6px;
        color: var(--text-primary);
        width: var(--p-width);
        
        /* Altura: Fija en 518px, pero no excede el alto de la ventana */
        height: var(--p-height);
        max-height: 100vh;
        
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    /* --- Elementos Comunes --- */
    .center-content { display: flex; justify-content: center; align-items: center; }
    .full-height { height: 100%; width: 100%; }
    .opacity-70 { opacity: 0.7; }
    
    /* Botones Icono Genéricos */
    .icon-btn {
        width: var(--btn-size);
        height: var(--btn-size);
        border-radius: 50%;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        color: var(--text-secondary);
        transition: background 0.2s;
        flex-shrink: 0; /* Evita que los botones se aplasten */
    }
    .icon-btn:hover { background-color: var(--hover-overlay); color: var(--text-primary); }
    .icon-btn.active { background-color: var(--action-primary); color: white; }
    
    /* --- Header & Badge --- */
    .badge {
        display: flex; align-items: center; gap: 6px;
        font-size: 0.75rem; font-weight: 600;
        background-color: var(--bg-elevated-2, rgba(255,255,255,0.05));
        padding: 4px 10px; border-radius: 20px;
        border: 1px solid var(--border-default);
        width: fit-content;
    }
    .badge .dot {
        width: 6px; height: 6px; border-radius: 50%;
        background-color: var(--accent-primary, #4caf50);
        box-shadow: 0 0 4px var(--accent-primary);
    }
    .badge > p {
        max-width: 224px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* En móviles ocultamos el badge si estorba, o lo movemos */
    @media (max-width: 480px) {
        .badge { display: none; }
    }

    .header { display: flex; justify-content: center; align-items: center; gap: 0.5rem; }
    .header i { font-size: 2rem; color: var(--accent-primary); }

    /* --- Tabs --- */
    .tabs { display: flex; justify-content: center; gap: 0.5rem; }
    .tab-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-weight: 500;
        flex: 1;
        transition: all 0.2s;
        white-space: nowrap; /* Evita que el texto se rompa */
    }
    .tab-btn:hover:not(.selected) { background-color: var(--hover-overlay); color: var(--text-primary); }
    .tab-btn.selected { background-color: var(--action-primary); color: var(--action-primary-text); }

    /* --- Navegación & Paginación --- */
    #nav-buttons { position: relative; height: 30px; flex-shrink: 0; }
    #pagination { position: absolute; left: 0; display: flex; gap: 2px; }
    
    .page-btn { border-radius: 0; background-color: var(--bg-elevated-2); }
    .page-btn:first-child { border-radius: 50% 0 0 50%; }
    .page-btn:last-child { border-radius: 0 50% 50% 0; }
    .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-palette-action { position: absolute; right: 0; background-color: var(--bg-elevated-2); }

    /* --- Area de Contenido --- */
    .content-area { 
        flex: 1; 
        position: relative; 
        /* --- CAMBIO SCROLL --- */
        overflow-y: auto; /* Permite scroll vertical si el contenido es alto */
        overflow-x: hidden;
        min-height: 0; /* Importante para que el scroll funcione dentro de flex */
    }

    /* --- Grid Layout de Paletas --- */
    .grid-layout { 
        display: grid; 
        /* Por defecto 3 columnas */
        grid-template-columns: repeat(3, 1fr); 
        gap: 0.75rem; 
    }

    /* Media Queries para reducir columnas */
    @media (max-width: 860px) {
        #palettes-container {
            width: 558px;
        }

        .content-area {
            scrollbar-width: none; /* Firefox */
            scrollbar-color: transparent transparent; /* Firefox */
        }

        .content-area::-webkit-scrollbar {
            display: none; /* Chrome, Safari y Edge */
        }

        .grid-layout {
            grid-template-columns: repeat(2, 1fr); /* 2 Columnas en tablets/pantallas medianas */
        }
    }

    @media (max-width: 580px) {
        #palettes-container {
            width: 284px;
        }

        .tabs {
            gap: 0.25rem;
        }

        .tabs > button {
           padding: 0.75rem 1.25rem; 
        }

        .grid-layout {
            grid-template-columns: 1fr; /* 1 Columna en móviles */
        }
    }

    /* --- Creador --- */
    #palette-creator { display: flex; width: 100%; height: 100%; gap: 12px; }
    .creator-sidebar { display: flex; flex-direction: column; justify-content: center; gap: 8px; }
    .vertical-sep { width: 1px; height: 92%; background-color: var(--border-default, #ccc); margin: auto 0; flex-shrink: 0; }
    
    .creator-grid { 
        flex: 1; 
        display: grid; 
        grid-template-columns: repeat(4, 1fr); 
        grid-template-rows: repeat(4, 1fr); 
        gap: 8px; 
        overflow-y: auto; /* Scroll interno para el creador si es necesario */
    }

    @media (max-width: 580px) {
        #palette-creator { flex-direction: column; }
        .creator-sidebar { flex-direction: row; justify-content: space-between; padding: 0 10px; }
        .vertical-sep { width: 100%; height: 1px; margin: 0; }
        /* Si la pantalla es muy pequeña, forzamos altura mínima para ver colores */
        .creator-grid { min-height: 300px; } 
    }

    .color-slot {
        position: relative; border-radius: 8px; overflow: hidden;
        display: flex; justify-content: center; align-items: center;
        cursor: pointer;
    }
    .color-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; height: 100%; width: 100%; }
    .hex-code {
        font-family: monospace; font-size: 0.75rem; font-weight: bold;
        background: rgba(255,255,255,0.2); backdrop-filter: blur(2px);
        padding: 2px 6px; border-radius: 4px; pointer-events: none;
    }

    /* --- Save Input Flotante --- */
    .save-wrapper { position: relative; }
    .floating-input {
        position: absolute; left: 100%; top: 50%; transform: translateY(-50%);
        margin-left: 12px; padding: 4px; gap: 4px;
        display: flex; background: var(--bg-elevated-1);
        border: 1px solid var(--border-default); border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 20;
    }

    @media (max-width: 580px) {
        .floating-input {
            left: auto; right: 0; top: 110%; transform: none;
            margin-left: 0;
        }

        .hex-code {
            font-size: 0.5rem;
        }
    }

    .floating-input input {
        background: transparent; border: 1px solid var(--border-default);
        color: var(--text-primary); padding: 4px 8px; border-radius: 4px;
        width: 140px; outline: none;
    }
    .mini-btn {
        background: var(--action-primary); color: white;
        border: none; border-radius: 4px; width: 28px; cursor: pointer;
    }

    /* --- Búsqueda Flotante --- */
    .search-wrapper {
        position: absolute;
        right: 0;
        top: 0;
        height: 30px;
    }

    .floating-search {
        position: absolute;
        top: 100%; /* Justo debajo del botón */
        right: 0;
        margin-top: 8px; /* Un poco de espacio */
        padding: 6px;
        background: var(--bg-elevated-1);
        border: 1px solid var(--border-default);
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 30; /* Encima de las paletas */
        min-width: 200px;
        display: flex;
    }

    .floating-search input {
        background: transparent;
        border: 1px solid var(--border-default);
        color: var(--text-primary);
        padding: 6px 10px;
        border-radius: 4px;
        width: 100%;
        outline: none;
        font-size: 0.9rem;
    }
    
    .floating-search input:focus {
        border-color: var(--action-primary);
    }
    
    /* Ajuste para móviles */
    @media (max-width: 580px) {
        .floating-search {
            right: -10px; /* Ajuste fino si se sale de pantalla */
            min-width: 160px;
        }
    }
</style>