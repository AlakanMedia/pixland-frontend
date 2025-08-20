<script>
    import { drawingState, colorPalette } from "../shared.svelte.js";

    const COLORS = [
        {varName: "c01", varText: "Very Dark Gray"},
        {varName: "c02", varText: "Black"},
        {varName: "c03", varText: "Gray"},
        {varName: "c04", varText: "White"},
        {varName: "c05", varText: "Dark Tan"},
        {varName: "c06", varText: "Pastel Pink"},
        {varName: "c07", varText: "Light Purple"},
        {varName: "c08", varText: "Purple"},
        {varName: "c09", varText: "Red"},
        {varName: "c10", varText: "Orange"},
        {varName: "c11", varText: "Yellow"},
        {varName: "c12", varText: "Lime Green"},
        {varName: "c13", varText: "Green"},
        {varName: "c14", varText: "Aqua"},
        {varName: "c15", varText: "Dodger Blue"},
        {varName: "c16", varText: "Blue"},
    ];
</script>

<div id="palette">
    {#each COLORS as color}
       <button
            class={["palette-button", drawingState.selectedColor === color.varName ? "selected" : ""]}
            style={`background-color: ${colorPalette[color.varName]};`}
            onclick={(e) => {
                e.stopPropagation();
                drawingState.selectedColor = color.varName;
            }}
            aria-label={color.varText}
            title={color.varText}
        >
        </button> 
    {/each}
</div>

<style>
    #palette {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px;
        padding: 6px;
        background-color: var(--overlay-bg);
        border-radius: 12px;

        position: fixed;
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%);

        width: calc((8 * 42px) + (6px * 9));
        max-width: 90%;
    }

    .palette-button {
        position: relative;
        height: 42px;
        width: 42px;
        border: none;
        border-radius: 6px;
        transition: transform 0.3s ease, border 0.3s ease;
    }

    .palette-button.selected::before {
        content: "";
        position: absolute;
        bottom: 4px;
        right: 4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--border-accent);
    }

    .palette-button.selected {
        border: 3px solid var(--border-accent);
    }

    .palette-button:not(.selected):hover {
        transform: scale(1.08);
    }

    @media (max-width: 600px) {
        #palette {
            right: 0.5rem;
            left: auto;
            transform: none;
        }
    }

    @media (max-width: 510px) {
        #palette {
            width: calc((4 * 42px) + (6px * 5));
        }
    }
</style>
