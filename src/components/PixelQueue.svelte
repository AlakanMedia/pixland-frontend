<script>
	import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import { drawingState, user } from "../shared.svelte.js";
    import { padWithZeros } from "$lib/utils.js";

    onMount(() => {
        const intervalId = setInterval(() => {
            if (drawingState.availablePixels < drawingState.pixelLimit) {
                drawingState.availablePixels++;
            }
        }, 3000);

        return () => clearInterval(intervalId);
    });
</script>

<div id="pixel-queue">
    {#if user.websocket}
        <i class="ph-fill ph-square-logo"></i>
        {#key drawingState.availablePixels}
            <span in:scale>
                {padWithZeros(drawingState.availablePixels, 2)}
            </span> 
        {/key}
        / {padWithZeros(drawingState.pixelLimit, 2)}
    {:else}
        <i class="ph ph-plugs"></i>
        <span>DC</span>
        <div class="status-indicator"></div>
    {/if}
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

    .status-indicator {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        background-color: var(--state-warning);
        animation: pulse-dot 1.5s ease-in-out infinite;
    }

    @keyframes pulse-dot {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.7; }
    }
</style>