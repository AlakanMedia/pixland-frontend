import { getUserInformation, getPalette } from "../pixlandApi.js";
import { MESSAGES_TYPES } from "$lib/utils.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    // La función `load` se ejecuta en el servidor.
    // El `fetch` de SvelteKit aquí reenvía automáticamente las cookies (como tu token).
    const userResponse = await getUserInformation(fetch); // Asumiendo que tu apiClient puede aceptar un `fetch` personalizado.
    let initialUser = null;
    let initialPalette = null;

    if (userResponse.state === MESSAGES_TYPES.SUCCESS) {
        const userInfo = userResponse.data.info;
        initialUser = {
            id: userInfo.id,
            name: userInfo.username,
            pixelsPlaced: userInfo.pixels_placed,
            createdAt: userInfo.created_at,
            isLoggedIn: true,
            settings: userInfo.settings // Pasamos los settings completos
        };

        // Si el usuario tiene una paleta personalizada, la cargamos también
        if (userInfo.settings.palette !== "default") {
            const paletteResponse = await getPalette(userInfo.settings.palette, fetch);
            if (paletteResponse.state === MESSAGES_TYPES.SUCCESS) {
                initialPalette = paletteResponse.data.info.colors;
            }
        }
    }

    // Los datos que retornes aquí estarán disponibles en tu componente +page.svelte
    return {
        initialUser,
        initialPalette
    };
}