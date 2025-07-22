<script>
    import { drawingState } from "../shared.svelte.js";

    const COLORS = [
        {varName: "--color01", varText: "Very Dark Gray"},
        {varName: "--color02", varText: "Black"},
        {varName: "--color03", varText: "Gray"},
        {varName: "--color04", varText: "White"},
        {varName: "--color05", varText: "Dark Tan"},
        {varName: "--color06", varText: "Pastel Pink"},
        {varName: "--color07", varText: "Light Purple"},
        {varName: "--color08", varText: "Purple"},
        {varName: "--color09", varText: "Red"},
        {varName: "--color10", varText: "Orange"},
        {varName: "--color11", varText: "Yellow"},
        {varName: "--color12", varText: "Lime Green"},
        {varName: "--color13", varText: "Green"},
        {varName: "--color14", varText: "Aqua"},
        {varName: "--color15", varText: "Dodger Blue"},
        {varName: "--color16", varText: "Blue"},
    ];
</script>

<div id="palette">
    {#each COLORS as color}
       <button
            class={["palette-button", drawingState.selectedColor === color.varName ? "selected" : ""]}
            style={`background-color: var(${color.varName});`}
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

    @media (max-width: 580px) {
        #palette {
            width: calc((4 * 42px) + (6px * 5));
        }
    }
</style>
