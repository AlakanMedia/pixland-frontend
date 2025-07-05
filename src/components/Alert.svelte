<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { alertCard } from "../shared.svelte.js";

    const alertIcons = {
        "error": "<i class='ph-bold ph-bug' style='font-size: 2rem;'></i>",
        "success": "<i class='ph-bold ph-check-circle' style='font-size: 2rem;'></i>",
        "info": "<i class='ph-bold ph-info' style='font-size: 2rem;'></i>",
    };

    onMount(() => {
        const interval = setInterval(() => {
            alertCard.show = false;
		}, 4000);

		return () => clearInterval(interval);
    });
</script>

<div
    id="alert"
    transition:fly={{x: 400, duration: 1600}}
    style="background-color: {alertCard.type === "error" ? "red" : alertCard.type === "success" ? "green" : "yellow"};"
>
    <div id="alert-title">
        {#if alertCard.type in alertIcons}
            {@html alertIcons[alertCard.type]}
        {/if}
        <h2>{alertCard.title}</h2>
    </div>
    <p>{alertCard.message}</p>
</div>

<style>
    #alert {
        position: fixed;
        top: 0.5rem;
        right: 0.5rem;
        background-color: aquamarine;
        padding: 12px;
        border-radius: 6px;
        border: 2px solid blue;
        max-width: 320px;
    }

    #alert-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
</style>