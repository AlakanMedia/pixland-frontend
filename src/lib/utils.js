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

const LEVEL_LIMITS = {
  pixelPeasant: 500,
  colorDabbler: 1500,
  dotDropper: 3000,
  hueHustler: 6000,
  shadeSlinger: 10000,
  gridGraffiti: 15000,
  palettePioneer: 25000,
  canvasCommander: 40000,
  bitmaster: 70000,
  pixelPicasso: 120000,
  colorOverlord: 200000,
  ditheringDuke: 350000,
  hueSorcerer: 500000,
  renderRuler: 700000,
  pixelProphet: 1000000,
  glitchGod: Infinity
};

export function getUserLevel(pixelsPlaced) {
  if (pixelsPlaced >= 0 && pixelsPlaced <= LEVEL_LIMITS.pixelPeasant) {
    return {
      level: "Pixel Peasant",
      message: "You've placed your first humble dot.",
      pixelsToNextLevel: LEVEL_LIMITS.pixelPeasant,
      pixelsLimit: 6
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.colorDabbler) {
    return {
      level: "Color Dabbler",
      message: "Starting to make a mess — in style.",
      pixelsToNextLevel: LEVEL_LIMITS.colorDabbler,
      pixelsLimit: 7
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.dotDropper) {
    return {
      level: "Dot Dropper",
      message: "You're making tiny waves in the canvas ocean.",
      pixelsToNextLevel: LEVEL_LIMITS.dotDropper,
      pixelsLimit: 8
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.hueHustler) {
    return {
      level: "Hue Hustler",
      message: "You've got an eye for color and no shame in clicking.",
      pixelsToNextLevel: LEVEL_LIMITS.hueHustler,
      pixelsLimit: 9
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.shadeSlinger) {
    return {
      level: "Shade Slinger",
      message: "Flipping palettes like a cowboy flips coins.",
      pixelsToNextLevel: LEVEL_LIMITS.shadeSlinger,
      pixelsLimit: 10
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.gridGraffiti) {
    return {
      level: "Grid Graffiti",
      message: "Who needs permission to paint?",
      pixelsToNextLevel: LEVEL_LIMITS.gridGraffiti,
      pixelsLimit: 11
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.palettePioneer) {
    return {
      level: "Palette Pioneer",
      message: "Blazing trails through pixels unknown.",
      pixelsToNextLevel: LEVEL_LIMITS.palettePioneer,
      pixelsLimit: 12
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.canvasCommander) {
    return {
      level: "Canvas Commander",
      message: "You don't paint pixels — you order them around.",
      pixelsToNextLevel: LEVEL_LIMITS.canvasCommander,
      pixelsLimit: 13
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.bitmaster) {
    return {
      level: "Bitmaster",
      message: "The binary bows to your will.",
      pixelsToNextLevel: LEVEL_LIMITS.bitmaster,
      pixelsLimit: 14
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.pixelPicasso) {
    return {
      level: "Pixel Picasso",
      message: "Your mess is starting to look like art.",
      pixelsToNextLevel: LEVEL_LIMITS.pixelPicasso,
      pixelsLimit: 15
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.colorOverlord) {
    return {
      level: "Color Overlord",
      message: "You control more shades than the sunset.",
      pixelsToNextLevel: LEVEL_LIMITS.colorOverlord,
      pixelsLimit: 16
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.ditheringDuke) {
    return {
      level: "The Dithering Duke",
      message: "Smoothing edges like a royal.",
      pixelsToNextLevel: LEVEL_LIMITS.ditheringDuke,
      pixelsLimit: 18
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.hueSorcerer) {
    return {
      level: "Hue Sorcerer",
      message: "Summoning colors with a click and a curse.",
      pixelsToNextLevel: LEVEL_LIMITS.hueSorcerer,
      pixelsLimit: 20
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.renderRuler) {
    return {
      level: "Render Ruler",
      message: "The canvas is your kingdom. The cursor is your crown.",
      pixelsToNextLevel: LEVEL_LIMITS.renderRuler,
      pixelsLimit: 22
    };
  }
  else if (pixelsPlaced <= LEVEL_LIMITS.pixelProphet) {
    return {
      level: "Pixel Prophet",
      message: "You see the final image before it even exists.",
      pixelsToNextLevel: LEVEL_LIMITS.pixelProphet,
      pixelsLimit: 24
    };
  }
  else {
    return {
      level: "The Glitch God",
      message: "Reality bends at the power of your pixels.",
      pixelsToNextLevel: LEVEL_LIMITS.glitchGod,
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