<script>
    import { onMount, onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import { Spring } from "svelte/motion";
    import { getCellsBox } from "../pixlandApi.js";
    import { ui, user, drawingState, colorPalette, mousePosition, canvasInfo } from "../shared.svelte.js";
    import { generateDynamicKey, getUserLevel, changeColorSchema, MESSAGES_TYPES, getEffectiveCellSize } from "$lib/utils.js";
    import Widgets from "../components/Widgets.svelte";

    const API_URL = import.meta.env.VITE_API_URL

    /** @type {import('./$types').PageProps} */
    let { data } = $props(); // Recibimos la información de +page.server.js

    let canvasElement; // Referencia al canvas
    let contextCanvas; // Contexto del canvas

    const cellCache = new Map(); // Para guardar el valor de las celdas cacheadas
    const loadedChunks = new Set(); // Para saber si un chunk ya fue cargado
    const loadingChunks = new Set(); // Para los chunks que ya han sido guardados

    // Variables para el manejo del zoom y la configuración del mundo
    const maxNumberCells = 2048;
    const chunkSize = 64;
    const zoomStep = 0.25;
    let oldCellScale; // Scala antes del haber hecho zoom in o zoom out
    let effectiveCellSize = $derived(getEffectiveCellSize());
    let worldPxWidth = $derived(effectiveCellSize * maxNumberCells);
    let worldPxHeight = $derived(effectiveCellSize * maxNumberCells);

    // Variables de configuración del mouse chaser
    let size = new Spring(6);

    let startCameraX = 0; // Para saber la posición previa de la cámara antes del arrastre
    let startCameraY = 0; // Para saber la posición previa de la cámara antes del arrastre

    // Variables para el clic y arrastre
    const dragThreshold = 4;
    let isDragging = $state(false);
    let isMouseDown = false;
    let clickMouseX;
    let clickMouseY;

    let needsRedraw = true;

    onMount(async () => {
        const { initialUser, initialPalette } = data;

        if (initialUser) {
            if (initialPalette) {
                changeColorSchema(initialPalette);
            }

            const userLevel = getUserLevel(initialUser.pixelsPlaced);

            drawingState.availablePixels = 0;
            drawingState.pixelLimit = userLevel.pixelsLimit;
            drawingState.showGrid = initialUser.settings.show_grid;
            drawingState.palette = initialUser.settings.palette;
            drawingState.showMouseChaser = initialUser.settings.show_mouse_chaser;

            user.id = initialUser.id;
            user.name = initialUser.name;
            user.pixelsPlaced = initialUser.pixelsPlaced;
            user.createdAt = initialUser.createdAt;
            user.isLoggedIn = true;
        }

        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
        contextCanvas = canvasElement.getContext("2d", { alpha: false });
        contextCanvas.imageSmoothingEnabled = false;

        requestAnimationFrame(renderLoop);
        await fetchChunk();

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

                needsRedraw = true;
            }
            else if (wsData.type === "update_active_users") {
                ui.activeUsers = wsData.data.active_users;
            }
        };
    });

    onDestroy(() => {
        if (user.websocket) {
            user.websocket.close();
            user.websocket = null;
        }
    });

    function renderLoop() {
        if (needsRedraw) {
            drawMatrix();
            needsRedraw = false; // Reseteamos la bandera hasta que algo vuelva a cambiar
        }

        // Le pedimos al navegador que vuelva a llamar a esta función en el próximo frame de animación
        requestAnimationFrame(renderLoop);
    }

    async function fetchChunk() {
        const xCellUpperLeft = Math.floor(canvasInfo.cameraOffsetX / effectiveCellSize);
        const yCellUpperLeft = Math.floor(canvasInfo.cameraOffsetY / effectiveCellSize);
        const xCellBottomRight = Math.floor((canvasInfo.cameraOffsetX + canvasElement.width) / effectiveCellSize);
        const yCellBottomRight = Math.floor((canvasInfo.cameraOffsetY + canvasElement.height) / effectiveCellSize);

        const xChunkUpperLeft = Math.floor(xCellUpperLeft / chunkSize);
        const yChunkUpperLeft = Math.floor(yCellUpperLeft / chunkSize);
        const xChunkBottomRight = Math.floor(xCellBottomRight / chunkSize);
        const yChunkBottomRight = Math.floor(yCellBottomRight / chunkSize);

        const promises = [];

        // 1. Identifica todos los chunks que necesitan ser cargados
        for (let i = xChunkUpperLeft; i <= xChunkBottomRight; i++) {
            for (let j = yChunkUpperLeft; j <= yChunkBottomRight; j++) {
                const chunkString = `${i},${j}`;

                // Si ya está cargado o se está cargando, sáltalo.
                if (loadedChunks.has(chunkString) || loadingChunks.has(chunkString)) {
                    continue;
                }

                // 2. Marca el chunk como "cargando"
                loadingChunks.add(chunkString);

                // 3. Prepara la promesa para obtener los datos del chunk
                const promise = (async () => {
                    const topLeft = { x: i * chunkSize, y: j * chunkSize };
                    const bottomRight = { x: topLeft.x + chunkSize - 1, y: topLeft.y + chunkSize - 1 };

                    const cellBox = await getCellsBox([topLeft.x, topLeft.y], [bottomRight.x, bottomRight.y]);

                    if (cellBox.state === MESSAGES_TYPES.SUCCESS) {
                        const cells = cellBox.data.info;
                        for (let k = 0; k < cells.length; k++) {
                            const cellInfo = cells[k];
                            const mapKey = generateDynamicKey(
                                cellInfo.location.x,
                                cellInfo.location.y,
                                maxNumberCells - 1
                            );
                            cellCache.set(mapKey, cellInfo.color);
                        }
                    }

                    // 4. Una vez terminada la petición, actualiza los sets
                    loadingChunks.delete(chunkString);
                    loadedChunks.add(chunkString); // Ahora sí se marca como cargado
                })();

                promises.push(promise);
            }
        }

        // 5. Si se añadieron nuevos chunks a la cola de carga, dibuja el canvas para mostrarlos en negro
        if (promises.length > 0) {
            needsRedraw = true;
        }

        // 6. Espera a que todas las peticiones terminen
        await Promise.all(promises);

        // 7. Vuelve a dibujar el canvas con los datos de los chunks ya cargados
        needsRedraw = true;
    }

    function drawMatrix() {
        contextCanvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
        contextCanvas.fillStyle = colorPalette["c01"];
        contextCanvas.fillRect(0, 0, canvasElement.width, canvasElement.height);

        const startCellX = Math.floor(canvasInfo.cameraOffsetX / effectiveCellSize);
        const startCellY = Math.floor(canvasInfo.cameraOffsetY / effectiveCellSize);
        const endCellX = Math.min(Math.floor((canvasInfo.cameraOffsetX + canvasElement.width) / effectiveCellSize), maxNumberCells - 1);
        const endCellY = Math.min(Math.floor((canvasInfo.cameraOffsetY + canvasElement.height) / effectiveCellSize), maxNumberCells - 1);

        for (let i = startCellX; i <= endCellX; i++) {
            for (let j = startCellY; j <= endCellY; j++) {
                const worldX = i * effectiveCellSize;
                const worldY = j * effectiveCellSize;
                const screenX = Math.round(worldX - canvasInfo.cameraOffsetX);
                const screenY = Math.round(worldY - canvasInfo.cameraOffsetY);

                // Determinar a qué chunk pertenece la celda actual
                const chunkX = Math.floor(i / chunkSize);
                const chunkY = Math.floor(j / chunkSize);
                const chunkString = `${chunkX},${chunkY}`;

                if (loadingChunks.has(chunkString)) {
                    contextCanvas.fillStyle = colorPalette["c02"]
                    contextCanvas.fillRect(screenX, screenY, effectiveCellSize, effectiveCellSize);
                } else {
                    const cellColor = cellCache.get(generateDynamicKey(i, j, maxNumberCells - 1));

                    if (cellColor) {
                        contextCanvas.fillStyle = colorPalette[cellColor]
                        contextCanvas.fillRect(screenX, screenY, effectiveCellSize, effectiveCellSize);
                    }

                    if (drawingState.showGrid && canvasInfo.cellScale >= 2) {
                        contextCanvas.strokeStyle = colorPalette["c04"];
                        contextCanvas.strokeRect(screenX, screenY, effectiveCellSize, effectiveCellSize);
                    }
                }
            }
        }
    }

    function handleSetColor(event) {
        // Coordenadas (x, y)
        const coordinateX = Math.floor((canvasInfo.cameraOffsetX + event.clientX) / effectiveCellSize);
        const coordinateY = Math.floor((canvasInfo.cameraOffsetY + event.clientY) / effectiveCellSize);
        const dynamicKey = generateDynamicKey(coordinateX, coordinateY, maxNumberCells - 1);

        const previousColor = cellCache.get(dynamicKey);

        if ((previousColor === undefined && drawingState.selectedColor === "c01") || previousColor === drawingState.selectedColor) {
            return false;
        }

        cellCache.set(dynamicKey, drawingState.selectedColor);

        needsRedraw = true;

        user.websocket.send(JSON.stringify({
            type: "update_pixel",
            data: {
                x: coordinateX,
                y: coordinateY,
                color: drawingState.selectedColor,
            },
        }));
        // TODO: Debo verificar si la api devuelve 401 para marcar el store.userLogged como falso

        return true;
    }

    function handleOnMouseDown(event) {
        // Para que no haga nada si presionó algún botón que no sea el izquierdo
        if (event.button !== 0) {
            return;
        }

        clickMouseX = event.clientX;
        clickMouseY = event.clientY;
        startCameraX = canvasInfo.cameraOffsetX;
        startCameraY = canvasInfo.cameraOffsetY;
        isMouseDown = true;
        size.target = 10;
    }

    async function handleOnMouseMove(event) {
        // Verificamos que el usuario tenga el clic izquierdo presionado
        if (isMouseDown) {
            const deltaX = event.clientX - clickMouseX;
            const deltaY = event.clientY - clickMouseY;
            const dragDistance = Math.hypot(deltaX, deltaY);

            if (dragDistance > dragThreshold) {
                document.body.style.cursor = "move";
                isDragging = true;

                // Solución de los límites del mapa más corta, para la versión más larga
                // que hice tengo que ir a ver el pantallazo que tomé
                canvasInfo.cameraOffsetX = Math.max(0, Math.min(startCameraX - deltaX, worldPxWidth - canvasElement.width));
                canvasInfo.cameraOffsetY = Math.max(0, Math.min(startCameraY - deltaY, worldPxHeight - canvasElement.height));

                await fetchChunk();
            }
        }
    }

    function handleOnMouseUp(event) {
        if (isDragging) {
            document.body.style.cursor = "default";
        }
        else {
            if (!user.isLoggedIn) {
                ui.loginModalIsOpen = true;
            }
            else {
                if (canvasInfo.cellScale >= 1 && drawingState.availablePixels > 0) {
                    const pixelPlaced = handleSetColor(event);

                    if (pixelPlaced) {
                        drawingState.availablePixels--;
                    }
                }
            }
        }

        isDragging = false;
        isMouseDown = false;
        size.target = 6;
    }

    async function handleOnWheel(event) {
        event.preventDefault();

        oldCellScale = canvasInfo.cellScale;

        let newCellScale;
        const worldXBeforeZoom = canvasInfo.cameraOffsetX + event.clientX;
        const worldYBeforeZoom = canvasInfo.cameraOffsetY + event.clientY;

        if (event.deltaY < 0) { // Zoom In
            newCellScale = canvasInfo.cellScale + zoomStep;
        }
        else { // Zoom Out
            newCellScale = canvasInfo.cellScale - zoomStep;
        }

        // Opcional pero recomendado: poner límites al zoom
        canvasInfo.cellScale = Math.max(0.25, Math.min(newCellScale, 4)); 

        // La nueva coordenada del punto de anclaje en el mundo re-escalado
        const newWorldX = worldXBeforeZoom * (canvasInfo.cellScale / oldCellScale);
        const newWorldY = worldYBeforeZoom * (canvasInfo.cellScale / oldCellScale);

        // Calculamos el nuevo offset de la cámara para que ese punto quede bajo el ratón
        canvasInfo.cameraOffsetX = Math.max(0, Math.min(newWorldX - event.clientX, worldPxWidth - canvasElement.width));
        canvasInfo.cameraOffsetY = Math.max(0, Math.min(newWorldY - event.clientY, worldPxHeight - canvasElement.height));
            
        await fetchChunk();
    }

    $effect(() => {
        if (drawingState.needsUpdate) {
            needsRedraw = true;
            drawingState.needsUpdate = false;
        }
    });
</script>

<svelte:head>
	<title>PixLand</title>
    <meta name="description" content="Free online pixel art game where you can paint and create digital artwork on a shared canvas. Download your pixel creations, customize color palettes, and join a collaborative pixel art community. Create, share, and explore pixel art in real-time." />
</svelte:head>
<svelte:window onresize={() => {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;

        needsRedraw = true;
    }}
/>
<svelte:body
    onmousemove={(e) => {
        mousePosition.coords.target = {x: e.clientX, y: e.clientY};
    }}
/>

<canvas id="matrix" bind:this={canvasElement}></canvas>
<svg
    id="mouse-chaser"
    role="presentation"
    onmousedown={(e) => {handleOnMouseDown(e);}}
    onmousemove={async (e) => {handleOnMouseMove(e);}}
    onmouseup={(e) => {handleOnMouseUp(e);}}
    onwheel={async (e) => {handleOnWheel(e);}}
>
    {#if drawingState.showMouseChaser && canvasInfo.cellScale >= 1}
	    <circle
	        cx={mousePosition.coords.current.x}
	    	cy={mousePosition.coords.current.y}
	    	r={size.current}
            style={`fill: rgb(from ${colorPalette[drawingState.selectedColor]} r g b / 0.4); stroke: white; stroke-width: 2;`}
            transition:fade
	    />
    {/if}
</svg>
<Widgets/>

<style>
    #matrix {
        position: fixed;
        width: 100%;
        height: 100%;
    }

    #mouse-chaser {
        position: fixed;
        width: 100%;
        height: 100%;
    }
</style>