export const colorSelected = $state({
    name: "--color01",
});

export const availablePixels = $state({
    num: null,
    limit: null,
});

export const modals = $state({
    loginIsOpen: false,
    profileIsOpen: false,
});

export const user = $state({
    id: "",
    logged: false,
    websocket: null,
});

export const appInfo = $state({
    activeUsers: 0,
});

export const alertCard = $state({
    show: false,
    type: "",
    title: "",
    message: "",
});

export const updateMatrix = $state({
    update: false,
});