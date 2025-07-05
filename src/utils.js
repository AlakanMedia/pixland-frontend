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

/**
 * Genera una llave numérica única para un par de enteros (x, y)
 * dado un valor máximo para el rango. El valor máximo debe ser
 * una potencia de 2 menos 1 (ej: 1023, 2047, 4095).
 *
 * @param {number} x El primer número.
 * @param {number} y El segundo número.
 * @param {number} valorMaximo El valor máximo que pueden tomar x e y (ej: 1023).
 * @returns {number} Un número entero único que representa el par (x, y).
 */
export function generateDynamicKey(x, y, maxValue) {
  // 1. Calcular los bits necesarios para el rango.
  const bits = Math.log2(maxValue + 1);

  // 2. Validar que el valor máximo es correcto (una potencia de 2 menos 1).
  if (!Number.isInteger(bits)) {
    throw new Error("maxValue must be of the form (2^n - 1), such as 1023 or 2047.");
  }

  // 3. Validar que x e y están dentro del rango.
  if (x < 0 || x > maxValue || y < 0 || y > maxValue) {
    console.log(x, y);
    throw new Error(`Both numbers must be in the range of 0 to ${maxValue}.`);
  }

  // 4. Realizar el desplazamiento de bits dinámicamente.
  return (x << bits) | y;
}