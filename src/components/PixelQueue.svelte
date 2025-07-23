<script>
	import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import { drawingState } from "../shared.svelte.js";
    import { padWithZeros } from "../utils.js";

    onMount(() => {
        const intervalId = setInterval(() => {
            if (drawingState.availablePixels < drawingState.pixelLimit) {
                drawingState.availablePixels++;
            }
        }, 4000);

        return () => clearInterval(intervalId);
    });
</script>

<div id="pixel-queue">
    <i class="ph-fill ph-square-logo"></i>
    {#key drawingState.availablePixels}
        <span in:scale>
            {padWithZeros(drawingState.availablePixels, 2)}
        </span> 
    {/key}
    / {padWithZeros(drawingState.pixelLimit, 2)}
</div>

<style>
    #pixel-queue {
        position: fixed;
        top: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--overlay-bg);
        color: var(--text-primary);
        font-size: 1.5rem;
        border-radius: 6px;
        height: 42px;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>