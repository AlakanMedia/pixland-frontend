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

export function formatToLocalDate(utcDateString) {
    if (utcDateString === "...") {
        return utcDateString;
    }

    const fixedUtcString = utcDateString.endsWith('Z') ? utcDateString : utcDateString + 'Z';
    const date = new Date(fixedUtcString);

    return date.toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
    });
}