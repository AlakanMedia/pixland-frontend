<script>
    import { onMount } from "svelte";
    import { Spring } from "svelte/motion";
    import { colorSelected, modals, user, appInfo } from "../shared.svelte.js";
    import Widgets from "../components/Widgets.svelte";
	import { decodeJWT } from "../utils.js";

    const API_URL = import.meta.env.VITE_API_URL

    let canvasElement; // Referencia al canvas
    let contextCanvas; // Contexto del canvas

    // Configuración del mundo
    const cellSize = 20;
    const worldPxWidth = cellSize * 1024;
    const worldPxHeight = cellSize * 1024;

    // Variables de configuración del mouse chaser
    let coords = new Spring({x:50, y: 50}, {stiffness: 0.1, damping: 0.25});
    let size = new Spring(7);

    let cameraOffsetX = 0; // Coordenada en píxeles de la esquina izquierda de la cámara
    let cameraOffsetY = 0; // Coordenada en píxeles de la esquina superior de la cámara
    let startCameraX = 0; // Para saber la posición previa de la cámara antes del arrastre
    let startCameraY = 0; // Para saber la posición previa de la cámara antes del arrastre

    // Variables para el clic y arrastre
    const dragThreshold = 5;
    let isDragging = false;
    let isMouseDown = false;
    let clickMouseX;
    let clickMouseY;

    onMount(() => {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
        contextCanvas = canvasElement.getContext("2d");

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
        contextCanvas.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // 1. Calcula qué celdas del MUNDO son visibles en la pantalla ahora mismo
        const startCellX = Math.floor(cameraOffsetX / cellSize);
        const startCellY = Math.floor(cameraOffsetY / cellSize);
        const endCellX = Math.floor((cameraOffsetX + canvasElement.width) / cellSize);
        const endCellY = Math.floor((cameraOffsetY + canvasElement.height) / cellSize);

        // 2. Itera sobre las celdas del MUNDO que son visibles
        for (let i = startCellX; i <= endCellX; i++) {
            for (let j = startCellY; j <= endCellY; j++) {
                // 3. Calcula dónde dibujar cada celda del mundo en la PANTALLA
                const worldX = i * cellSize;
                const worldY = j * cellSize;
                const screenX = worldX - cameraOffsetX;
                const screenY = worldY - cameraOffsetY;
                
                contextCanvas.strokeStyle = "grey";
                contextCanvas.strokeRect(screenX, screenY, cellSize, cellSize);

                // Aquí también iría la lógica para dibujar el color de la celda
                // desde tu modelo de datos (el array 2D `mundo`)
                // const color = mundo[i][j].color;
                // contextCanvas.fillStyle = color;
                // contextCanvas.fillRect(pantallaX, pantallaY, cellSize, cellSize);
            }
        }
    }

    function setColor(x, y, color) {
        // Ajustamos la celda según la ventana del usuario
        const screenX = x - cameraOffsetX;
        const screenY = y - cameraOffsetY;

        contextCanvas.fillStyle = color;
        contextCanvas.fillRect(screenX, screenY, cellSize, cellSize);
    }

    function handleSetColor(event) {
        if (!user.logged) {
            modals.loginIsOpen = true;
            return;
        }

        if (colorSelected.name) {
            // Calculamos la coordenada superior izquierda en píxeles de la celda en el mundo
            const worldX = Math.floor((cameraOffsetX + event.clientX) / cellSize) * cellSize;
            const worldY = Math.floor((cameraOffsetY + event.clientY) / cellSize) * cellSize;

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
        startCameraX = cameraOffsetX;
        startCameraY = cameraOffsetY;
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

                // Solución de los límites del mapa más corta, para la versión más larga
                // que hice tengo que ir a ver el pantallazo que tomé
                cameraOffsetX = Math.max(0, Math.min(startCameraX - deltaX, worldPxWidth - canvasElement.width));
                cameraOffsetY = Math.max(0, Math.min(startCameraY - deltaY, worldPxHeight - canvasElement.height));

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