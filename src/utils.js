import { alertCard } from "./shared.svelte.js";

export function isValidEmail(emailToValid) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailToValid);
}

export function showAlert(type, title, message) {
    alertCard.type = type;
    alertCard.title = title;
    alertCard.message = message;
    alertCard.show = true;
}

export function decodeJWT(token) {
    // Dividir el token en sus partes
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
    }

    // Decodificar el encabezado y el cuerpo
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    return { header, payload };
}