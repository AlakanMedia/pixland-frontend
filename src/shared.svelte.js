import { Spring } from "svelte/motion";

export const canvasInfo = $state({
    cellScale: 1,
    baseCellSize: 16,
    cameraOffsetX: 0,
    cameraOffsetY: 0,
});

export const mousePosition = $state({
    coords: new Spring({x:50, y: 50}, {stiffness: 0.1, damping: 0.25}),
});

// Store para la Interfaz de Usuario (UI)
export const ui = $state({
    activeUsers: 0,
    generateImageModalIsOpen: false,
    palettesModalIsOpen: false,
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
    name: null,
    pixelsPlaced: null,
    createdAt: null,
    isLoggedIn: false,
    disconnect: true,
    profileImage: null,
});

// Store para la funcionalidad del Canvas/Matrix
export const drawingState = $state({
    selectedColor: "c01",
    availablePixels: 0,
    pixelLimit: null,
    needsUpdate: false,
    showGrid: true,
    playSound: true,
    showMouseChaser: true,
    palette: null
});

export const colorPalette = $state({
    c01: "#262626",
    c02: "#000000",
    c03: "#B0B0B0",
    c04: "#ffffff",
    c05: "#99623d",
    c06: "#ffa3c8",
    c07: "#cf73e6",
    c08: "#800080",
    c09: "#e50000",
    c10: "#e58900",
    c11: "#e5e500",
    c12: "#96e646",
    c13: "#00be00",
    c14: "#00e6e6",
    c15: "#0088cc",
    c16: "#0000e6",
});