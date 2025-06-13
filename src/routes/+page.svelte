<script>
    import { onMount } from "svelte";
    import { Spring } from "svelte/motion";
    import { store } from "../shared.svelte.js";
    import Widgets from "../components/Widgets.svelte";

    let canvas;
    const pixelSize = 20;
    let coords = new Spring({x:50, y: 50}, {stiffness: 0.1, damping: 0.25});

    onMount(() => {
        drawMatrix();

        if (localStorage.getItem("access_token")) {
            store.userLogged = true;
        }
    });

    function drawMatrix() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const context = canvas.getContext("2d");
        const rows = canvas.height / pixelSize;
        const columns = canvas.width / pixelSize;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                context.strokeStyle = "grey";
                context.strokeRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    function setColor(event) {
        if (!store.userLogged) {
            store.loginIsOpen = true;
            return;
        }

        if (store.colorName) {
		    const x = Math.floor(event.clientX / pixelSize) * pixelSize;
		    const y = Math.floor(event.clientY / pixelSize) * pixelSize;

            const context = canvas.getContext("2d");
            context.fillStyle = store.colorName;
            context.fillRect(x, y, pixelSize, pixelSize);
            
            // TODO: Debo verificar si la api devuelve 401 para marcar el store.userLogged como falso
        }
    }
</script>

<svelte:window onresize={() => {drawMatrix();}}/>
<svelte:body
    onmousemove={(e) => {
        coords.target = {x: e.clientX, y: e.clientY};
    }}
/>

<canvas id="matrix" bind:this={canvas}></canvas>
<svg
    id="mouse-chaser"
    role="presentation"
    onclick={(e) => {setColor(e);}}
>
    <rect 
        width={pixelSize}
        height={pixelSize}
        x={Math.floor(coords.current.x / pixelSize) * pixelSize}
        y={Math.floor(coords.current.y / pixelSize) * pixelSize}
    />
</svg>
<Widgets/>

<style>
	:global(*) {
		margin: 0;
        padding: 0;
        box-sizing: border-box;
	}

    :global(button) {
        cursor: pointer;
    }

    #matrix {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: cornsilk;
    }

    #mouse-chaser {
        position: fixed;
        width: 100%;
        height: 100%;
    }
</style>