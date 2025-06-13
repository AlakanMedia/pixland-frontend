<script>
    import ColorPalette from "../components/ColorPalette.svelte";
    import Options from "../components/Options.svelte";
    import Login from "./Login.svelte";
    import Alert from "./Alert.svelte";
    import { store, alert } from "../shared.svelte.js";
</script>

<ColorPalette/>
<Options/>
{#if store.loginIsOpen}
    <Login/>
{/if}
{#if alert.show}
    <Alert/>
{/if}