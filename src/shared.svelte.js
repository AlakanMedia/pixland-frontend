// Store para la Interfaz de Usuario (UI)
export const ui = $state({
    activeUsers: 0,
    loginModalIsOpen: false,
    profileModalIsOpen: false,
    alert: {
        show: false,
        type: "", // "success", "error", "info"
        title: "",
        message: "",
    },
});

// Store para el usuario
export const user = $state({
    id: null,
    isLoggedIn: false,
    websocket: null,
});

// Store para la funcionalidad del Canvas/Matrix
export const drawingState = $state({
    selectedColor: "--color01",
    availablePixels: 0,
    pixelLimit: null,
    needsUpdate: false,
});