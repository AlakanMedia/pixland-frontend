<script>
    import { onMount } from "svelte";
    import { Spring } from "svelte/motion";
    import { colorSelected, modals, user, appInfo } from "../shared.svelte.js";
    import Widgets from "../components/Widgets.svelte";
	import { decodeJWT } from "../utils.js";

    const API_URL = import.meta.env.VITE_API_URL

    // Referencia al canvas
    let canvasElement;

    // Tamaño en pixeles de una celda
    const cellSize = 20;

    // Variables de configuración del mouse chaser
    let coords = new Spring({x:50, y: 50}, {stiffness: 0.1, damping: 0.25});
    let size = new Spring(7);

    // Variables que almacenan en qué posición de nuestro
    // mundo en pixeles está la esquina superior izquierda
    let camaraOffsetX = 0;
    let camaraOffsetY = 0;
    let startCameraX = 0;
    let startCameraY = 0;

    // Variables para el clic y arrastre
    const dragThreshold = 5;
    let isDragging = false;
    let isMouseDown = false;
    let clickMouseX;
    let clickMouseY;

    onMount(() => {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;

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
        const context = canvasElement.getContext("2d");

        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // 1. Calcula qué celdas del MUNDO son visibles en la pantalla ahora mismo
        const startCellX = Math.floor(camaraOffsetX / cellSize);
        const startCellY = Math.floor(camaraOffsetY / cellSize);
        const endCellX = Math.floor((camaraOffsetX + canvasElement.width) / cellSize);
        const endCellY = Math.floor((camaraOffsetY + canvasElement.height) / cellSize);

        // 2. Itera sobre las celdas del MUNDO que son visibles
        for (let i = startCellX; i <= endCellX; i++) {
            for (let j = startCellY; j <= endCellY; j++) {
                // 3. Calcula dónde dibujar cada celda del mundo en la PANTALLA
                const worldX = i * cellSize;
                const worldY = j * cellSize;
                const screenX = worldX - camaraOffsetX;
                const screenY = worldY - camaraOffsetY;
                
                context.strokeStyle = "grey";
                context.strokeRect(screenX, screenY, cellSize, cellSize);

                // Aquí también iría la lógica para dibujar el color de la celda
                // desde tu modelo de datos (el array 2D `mundo`)
                // const color = mundo[i][j].color;
                // context.fillStyle = color;
                // context.fillRect(pantallaX, pantallaY, cellSize, cellSize);
            }
        }
    }

    function setColor(x, y, color) {
        const context = canvasElement.getContext("2d");

        // Ajustamos la celda según la ventana del usuario
        const screenX = x - camaraOffsetX;
        const screenY = y - camaraOffsetY;

        context.fillStyle = color;
        context.fillRect(screenX, screenY, cellSize, cellSize);
    }

    function handleSetColor(event) {
        if (!user.logged) {
            modals.loginIsOpen = true;
            return;
        }

        if (colorSelected.name) {
            // Calculamos las coordenadas de la celda en el mundo
            const worldX = Math.floor((camaraOffsetX + event.clientX) / cellSize) * cellSize;
            const worldY = Math.floor((camaraOffsetY + event.clientY) / cellSize) * cellSize;

            setColor(worldX, worldY, colorSelected.name);
            user.websocket.send(JSON.stringify({
                type: "update_pixel",
                data: {
                    x: worldX,
                    y: worldY,
                    color: colorSelected.name,
                },
            }));
            // TODO: Debo verificar si la api devuelve 401 para marcar el store.userLogged como falso
        }
    }

    function handleOnMouseDown(event) {
        // Para que no haga nada si presionó algún botón que no sea el izquierdo
        if (event.button !== 0) {
            return;
        }

        clickMouseX = event.clientX;
        clickMouseY = event.clientY;
        startCameraX = camaraOffsetX;
        startCameraY = camaraOffsetY;
        isMouseDown = true;
        size.target = 10;
    }

    function handleOnMouseMove(event) {
        // Verificamos que el usuario tenga el clic izquierdo presionado
        if (isMouseDown) {
            const deltaX = event.clientX - clickMouseX;
            const deltaY = event.clientY - clickMouseY;
            const dragDistance = Math.hypot(deltaX, deltaY);

            if (dragDistance > dragThreshold) {
                isDragging = true;

                camaraOffsetX = startCameraX - deltaX;
                camaraOffsetY = startCameraY - deltaY;

                drawMatrix();
            }
        }
    }

    function handleOnMouseUp(event) {
        if (isDragging) {
            // Lógica para el arrastre
        }
        else {
            handleSetColor(event);
        }

        isDragging = false;
        isMouseDown = false;
        size.target = 7;
    }
</script>

<svelte:window onresize={() => {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;

        drawMatrix();
    }}
/>
<svelte:body
    onmousemove={(e) => {
        coords.target = {x: e.clientX, y: e.clientY};
    }}
/>

<canvas id="matrix" bind:this={canvasElement}></canvas>
<svg
    id="mouse-chaser"
    role="presentation"
    onmousedown={(e) => {handleOnMouseDown(e);}}
    onmousemove={(e) => {handleOnMouseMove(e);}}
    onmouseup={(e) => {handleOnMouseUp(e);}}
>
	<circle
		cx={coords.current.x}
		cy={coords.current.y}
		r={size.current}
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