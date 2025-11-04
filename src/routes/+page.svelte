<script>
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/state";
    import { replaceState } from "$app/navigation";
    import { fade } from "svelte/transition";
    import { Spring } from "svelte/motion";
    import { getCellsBox } from "../pixlandApi.js";
    import { ui, user, drawingState, colorPalette, mousePosition, canvasInfo } from "../shared.svelte.js";
    import { generateDynamicKey, getUserLevel, changeColorSchema, MESSAGES_TYPES, getEffectiveCellSize } from "$lib/utils.js";
    import Widgets from "../components/Widgets.svelte";

    const API_URL = import.meta.env.VITE_API_URL

    /** @type {import('./$types').PageProps} */
    let { data } = $props(); // Recibimos la información de +page.server.js

    let pixelPaintingSound; // Referencia del sonido de pintar un pixel
    let canvasElement; // Referencia al canvas
    let contextCanvas; // Contexto del canvas

    const cellCache = new Map(); // Para guardar el valor de las celdas cacheadas
    const loadedChunks = new Set(); // Para saber si un chunk ya fue cargado
    const loadingChunks = new Set(); // Para los chunks que ya han sido guardados

    // Variables para el manejo del zoom y la configuración del mundo
    const maxNumberCells = 2048;
    const chunkSize = 128;
    const zoomStep = 0.125;
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
    let isDragging = false;
    let isMouseDown = false;
    let clickMouseX;
    let clickMouseY;

    let needsRedraw = true;
    let hashUpdateTimeout; // Para el debouncing de la actualización de la URL

    let isSelecting = false;
    let selectingArea = null;

    // Variables para controlar el puntero activo y el tap
    let activePointerType = 'mouse';
    let maxDragDistance = 0;

    let websocket;

    // Variables de estado para Pinch-to-Zoom
    const activePointers = new Map();
    let isPinching = false;
    let initialPinchDistance = 0;
    let startPinchCellScale = 0;
    let justFinishedPinching = false;

    // Para detectar si el usuario está en móvil por el tipo de puntero
    let isCoarsePointer = $state(true);
    let mql; // Para guardar la referencia a la Media Query

    onMount(async () => {
        if (window.matchMedia) {
            mql = window.matchMedia("(pointer: coarse)");
            isCoarsePointer = mql.matches; // Comprueba el valor inicial
            mql.addEventListener('change', handlePointerChange); // Añade un listener
        }

        pixelPaintingSound = new Audio();
        pixelPaintingSound.src = "sounds/pixel_painting.mp3";

        const { initialUser, initialPalette } = data;
        const hash = page.url.hash;

        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
        contextCanvas = canvasElement.getContext("2d");
        contextCanvas.imageSmoothingEnabled = false;

        if (hash) {
            const parts = hash.substring(1).split(",").map(part => Number.parseFloat(part));
            const cellX = parts[0] || 0;
            const cellY = parts[1] || 0;
            const zoom = parts[2] || null;

            if ((cellX >= 0 && cellY >= 0) && (cellX < maxNumberCells && cellY < maxNumberCells)) {
                if (zoom) {
                    canvasInfo.cellScale = Math.max(0.125, Math.min(zoom, 4));
                }

                const chunkX =  Math.floor(cellX / chunkSize);
                const chunkY =  Math.floor(cellY / chunkSize);

                const desiredCameraX = chunkX * chunkSize * effectiveCellSize;
                const desiredCameraY = chunkY * chunkSize * effectiveCellSize;

                const maxOffsetX = worldPxWidth - canvasElement.width;
                const maxOffsetY = worldPxHeight - canvasElement.height;

                canvasInfo.cameraOffsetX = Math.max(0, Math.min(desiredCameraX, maxOffsetX));
                canvasInfo.cameraOffsetY = Math.max(0, Math.min(desiredCameraY, maxOffsetY));
            }
        }


        if (initialUser) {
            if (initialPalette) {
                changeColorSchema(initialPalette);
            }

            const userLevel = getUserLevel(initialUser.pixelsPlaced);

            drawingState.availablePixels = 0;
            drawingState.pixelLimit = userLevel.pixelsLimit;
            drawingState.showGrid = initialUser.settings.show_grid;
            drawingState.playSound = initialUser.settings.play_sound;
            drawingState.palette = initialUser.settings.palette;
            drawingState.showMouseChaser = initialUser.settings.show_mouse_chaser;

            user.id = initialUser.id;
            user.name = initialUser.name;
            user.pixelsPlaced = initialUser.pixelsPlaced;
            user.createdAt = initialUser.createdAt;
            user.profileImage = initialUser.profileImage;
            user.isLoggedIn = true;
            user.disconnect = false;
        }

        requestAnimationFrame(renderLoop);
        await fetchChunk();
    });

    onDestroy(() => {
        clearTimeout(hashUpdateTimeout);

        if (mql) {
            mql.removeEventListener('change', handlePointerChange);
        }
    });

    function handlePointerChange(e) {
        isCoarsePointer = e.matches;
    }

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
                }
            }
        }

        // Dibujamos el Grid si es necesario
        if (drawingState.showGrid && canvasInfo.cellScale >= 1.375) {
            contextCanvas.strokeStyle = "rgba(128, 128, 128, 0.4)";
            contextCanvas.lineWidth = 2;
            contextCanvas.beginPath();

            // Líneas verticales
            for (let i = startCellX; i <= endCellX + 1; i++) {
                const x = Math.round(i * effectiveCellSize - canvasInfo.cameraOffsetX);
                contextCanvas.moveTo(x, 0);
                contextCanvas.lineTo(x, canvasElement.height);
            }

            // Líneas horizontales
            for (let j = startCellY; j <= endCellY + 1; j++) {
                const y = Math.round(j * effectiveCellSize - canvasInfo.cameraOffsetY);
                contextCanvas.moveTo(0, y);
                contextCanvas.lineTo(canvasElement.width, y);
            }

            contextCanvas.stroke();
        }

        if (selectingArea) {
            contextCanvas.fillStyle = "rgba(45, 128, 255, 0.2)";
            contextCanvas.strokeStyle = "rgb(45, 128, 255)";
            contextCanvas.lineWidth = 2;
        
            // 1. Determina las coordenadas de las celdas de inicio y fin reales (esquina superior-izquierda y esquina inferior-derecha)
            const minCellX = Math.min(selectingArea.startCellX, selectingArea.endCellX);
            const minCellY = Math.min(selectingArea.startCellY, selectingArea.endCellY);
            const maxCellX = Math.max(selectingArea.startCellX, selectingArea.endCellX);
            const maxCellY = Math.max(selectingArea.startCellY, selectingArea.endCellY);

            // 2. Calcula la posición inicial (x, y) en píxeles de la pantalla
            const rectScreenX = Math.round(minCellX * effectiveCellSize - canvasInfo.cameraOffsetX);
            const rectScreenY = Math.round(minCellY * effectiveCellSize - canvasInfo.cameraOffsetY);
        
            // 3. Calcula el ancho y alto en píxeles. El "+ 1" es para incluir la celda final.
            const rectWidth = (maxCellX - minCellX + 1) * effectiveCellSize;
            const rectHeight = (maxCellY - minCellY + 1) * effectiveCellSize;
        
            contextCanvas.fillRect(rectScreenX, rectScreenY, rectWidth, rectHeight);
            contextCanvas.strokeRect(rectScreenX, rectScreenY, rectWidth, rectHeight);
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

        websocket.send(JSON.stringify({
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

    function getDragThreshold() {
        switch (activePointerType) {
            case 'touch': return 14;
            case 'pen': return 8;
            default: return 4; // mouse
        }
    }

    function handleOnMouseDown(event) {
        // Para que no haga nada si presionó algún botón que no sea el izquierdo
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        // Se usa para rastrear el puntero
        activePointers.set(event.pointerId, event);

        // Comprobamos si es un "pinch"
        if (activePointers.size === 2) {
            isPinching = true;
            isDragging = false; // Cancelar cualquier arrastre pendiente
            justFinishedPinching = false;
            initialPinchDistance = getPinchDistance();
            startPinchCellScale = canvasInfo.cellScale;
            return; // Salir para no procesar como un clic/arrastre normal
        }
        
        justFinishedPinching = false;
        activePointerType = event.pointerType || 'mouse';
        clickMouseX = event.clientX;
        clickMouseY = event.clientY;
        maxDragDistance = 0;
        
        if (event.ctrlKey) {
            isSelecting = true;

            if (!selectingArea) {
                selectingArea = {};
            }

            selectingArea.startCellX = Math.floor((canvasInfo.cameraOffsetX + clickMouseX) / effectiveCellSize);
            selectingArea.startCellY = Math.floor((canvasInfo.cameraOffsetY + clickMouseY) / effectiveCellSize);
        }
        else {
            startCameraX = canvasInfo.cameraOffsetX;
            startCameraY = canvasInfo.cameraOffsetY;
        }

        isMouseDown = true;
        size.target = 10;
    }

    async function handleOnMouseMove(event) {
        if (!isMouseDown) {
            return;
        }

        // Actualizar la posición del puntero en el mapa
        if (activePointers.has(event.pointerId)) {
            activePointers.set(event.pointerId, event);
        }

        if (isPinching && activePointers.size === 2) {
            const currentDistance = getPinchDistance();
            const center = getPinchCenter();

            // 1. Calcular la escala objetivo basada en la proporción del gesto
            const scaleRatio = currentDistance / initialPinchDistance;
            let targetScale = startPinchCellScale * scaleRatio;

            // 2. Cuantizar la escala a los pasos permitidos (múltiplos de 0.125)
            //    Esto cumple tu restricción de que (16 * 0.125 * N) siempre sea un entero.
            let newQuantizedScale = Math.round(targetScale / zoomStep) * zoomStep;

            // 3. Limitar (clamp) la escala a los valores min/max
            let newCellScale = Math.max(0.125, Math.min(newQuantizedScale, 4));

            // 4. Aplicar el zoom
            await applyZoom(newCellScale, center.x, center.y);
        }
        else if (!isPinching) { // Solo procesar arrastre si NO estamos pellizcando
            const deltaX = event.clientX - clickMouseX;
            const deltaY = event.clientY - clickMouseY;
            const dragDistance = Math.hypot(deltaX, deltaY);
            maxDragDistance = Math.max(maxDragDistance, dragDistance);

            const threshold = getDragThreshold();

            if (dragDistance > threshold) {
                isDragging = true;

                if (isSelecting) {
                    document.body.style.cursor = "crosshair";
                    selectingArea.endCellX = Math.floor((canvasInfo.cameraOffsetX + event.clientX) / effectiveCellSize);
                    selectingArea.endCellY = Math.floor((canvasInfo.cameraOffsetY + event.clientY) / effectiveCellSize);

                    needsRedraw = true;
                }
                else {
                    document.body.style.cursor = "move";
                    canvasInfo.cameraOffsetX = Math.max(0, Math.min(startCameraX - deltaX, worldPxWidth - canvasElement.width));
                    canvasInfo.cameraOffsetY = Math.max(0, Math.min(startCameraY - deltaY, worldPxHeight - canvasElement.height));

                    debounceUpdateUrlHash();
                    await fetchChunk();
                }
            }
        }
    }

function handleOnMouseUp(event) {
        // Eliminar puntero del rastreador
        activePointers.delete(event.pointerId);

        // Comprobar si el "pinch" terminó
        if (isPinching && activePointers.size < 2) {
            isPinching = false;
            justFinishedPinching = true;
            initialPinchDistance = 0;
            startPinchCellScale = 0;

            if (activePointers.size === 1) {
                const remainingPointer = activePointers.values().next().value;
                clickMouseX = remainingPointer.clientX;
                clickMouseY = remainingPointer.clientY;
                startCameraX = canvasInfo.cameraOffsetX;
                startCameraY = canvasInfo.cameraOffsetY;
                maxDragDistance = 0;
            }
        }

        if (activePointers.size === 0) {
            isMouseDown = false; // Reseteamos la bandera principal
            size.target = 6;     // Reseteamos el "chaser"

            // Solo ejecutar la lógica de "tap" o "drag-end" si NO acabamos de hacer pinch
            if (!justFinishedPinching) { 
                const finalDeltaX = event.clientX - clickMouseX;
                const finalDeltaY = event.clientY - clickMouseY;
                const finalDistance = Math.hypot(finalDeltaX, finalDeltaY);
                const threshold = getDragThreshold();
                const isClickLike = finalDistance <= threshold;

                if (!isClickLike) { // Fin de arrastre
                    isDragging = false;

                    if (isSelecting) {
                        isSelecting = false;
                    }

                    document.body.style.cursor = "default";
                }
                else { // Es un "tap"
                    if (selectingArea) {
                        selectingArea = null;
                        needsRedraw = true;
                    }
                    else {
                        if (!user.isLoggedIn) {
                            // Evita que el click "fantasma" cierre el modal
                            event.preventDefault();
                            event.stopPropagation();

                            ui.loginModalIsOpen = true;
                        }
                        else if (websocket && canvasInfo.cellScale >= 0.75 && drawingState.availablePixels > 0) {
                            const pixelPlaced = handleSetColor(event);

                            if (pixelPlaced) {
                                drawingState.availablePixels--;

                                if (drawingState.playSound) {
                                    pixelPaintingSound.currentTime = 0; // Reiniciamos el sonido
                                    pixelPaintingSound.play().catch(error => {
                                        console.error("Error playing sound:", error); // Reproducimos el sonido
                                    });
                                }
                            }
                        }
                    }
                }
            }
            else{
                isDragging = false;
                document.body.style.cursor = "default";
            }
        }
    }

    /**
     * Calcula la distancia (hipotenusa) entre dos punteros.
     */
    function getPinchDistance() {
        const pointers = Array.from(activePointers.values());
        const dx = pointers[0].clientX - pointers[1].clientX;
        const dy = pointers[0].clientY - pointers[1].clientY;
        return Math.hypot(dx, dy);
    }

    /**
     * Calcula el punto central entre dos punteros.
     */
    function getPinchCenter() {
        const pointers = Array.from(activePointers.values());
        const x = (pointers[0].clientX + pointers[1].clientX) / 2;
        const y = (pointers[0].clientY + pointers[1].clientY) / 2;
        return { x, y };
    }

    /**
     * Función refactorizada para aplicar el zoom y recalcular la vista.
     * @param {number} newScale - El nuevo nivel de escala (ya validado y cuantizado)
     * @param {number} anchorX - El punto X en la pantalla sobre el que se hace zoom
     * @param {number} anchorY - El punto Y en la pantalla sobre el que se hace zoom
     */
    async function applyZoom(newScale, anchorX, anchorY) {
        // 1. Validar que la escala haya cambiado
        if (newScale === canvasInfo.cellScale) {
            return;
        }

        // 2. Guardar escala anterior y calcular punto en el "mundo"
        oldCellScale = canvasInfo.cellScale;
        const worldXBeforeZoom = canvasInfo.cameraOffsetX + anchorX;
        const worldYBeforeZoom = canvasInfo.cameraOffsetY + anchorY;

        // 3. Asignar la nueva escala
        canvasInfo.cellScale = newScale; 

        // 4. Calcular la nueva posición "mundo" del punto de anclaje
        const newWorldX = worldXBeforeZoom * (canvasInfo.cellScale / oldCellScale);
        const newWorldY = worldYBeforeZoom * (canvasInfo.cellScale / oldCellScale);

        // 5. Calcular el nuevo offset de la cámara
        canvasInfo.cameraOffsetX = Math.max(0, Math.min(newWorldX - anchorX, worldPxWidth - canvasElement.width));
        canvasInfo.cameraOffsetY = Math.max(0, Math.min(newWorldY - anchorY, worldPxHeight - canvasElement.height));

        // 6. Pedir redibujado y actualizar URL
        debounceUpdateUrlHash();
        await fetchChunk();
    }

    async function handleOnWheel(event) {
        event.preventDefault();

        let newCellScale;
        const anchorX = event.clientX;
        const anchorY = event.clientY;

        if (event.deltaY < 0) { // Zoom In
            newCellScale = canvasInfo.cellScale + zoomStep;
        }
        else { // Zoom Out
            newCellScale = canvasInfo.cellScale - zoomStep;
        }

        // Limitar (clamp) la escala
        const clampedScale = Math.max(0.125, Math.min(newCellScale, 4)); 

        // Llamar a la función refactorizada
        await applyZoom(clampedScale, anchorX, anchorY);
    }

    function handleOnPointerCancel(event) {
        // Eliminar puntero del rastreador
        activePointers.delete(event.pointerId);

        // Comprobar si el "pinch" terminó
        if (isPinching && activePointers.size < 2) {
            isPinching = false;
            initialPinchDistance = 0;
            startPinchCellScale = 0;
        }

        // Comprobar si es el *último* puntero en levantarse
        if (activePointers.size === 0) {
            isMouseDown = false; // Reseteamos la bandera principal
            size.target = 6;     // Reseteamos el "chaser"
        }

        // Lógica de reseteo original del usuario
        isDragging = false;
        isSelecting = false;
        selectingArea = null;
        document.body.style.cursor = "default";
    }

    function updateUrlHash() {
        // 1. Obtiene la celda en la esquina superior izquierda de la vista
        const topCellX = Math.floor(canvasInfo.cameraOffsetX / effectiveCellSize);
        const topCellY = Math.floor(canvasInfo.cameraOffsetY / effectiveCellSize);
        
        // 2. Calcula a qué chunk pertenece esa celda
        const chunkX = Math.floor(topCellX / chunkSize);
        const chunkY = Math.floor(topCellY / chunkSize);
        
        // 3. Calcula la coordenada de la celda inicial de ese chunk
        const targetCellX = chunkX * chunkSize;
        const targetCellY = chunkY * chunkSize;

        // 4. Obtenemos el nivel del zoom
        const zoomLevel = canvasInfo.cellScale;
        
        // 4. Genera el nuevo hash y lo compara con el actual para evitar actualizaciones innecesarias
        const newHash = `#${targetCellX},${targetCellY},${zoomLevel}`;
        if (window.location.hash !== newHash) {
            // Usamos replaceState para no "ensuciar" el historial del navegador
            replaceState(newHash, {})
        }
    }
    
    function debounceUpdateUrlHash() {
        clearTimeout(hashUpdateTimeout); // Cancela el temporizador anterior
        // Inicia un nuevo temporizador. Si el usuario se sigue moviendo, se cancelará y reiniciará.
        hashUpdateTimeout = setTimeout(updateUrlHash, 300); // 300ms de espera
    }

    function disconnectWebSocket() {
        if (websocket) {
            console.log("Closing existing WebSocket connection...");

            websocket.onclose = null; // Evitamos que el evento onclose se dispare al cerrar manualmente
            websocket.close();
            websocket = null;
        }
    }

    function connectWebSocket() {
        disconnectWebSocket();

        console.log(`Connecting WebSocket (isLoggedIn: ${user.isLoggedIn})...`);
        websocket = new WebSocket(`${API_URL}/ws`);

        websocket.onopen = () => {
            console.log("WebSocket connection successfully established.");
        };

        websocket.onclose = () => {
            console.log("WebSocket connection closed by server.");
            websocket = null;

            if (user.isLoggedIn) {
                user.disconnect = true;
            }
            // Opcional: Aquí se podría intentar reconectar si el cierre no fue intencional
        };

        websocket.onmessage = (event) => {
            const wsData = JSON.parse(event.data);

            if (wsData.type === "update_pixel") {
                cellCache.set(
                    generateDynamicKey(wsData.data.x, wsData.data.y, maxNumberCells - 1),
                    wsData.data.color
                );
                needsRedraw = true;
            } else if (wsData.type === "update_active_users") {
                ui.activeUsers = wsData.data.active_users;
            }
        };
    }

    $effect(() => {
        if (drawingState.needsUpdate) {
            needsRedraw = true;
            drawingState.needsUpdate = false;
        }
    });

    $effect(() => {
        // "Escuchamos" el estado de login del usuario.
        // Esto se ejecutará la primera vez y cada vez que `user.isLoggedIn` cambie.
        user.isLoggedIn; // Hacemos que Svelte rastree esta propiedad
    
        // Conectamos (esto internamente ya cierra cualquier conexión previa)
        connectWebSocket();

        // La función de 'cleanup' del $effect es crucial.
        // Svelte la ejecutará antes de volver a correr el efecto,
        // o cuando el componente se desmonte.
        return () => {
            disconnectWebSocket();
        };
    });
</script>

<svelte:head>
	<title>Pixland</title>
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
    onpointerdown={(e) => {handleOnMouseDown(e);}}
    onpointermove={async (e) => {handleOnMouseMove(e);}}
    onpointerup={(e) => {handleOnMouseUp(e);}}
    onpointercancel={(e) => {handleOnPointerCancel(e);}}
    onwheel={async (e) => {handleOnWheel(e);}}
>
    {#if drawingState.showMouseChaser && canvasInfo.cellScale >= 0.75 && !isCoarsePointer}
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
    #matrix,
    #mouse-chaser {
        position: fixed;
        width: 100%;
        height: 100%;
        touch-action: none;
    }
</style>