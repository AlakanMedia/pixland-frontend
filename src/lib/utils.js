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

const LEVELS_CONFIG = [
  {
    name: "Pixel Peasant",
    minPixels: 0,
    message: "You've placed your first humble dot.",
    pixelLimit: 6,
    src: "images/profiles/pixel-peasant.png"
  },
  {
    name: "Color Dabbler",
    minPixels: 500,
    message: "Starting to make a mess — in style.",
    pixelLimit: 7,
    src: "images/profiles/color-dabbler.png"
  },
  {
    name: "Dot Dropper",
    minPixels: 1500,
    message: "You're making tiny waves in the canvas ocean.",
    pixelLimit: 8,
    src: "images/profiles/dot-dropper.png"
  },
  {
    name: "Hue Hustler",
    minPixels: 3000,
    message: "You've got an eye for color and no shame in clicking.",
    pixelLimit: 9,
    src: "images/profiles/hue-hustler.png"
  },
  {
    name: "Shade Slinger",
    minPixels: 6000,
    message: "Flipping palettes like a cowboy flips coins.",
    pixelLimit: 10,
    src: "images/profiles/shade-slinger.png"
  },
  {
    name: "Grid Graffiti",
    minPixels: 10000,
    message: "Who needs permission to paint?",
    pixelLimit: 11,
    src: "images/profiles/grid-graffiti.png"
  },
  {
    name: "Palette Pioneer",
    minPixels: 15000,
    message: "Blazing trails through pixels unknown.",
    pixelLimit: 12,
    src: "images/profiles/palette-pioneer.png"
  },
  {
    name: "Canvas Commander",
    minPixels: 25000,
    message: "You don't paint pixels — you order them around.",
    pixelLimit: 13,
    src: "images/profiles/canvas-commander.png"
  },
  {
    name: "Bitmaster",
    minPixels: 40000,
    message: "The binary bows to your will.",
    pixelLimit: 14,
    src: "images/profiles/bitmaster.png"
  },
  {
    name: "Pixel Picasso",
    minPixels: 70000,
    message: "Your mess is starting to look like art.",
    pixelLimit: 15,
    src: "images/profiles/pixel-picasso.png"
  },
  {
    name: "Color Overlord",
    minPixels: 120000,
    message: "You control more shades than the sunset.",
    pixelLimit: 16,
    src: "images/profiles/color-overlord.png"
  },
  {
    name: "The Dithering Duke",
    minPixels: 200000,
    message: "Smoothing edges like a royal.",
    pixelLimit: 18,
    src: "images/profiles/dithering-duke.png"
  },
  {
    name: "Hue Sorcerer",
    minPixels: 350000,
    message: "Summoning colors with a click and a curse.",
    pixelLimit: 20,
    src: "images/profiles/hue-sorcerer.png"
  },
  {
    name: "Render Ruler",
    minPixels: 500000,
    message: "The canvas is your kingdom. The cursor is your crown.",
    pixelLimit: 22,
    src: "images/profiles/render-ruler.png"
  },
  {
    name: "Pixel Prophet",
    minPixels: 700000,
    message: "You see the final image before it even exists.",
    pixelLimit: 24,
    src: "images/profiles/pixel-prophet.png"
  },
  {
    name: "The Glitch God",
    minPixels: 1000000,
    message: "Reality bends at the power of your pixels.",
    pixelLimit: 30,
    src: "images/profiles/glitch-god.png"
  }
];

export function getUserLevel(pixelsPlaced) {
  let currentLevelIndex = -1;

  for (let i = LEVELS_CONFIG.length - 1; i >= 0; i--) {
    if (pixelsPlaced >= LEVELS_CONFIG[i].minPixels) {
      currentLevelIndex = i;
      break;
    }
  }
  
  const currentLevel = LEVELS_CONFIG[currentLevelIndex];
  const nextLevel = LEVELS_CONFIG[currentLevelIndex + 1];

  return {
    level: currentLevel.name,
    message: currentLevel.message,
    pixelsLimit: currentLevel.pixelLimit,
    imageSrc: currentLevel.src,
    pixelsForCurrentLevel: currentLevel.minPixels,
    pixelsToNextLevel: nextLevel ? nextLevel.minPixels : Infinity,
  };
}

export function getAvailableProfileImages(pixelsPlaced) {
  return LEVELS_CONFIG.map(level => ({
    name: level.name,
    src: level.src,
    unlocked: pixelsPlaced >= level.minPixels
  }));
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
}

export const MESSAGES_TYPES = Object.freeze({
  SUCCESS: Symbol(),
  INFO: Symbol(),
  ERROR: Symbol(),
});

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const callWithProgress = async (fn, params, maxAttempts, depth = 0) => {
  const response = await fn(...params);

  if (response.data.info.status === "SUCCESS") {
    return response.data.info;
  }
  else {
    if (depth >= maxAttempts) {
      return null;
    }

    await sleep(2 ** depth * 3000);
    return callWithProgress(fn, params, maxAttempts, depth + 1);
  }
}