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

export const user = $state({
    id: null,
    isLoggedIn: false,
    websocket: null,
});

export const drawingState = $state({
    selectedColor: "--color01",
    availablePixels: 0,
    pixelLimit: null,
    needsUpdate: false,
});