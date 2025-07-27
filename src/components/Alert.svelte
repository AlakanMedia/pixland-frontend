<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { ui } from "../shared.svelte.js";
    import { MESSAGES_TYPES } from "$lib/utils.js";

    onMount(() => {
        const interval = setInterval(() => {
            ui.alert.show = false;
		}, 6000);

		return () => clearInterval(interval);
    });
</script>

<div
    id="alert"
    class={ui.alert.type === MESSAGES_TYPES.ERROR ? "alert-error" : ui.alert.type === MESSAGES_TYPES.SUCCESS ? "alert-success" : "alert-warning"}
    transition:fly={{x: 400, duration: 1600}}
>
    <div class="alert-icon">
        <i class={["ph-bold", ui.alert.type === MESSAGES_TYPES.ERROR ? "ph-bug" : ui.alert.type === MESSAGES_TYPES.SUCCESS ? "ph-check-circle" : "ph-info"]}></i>
    </div>
    <div class="alert-content">
        <div class="alert-title">{ui.alert.title}</div>
        <div class="alert-description">{ui.alert.message}</div>
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

    .alert-icon > i {
        font-size: 2rem;
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