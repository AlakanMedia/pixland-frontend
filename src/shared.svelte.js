// Store para la Interfaz de Usuario (UI)
export const ui = $state({
    activeUsers: 0,
    generateImageModalIsOpen: false,
    loginModalIsOpen: false,
    profileModalIsOpen: false,
    settingsModalIsOpen: false,
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
    selectedColor: "color01",
    availablePixels: 0,
    pixelLimit: null,
    needsUpdate: false,
    showGrid: true,
    palette: "default",
});

export const colorPalette = $state({
    color01: "#262626",
    color02: "#000000",
    color03: "#808080",
    color04: "#ffffff",
    color05: "#99623d",
    color06: "#ffa3c8",
    color07: "#cf73e6",
    color08: "#800080",
    color09: "#e50000",
    color10: "#e58900",
    color11: "#e5e500",
    color12: "#96e646",
    color13: "#00be00",
    color14: "#00e6e6",
    color15: "#0088cc",
    color16: "#0000e6",
});