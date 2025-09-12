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
    unlockedImages: [
      "images/profiles/CluckingChicken.gif",
      "images/profiles/DaintyPig.gif",
      "images/profiles/CroakingToad.gif",
      "images/profiles/InfectedMouse.gif",
      "images/profiles/PasturingSheep.gif",
      "images/profiles/HonkingGoose.gif",
      "images/profiles/MeowingCat.gif",
      "images/profiles/TinyChick.gif"
    ]
  },
  {
    name: "Color Dabbler",
    minPixels: 500,
    message: "Starting to make a mess — in style.",
    pixelLimit: 7,
    unlockedImages: [
      "images/profiles/PlayfulChild.gif",
      "images/profiles/JoyfulKid.gif",
      "images/profiles/BoisterousYouth.gif",
      "images/profiles/AdventurousAdolescent.gif",
      "images/profiles/OverworkedVillager.gif",
      "images/profiles/GentleShepard.gif",
      "images/profiles/JovialFriar.gif"
    ]
  },
  {
    name: "Dot Dropper",
    minPixels: 1500,
    message: "You're making tiny waves in the canvas ocean.",
    pixelLimit: 8,
    unlockedImages: [
      "images/profiles/LeapingFrog.gif",
      "images/profiles/SlowTurtle.gif",
      "images/profiles/MawingBeaver.gif",
      "images/profiles/CoralCrab.gif",
      "images/profiles/MerfolkScout.gif",
      "images/profiles/MerfolkJavelineer.gif",
      "images/profiles/MerfolkImpaler.gif",
      "images/profiles/MerfolkMystic.gif",
      "images/profiles/MerfolkAquamancer.gif"
    ]
  },
  {
    name: "Hue Hustler",
    minPixels: 3000,
    message: "You've got an eye for color and no shame in clicking.",
    pixelLimit: 9,
    unlockedImages: [
      "images/profiles/HalflingRogue.gif",
      "images/profiles/HalflingSlinger.gif",
      "images/profiles/HalflingAssassin.gif",
      "images/profiles/HalflingBard.gif",
      "images/profiles/HalflingRanger.gif",
      "images/profiles/TaintedScoundrel.gif",
      "images/profiles/GrinningGremlin.gif",
      "images/profiles/RedCap.gif"
    ]
  },
  {
    name: "Shade Slinger",
    minPixels: 6000,
    message: "Flipping palettes like a cowboy flips coins.",
    pixelLimit: 10,
    unlockedImages: [
      "images/profiles/DeterminedSoldier.gif",
      "images/profiles/BoldManAtArms.gif",
      "images/profiles/VeteranSwordsman.gif",
      "images/profiles/LizardfolkScout.gif",
      "images/profiles/LizardfolkSpearman.gif",
      "images/profiles/LizardfolkArcher.gif",
      "images/profiles/LizardfolkGladiator.gif",
      "images/profiles/BestialLizardfolk.gif"
    ]
  },
  {
    name: "Grid Graffiti",
    minPixels: 10000,
    message: "Who needs permission to paint?",
    pixelLimit: 11,
    unlockedImages: [
      "images/profiles/GoblinFighter.gif",
      "images/profiles/GoblinArcher.gif",
      "images/profiles/GoblinWolfRider.gif",
      "images/profiles/GoblinFanatic.gif",
      "images/profiles/GoblinOccultist.gif",
      "images/profiles/MadBoar.gif",
      "images/profiles/TimberWolf.gif",
      "images/profiles/StinkySkunk.gif",
      "images/profiles/ToxicHound.gif"
    ]
  },
  {
    name: "Palette Pioneer",
    minPixels: 15000,
    message: "Blazing trails through pixels unknown.",
    pixelLimit: 12,
    unlockedImages: [
      "images/profiles/ElfWayfarer.gif",
      "images/profiles/ElfSharpshooter.gif",
      "images/profiles/ElfBladedancer.gif",
      "images/profiles/ElfEnchanter.gif",
      "images/profiles/ElfLord.gif",
      "images/profiles/SnowFox.gif",
      "images/profiles/TunnelingMole.gif",
      "images/profiles/SpikeyPorcupine.gif"
    ]
  },
  {
    name: "Canvas Commander",
    minPixels: 25000,
    message: "You don't paint pixels — you order them around.",
    pixelLimit: 13,
    unlockedImages: [
      "images/profiles/DevoutAcolyte.gif",
      "images/profiles/ZealousPriest.gif",
      "images/profiles/FavoredCleric.gif",
      "images/profiles/HolyCrusader.gif",
      "images/profiles/BlessedGladiator.gif",
      "images/profiles/DepravedBlackguard.gif",
      "images/profiles/VileWitch.gif"
    ]
  },
  {
    name: "Bitmaster",
    minPixels: 40000,
    message: "The binary bows to your will.",
    pixelLimit: 14,
    unlockedImages: [
      "images/profiles/DecrepitBones.gif",
      "images/profiles/BrittleArcher.gif",
      "images/profiles/BoundCadaver.gif",
      "images/profiles/MutilatedStumbler.gif",
      "images/profiles/UnravelingCrawler.gif",
      "images/profiles/GraveRevenant.gif",
      "images/profiles/AdeptNecromancer.gif",
      "images/profiles/SandGhoul.gif"
    ]
  },
  {
    name: "Pixel Picasso",
    minPixels: 70000,
    message: "Your mess is starting to look like art.",
    pixelLimit: 15,
    unlockedImages: [
      "images/profiles/FlutteringPixie.gif",
      "images/profiles/MagicalFairy.gif",
      "images/profiles/GlowingWisp.gif",
      "images/profiles/OchreJelly.gif",
      "images/profiles/DeathSlime.gif",
      "images/profiles/ShriekerMushroom.gif",
      "images/profiles/FungalMyconid.gif",
      "images/profiles/GrizzledTreant.gif",
      "images/profiles/CorruptedTreant.gif"
    ]
  },
  {
    name: "Color Overlord",
    minPixels: 120000,
    message: "You control more shades than the sunset.",
    pixelLimit: 16,
    unlockedImages: [
      "images/profiles/PygmyWyvern.gif",
      "images/profiles/MudWyvern.gif",
      "images/profiles/AquaDrake.gif",
      "images/profiles/PoisonDrake.gif",
      "images/profiles/ViridianDrake.gif",
      "images/profiles/BabyWhiteDragon.gif",
      "images/profiles/BabyGreenDragon.gif",
      "images/profiles/BabyBrassDragon.gif",
      "images/profiles/BabyCopperDragon.gif"
    ]
  },
  {
    name: "The Dithering Duke",
    minPixels: 200000,
    message: "Smoothing edges like a royal.",
    pixelLimit: 18,
    unlockedImages: [
      "images/profiles/DungBeetle.gif",
      "images/profiles/RhinoBeetle.gif",
      "images/profiles/SoldierAnt.gif",
      "images/profiles/AcidAnt.gif",
      "images/profiles/LavaAnt.gif",
      "images/profiles/RoyalScarab.gif",
      "images/profiles/GiantRoyalScarab.gif",
      "images/profiles/BloatedBedbug.gif",
      "images/profiles/FamishedTick.gif",
      "images/profiles/EngorgedTick.gif",
      "images/profiles/ForagingMaggot.gif"
    ]
  },
  {
    name: "Hue Sorcerer",
    minPixels: 350000,
    message: "Summoning colors with a click and a curse.",
    pixelLimit: 20,
    unlockedImages: [
      "images/profiles/NovicePyromancer.gif",
      "images/profiles/DeftSorceress.gif",
      "images/profiles/ExpertDruid.gif",
      "images/profiles/CrimsonImp.gif",
      "images/profiles/NefariousScamp.gif",
      "images/profiles/RascallyDemonling.gif",
      "images/profiles/FledglingDemon.gif",
      "images/profiles/PointedDemonspawn.gif",
      "images/profiles/SkeweringStalker.gif"
    ]
  },
  {
    name: "Render Ruler",
    minPixels: 500000,
    message: "The canvas is your kingdom. The cursor is your crown.",
    pixelLimit: 22,
    unlockedImages: [
      "images/profiles/YoungBrassDragon.gif",
      "images/profiles/YoungRedDragon.gif",
      "images/profiles/JuvenileBronzeDragon.gif",
      "images/profiles/MatureBronzeDragon.gif",
      "images/profiles/AdultWhiteDragon.gif",
      "images/profiles/AdultGreenDragon.gif",
      "images/profiles/StoneTroll.gif",
      "images/profiles/SwampTroll.gif"
    ]
  },
  {
    name: "Pixel Prophet",
    minPixels: 700000,
    message: "You see the final image before it even exists.",
    pixelLimit: 24,
    unlockedImages: [
      "images/profiles/BloodshotEye.gif",
      "images/profiles/GhastlyEye.gif",
      "images/profiles/FloatingEye.gif",
      "images/profiles/OcularWatcher.gif",
      "images/profiles/SwordArchon.gif",
      "images/profiles/RighteousDeva.gif",
      "images/profiles/ResoluteAngel.gif",
      "images/profiles/FloatingCherub.gif",
      "images/profiles/DivinePlanetar.gif"
    ]
  },
  {
    name: "The Glitch God",
    minPixels: 1000000,
    message: "Reality bends at the power of your pixels.",
    pixelLimit: 30,
    unlockedImages: [
      "images/profiles/IceGolem.gif",
      "images/profiles/IronGolem.gif",
      "images/profiles/EarthElemental.gif",
      "images/profiles/FireElemental.gif",
      "images/profiles/WaterElemental.gif",
      "images/profiles/BrawnyOgre.gif",
      "images/profiles/CrushingCyclops.gif",
      "images/profiles/HumongousEttin.gif",
      "images/profiles/PitBalor.gif",
      "images/profiles/WarpSkull.gif",
      "images/profiles/ClawedAbomination.gif"
    ]
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
    unlockedImages: currentLevel.unlockedImages, 
    pixelsForCurrentLevel: currentLevel.minPixels,
    pixelsToNextLevel: nextLevel ? nextLevel.minPixels : Infinity,
  };
}

export function getAvailableProfileImages(pixelsPlaced) {
  // flatMap crea una lista plana de todas las imágenes de todos los niveles.
  return LEVELS_CONFIG.flatMap(level => 
    level.unlockedImages.map(imageSrc => ({
      src: imageSrc,
      unlocked: pixelsPlaced >= level.minPixels,
      levelName: level.name 
    }))
  );
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