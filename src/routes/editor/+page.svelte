<script>
	import { goto } from "$app/navigation";
    import Editor from "../../components/Editor.svelte";
    import PageHeader from "../../components/PageHeader.svelte";
</script>

<div id="principal">
    <PageHeader />
    <div class="container">
        <Editor />
    </div>
    <button class="home-button" onclick={() => {goto("/");}} title="Go to Play" aria-label="Go to play">
        <i class="ph ph-house"></i>
    </button>
</div>

<style>
    #principal {
        background-color: var(--bg-base);
        height: 100%;
        line-height: 1.6;
        display: flex;
        flex-direction: column;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    }

    .home-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 56px;
        height: 56px;
        background: var(--accent-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        box-shadow: var(--shadow-lg);
        transition: all 0.2s ease;
        z-index: 1000;
    }

    .home-button:hover {
        background: var(--action-primary-hover);
        transform: scale(1.1);
        box-shadow: var(--shadow-xl);
    }

    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }

        .home-button {
            bottom: 1rem;
            right: 1rem;
        }
    }
</style>