<script>
	import { onMount } from "svelte";
    import { availablePixels } from "../shared.svelte.js";
    import { padWithZeros } from "../utils.js";

    onMount(() => {
        const intervalId = setInterval(() => {
            if (availablePixels.num < availablePixels.limit) {
                availablePixels.num++;
            }
        }, 4000);

        return () => clearInterval(intervalId);
    });
</script>

<div id="pixel-queue">
    <i class="ph-fill ph-square-logo"></i>
    {padWithZeros(availablePixels.num, 2)} / {padWithZeros(availablePixels.limit, 2)}
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