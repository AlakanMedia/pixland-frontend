<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { alert } from "../shared.svelte.js";

    const alertIcons = {
        "error": "<i class='ph ph-bold ph-bug' style='font-size: 2rem;'></i>",
        "success": "<i class='ph ph-bold ph-check-circle' style='font-size: 2rem;'></i>",
        "info": "<i class='ph ph-bold ph-info' style='font-size: 2rem;'></i>",
    };

    onMount(() => {
        const interval = setInterval(() => {
            alert.show = false;
		}, 4000);

		return () => clearInterval(interval);
    });
</script>

<div
    id="alert"
    transition:fly={{x: 400, duration: 1600}}
    style="background-color: {alert.type === "error" ? "red" : alert.type === "success" ? "green" : "yellow"};"
>
    <div id="alert-title">
        {#if alert.type in alertIcons}
            {@html alertIcons[alert.type]}
        {/if}
        <h2>{alert.title}</h2>
    </div>
    <p>{alert.message}</p>
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