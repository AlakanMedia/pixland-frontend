<script>
    import { onMount, onDestroy } from "svelte";
    import { Spring } from "svelte/motion";
    import { getUserInformation } from "../pixlandApi.js";
    import { colorSelected, modals, user, appInfo } from "../shared.svelte.js";
    import { generateDynamicKey } from "../utils.js";
    import Widgets from "../components/Widgets.svelte";

    const API_URL = import.meta.env.VITE_API_URL

    let canvasElement; // Referencia al canvas
    let contextCanvas; // Contexto del canvas

    const cellCache = new Map(); // Para guardar el valor de las celdas cacheadas

    // Variables para el manejo del zoom y la configuración del mundo
    const maxNumberCells = 1024;
    const baseCellSize = 16;
    const zoomIntensity = 0.02;
    let scale = $state(1); // La variable debe de ser $state para que $derived pueda funcionar
    let oldScale; // Scala antes del haber hecho zoom in o zoom out
    let effectiveCellSize = $derived(baseCellSize * scale);
    let worldPxWidth = $derived(effectiveCellSize * maxNumberCells);
    let worldPxHeight = $derived(effectiveCellSize * maxNumberCells);

    // Variables de configuración del mouse chaser
    let coords = new Spring({x:50, y: 50}, {stiffness: 0.1, damping: 0.25});
    let size = new Spring(4);

    let cameraOffsetX = 0; // Coordenada en píxeles de la esquina izquierda de la cámara
    let cameraOffsetY = 0; // Coordenada en píxeles de la esquina superior de la cámara
    let startCameraX = 0; // Para saber la posición previa de la cámara antes del arrastre
    let startCameraY = 0; // Para saber la posición previa de la cámara antes del arrastre

    // Variables para el clic y arrastre
    const dragThreshold = 4;
    let isDragging = false;
    let isMouseDown = false;
    let clickMouseX;
    let clickMouseY;

    onMount(async () => {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
        contextCanvas = canvasElement.getContext("2d");
        contextCanvas.imageSmoothingEnabled = false;

        drawMatrix();

        const response = await getUserInformation()

        if (response.state !== "success") {
            user.id = ""
            user.logged = false;
        }
        else {
            user.id = response.data.info.id;
            user.logged = true;
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
                cellCache.set(
                    generateDynamicKey(wsData.data.x, wsData.data.y, maxNumberCells - 1),
                    wsData.data.color
                );

                drawMatrix();
            }
            else if (wsData.type === "update_active_users") {
                appInfo.activeUsers = wsData.data.active_users;
            }
        };
    });

    onDestroy(() => {
        if (user.websocket) {
            user.websocket.close();
            user.websocket = null;
        }
    });

    function drawMatrix() {
        contextCanvas.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // 1. Calcula qué celdas del MUNDO son visibles en la pantalla ahora mismo
        const startCellX = Math.floor(cameraOffsetX / effectiveCellSize);
        const startCellY = Math.floor(cameraOffsetY / effectiveCellSize);
        const endCellX = Math.min(Math.floor((cameraOffsetX + canvasElement.width) / effectiveCellSize), maxNumberCells - 1);
        const endCellY = Math.min(Math.floor((cameraOffsetY + canvasElement.height) / effectiveCellSize), maxNumberCells - 1);

        const intCellSize = Math.ceil(effectiveCellSize);

        // 2. Itera sobre las celdas del MUNDO que son visibles
        for (let i = startCellX; i <= endCellX; i++) {
            for (let j = startCellY; j <= endCellY; j++) {
                // 3. Calcula dónde dibujar cada celda del mundo en la PANTALLA
                const worldX = i * effectiveCellSize;
                const worldY = j * effectiveCellSize;
                const screenX = Math.round(worldX - cameraOffsetX);
                const screenY = Math.round(worldY - cameraOffsetY);
                
                const cellColor = cellCache.get(generateDynamicKey(i, j, maxNumberCells - 1));

                if (cellColor) {
                    contextCanvas.fillStyle = cellColor;
                    contextCanvas.fillRect(screenX, screenY, intCellSize, intCellSize);
                }

                if (scale >= 2) {
                    contextCanvas.strokeStyle = "white";
                    contextCanvas.strokeRect(screenX, screenY , intCellSize, intCellSize);
                }

                // Aquí también iría la lógica para dibujar el color de la celda
                // desde tu modelo de datos (el array 2D `mundo`)
                // const color = mundo[i][j].color;
                // contextCanvas.fillStyle = color;
                // contextCanvas.fillRect(pantallaX, pantallaY, effectiveCellSize, effectiveCellSize);
            }
        }
    }

    function handleSetColor(event) {
        if (!user.logged) {
            modals.loginIsOpen = true;
            return;
        }

        if (colorSelected.name) {
            // Coordenadas (x, y)
            const coordinateX = Math.floor((cameraOffsetX + event.clientX) / effectiveCellSize);
            const coordinateY = Math.floor((cameraOffsetY + event.clientY) / effectiveCellSize);

            cellCache.set(
                generateDynamicKey(coordinateX, coordinateY, maxNumberCells - 1),
                colorSelected.name
            );

            drawMatrix();

            user.websocket.send(JSON.stringify({
                type: "update_pixel",
                data: {
                    x: coordinateX,
                    y: coordinateY,
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
        size.target = 8;
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
        size.target = 4;
    }

    function handleOnWheel(event) {
        event.preventDefault();

        oldScale = scale;

        let newScale;
        const worldXBeforeZoom = cameraOffsetX + event.clientX;
        const worldYBeforeZoom = cameraOffsetY + event.clientY;

        if (event.deltaY < 0) { // Zoom In
            newScale = scale * (1 + zoomIntensity);
        }
        else { // Zoom Out
            newScale = scale * (1 - zoomIntensity);
        }

        // Opcional pero recomendado: poner límites al zoom
        scale = Math.max(0.5, Math.min(newScale, 5)); 

        // La nueva coordenada del punto de anclaje en el mundo re-escalado
        const newWorldX = worldXBeforeZoom * (scale / oldScale);
        const newWorldY = worldYBeforeZoom * (scale / oldScale);

        // Calculamos el nuevo offset de la cámara para que ese punto quede bajo el ratón
        cameraOffsetX = Math.max(0, Math.min(newWorldX - event.clientX, worldPxWidth - canvasElement.width));
        cameraOffsetY = Math.max(0, Math.min(newWorldY - event.clientY, worldPxHeight - canvasElement.height));
            
        drawMatrix();
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
    onwheel={(e) => {handleOnWheel(e);}}
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
        background-color: gray;
    }

    #mouse-chaser {
        position: fixed;
        width: 100%;
        height: 100%;
    }
</style>