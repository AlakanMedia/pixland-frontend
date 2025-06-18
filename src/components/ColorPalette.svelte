<script>
    import { colorSelected } from "../shared.svelte.js";

    const COLORS = [
        "red", "green", "blue", "yellow",
        "orange", "purple", "pink", "cyan",
        "magenta", "gray", "black", "white",
        "turquoise", "beige", "brown", "lavender",
    ];
</script>

<div id="palette">
    {#each COLORS as color}
       <button
            class={["palette-button", colorSelected.name === color ? "selected" : ""]}
            style="background-color: {color};"
            onclick={(e) => {
                e.stopPropagation();
                colorSelected.name = color;
            }}
            aria-label={color}
            title={color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()}
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
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 6px;

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
        background-color: white;
        box-shadow: 0 0 3px rgba(0,0,0,0.5);
    }

    .palette-button.selected {
        border: 3px solid white;
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
