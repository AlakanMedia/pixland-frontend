import { ui, colorPalette, canvasInfo } from "../shared.svelte.js";

export function isValidEmail(emailToValid) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(emailToValid);
}

export function showAlert(type, title, message) {
  ui.alert.type = type;
  ui.alert.title = title;
  ui.alert.message = message;
  ui.alert.show = true; 
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

export function getUserLevel(pixelsPlaced) {
  if (pixelsPlaced >= 0 && pixelsPlaced <= 1000) {
    return {
      level: "Pixel Peasant",
      message: "You've placed your first humble dot.",
      pixelsLimit: 6
    };
  }
  else if (pixelsPlaced > 1000 && pixelsPlaced <= 4000) {
    return {
      level: "Color Dabbler",
      message: "Starting to make a mess — in style.",
      pixelsLimit: 7
    };
  }
  else if (pixelsPlaced > 4000 && pixelsPlaced <= 10000) {
    return {
      level: "Dot Dropper",
      message: "You're making tiny waves in the canvas ocean.",
      pixelsLimit: 8
    };
  }
  else if (pixelsPlaced > 10000 && pixelsPlaced <= 15000) {
    return {
      level: "Hue Hustler",
      message: "You've got an eye for color and no shame in clicking.",
      pixelsLimit: 9
    };
  }
  else if (pixelsPlaced > 15000 && pixelsPlaced <= 25000) {
    return {
      level: "Shade Slinger",
      message: "Flipping palettes like a cowboy flips coins.",
      pixelsLimit: 10
    };
  }
  else if (pixelsPlaced > 25000 && pixelsPlaced <= 50000) {
    return {
      level: "Grid Graffiti",
      message: "Who needs permission to paint?",
      pixelsLimit: 11
    };
  }
  else if (pixelsPlaced > 50000 && pixelsPlaced <= 75000) {
    return {
      level: "Palette Pioneer",
      message: "Blazing trails through pixels unknown.",
      pixelsLimit: 12
    };
  }
  else if (pixelsPlaced > 75000 && pixelsPlaced <= 100000) {
    return {
      level: "Canvas Commander",
      message: "You don't paint pixels — you order them around.",
      pixelsLimit: 13
    };
  }
  else if (pixelsPlaced > 100000 && pixelsPlaced <= 150000) {
    return {
      level: "Bitmaster",
      message: "The binary bows to your will.",
      pixelsLimit: 14
    };
  }
  else if (pixelsPlaced > 150000 && pixelsPlaced <= 200000) {
    return {
      level: "Pixel Picasso",
      message: "Your mess is starting to look like art.",
      pixelsLimit: 15
    };
  }
  else if (pixelsPlaced > 200000 && pixelsPlaced <= 300000) {
    return {
      level: "Color Overlord",
      message: "You control more shades than the sunset.",
      pixelsLimit: 16
    };
  }
  else if (pixelsPlaced > 300000 && pixelsPlaced <= 500000) {
    return {
      level: "The Dithering Duke",
      message: "Smoothing edges like a royal.",
      pixelsLimit: 18
    };
  }
  else if (pixelsPlaced > 500000 && pixelsPlaced <= 750000) {
    return {
      level: "Hue Sorcerer",
      message: "Summoning colors with a click and a curse.",
      pixelsLimit: 20
    };
  }
  else if (pixelsPlaced > 750000 && pixelsPlaced <= 1000000) {
    return {
      level: "Render Ruler",
      message: "The canvas is your kingdom. The cursor is your crown.",
      pixelsLimit: 22
    };
  }
  else if (pixelsPlaced > 1000000 && pixelsPlaced <= 2000000) {
    return {
      level: "Pixel Prophet",
      message: "You see the final image before it even exists.",
      pixelsLimit: 24
    };
  }
  else if (pixelsPlaced > 2000000) {
    return {
      level: "The Glitch God",
      message: "Reality bends at the power of your pixels.",
      pixelsLimit: 30
    };
  }
}

export function padWithZeros(num, length) {
  return String(num).padStart(length, '0');
}

export function changeColorSchema(palette) {
  for (let varName in palette) {
    colorPalette[varName] = palette[varName];
  }
}

export function getEffectiveCellSize() {
    return canvasInfo.baseCellSize * canvasInfo.cellScale;
};

export const MESSAGES_TYPES = Object.freeze({
  SUCCESS: Symbol(),
  INFO: Symbol(),
  ERROR: Symbol(),
});