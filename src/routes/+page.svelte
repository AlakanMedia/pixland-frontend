<script>
    import { onMount } from "svelte";
    import { Spring } from "svelte/motion";
    import { colorSelected, modals, user, appInfo } from "../shared.svelte.js";
    import Widgets from "../components/Widgets.svelte";
	import { decodeJWT } from "../utils.js";

    const API_URL = import.meta.env.VITE_API_URL
    let canvasElement;
    const pixelSize = 20;
    let coords = new Spring({x:50, y: 50}, {stiffness: 0.1, damping: 0.25});

    onMount(() => {
        drawMatrix();

        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            const currentUnixDate = Math.floor(Date.now() / 1000);
            const tokenData = decodeJWT(accessToken);

            if (currentUnixDate < tokenData.payload.exp) {
                user.id = tokenData.payload.sub;
                user.logged = true;
            }
            else {
                localStorage.removeItem("access_token");
            }
        }

        const wsUrl = user.id ? `${API_URL}/ws?user_id=${user.id}` : `${API_URL}/ws`;
        user.websocket = new WebSocket(wsUrl);

        user.websocket.onopen = () => {
            console.log("WebSocket connection successfully established.");
        };

        user.websocket.onclose = () => {
            user.websocket = null;
            console.log("WebSocket connection closed.");
        };

        user.websocket.onmessage = (event) => {
            const wsData = JSON.parse(event.data);

            if (wsData.type === "update_pixel") {
                setColor(wsData.data.x, wsData.data.y, wsData.data.color);
            }
            else if (wsData.type === "update_active_users") {
                appInfo.activeUsers = wsData.data.active_users;
            }
        };

        return () => {
            if (user.websocket) {
                user.websocket.close();
                user.websocket = null;
            }
        };
    });

    function drawMatrix() {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;

        const context = canvasElement.getContext("2d");
        const rows = canvasElement.height / pixelSize;
        const columns = canvasElement.width / pixelSize;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                context.strokeStyle = "grey";
                context.strokeRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    function setColor(x, y, color) {
		const xCanvas = Math.floor(x / pixelSize) * pixelSize;
		const yCanvas = Math.floor(y / pixelSize) * pixelSize;

        const context = canvasElement.getContext("2d");
        context.fillStyle = color;
        context.fillRect(xCanvas, yCanvas, pixelSize, pixelSize);
    }

    function handleSetColor(event) {
        if (!user.logged) {
            modals.loginIsOpen = true;
            return;
        }

        if (colorSelected.name) {
            setColor(event.clientX, event.clientY, colorSelected.name);
            user.websocket.send(JSON.stringify({
                type: "update_pixel",
                data: {
                    x: event.clientX,
                    y: event.clientY,
                    color: colorSelected.name,
                },
            }));
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

<canvas id="matrix" bind:this={canvasElement}></canvas>
<svg
    id="mouse-chaser"
    role="presentation"
    onclick={(e) => {handleSetColor(e);}}
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