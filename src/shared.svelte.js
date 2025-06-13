export const store = $state({
    colorName: "",
    loginIsOpen: false,
    userLogged: false,
});

export const alert = $state({
    show: false,
    type: undefined,
    title: undefined,
    message: undefined,
});