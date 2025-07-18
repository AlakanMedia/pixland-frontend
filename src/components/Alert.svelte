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
		}, 6000);

		return () => clearInterval(interval);
    });
</script>

<div
    id="alert"
    class={alertCard.type === "error" ? "alert-error" : alertCard.type === "success" ? "alert-success" : "alert-warning"}
    transition:fly={{x: 400, duration: 1600}}
>
    <div class="alert-icon">
        {@html alertIcons[alertCard.type]}
    </div>
    <div class="alert-content">
        <div class="alert-title">{alertCard.title}</div>
        <div class="alert-description">{alertCard.message}</div>
    </div>
</div>

<style>
    #alert {
        position: fixed;
        top: 0.5rem;
        right: 0.5rem;
        width: 320px;
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid;
        box-shadow: var(--shadow-lg);
        overflow: hidden;
    }

    #alert::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background: currentColor;
    }

    .alert-success {
        background: var(--state-success-bg);
        color: var(--state-success);
        border-color: var(--state-success-border);
    }

    .alert-warning {
        background: var(--state-warning-bg);
        color: var(--state-warning);
        border-color: var(--state-warning-border);
    }

    .alert-error {
        background: var(--state-error-bg);
        color: var(--state-error);
        border-color: var(--state-error-border);
    }

    .alert-icon {
        font-size: 24px;
        margin-top: 2px;
        flex-shrink: 0;
    }

    .alert-content {
        flex: 1;
        min-width: 0;
    }

    .alert-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 6px;
        color: inherit;
    }
</style>