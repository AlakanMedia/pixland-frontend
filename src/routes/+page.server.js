import { getUserInformation, getPalette } from "../pixlandApi.js";
import { MESSAGES_TYPES } from "$lib/utils.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, cookies }) {
    const token = cookies.get('access_token');
    const headers = new Headers();

    if (token) {
        headers.append('Cookie', `access_token=${token}`);
    }

    const userResponse = await getUserInformation(fetch, headers);
    let initialUser = null;
    let initialPalette = null;
    let initialPaletteName = null;

    if (userResponse.state === MESSAGES_TYPES.SUCCESS) {
        const userInfo = userResponse.data.info;
        initialUser = {
            id: userInfo.id,
            name: userInfo.username,
            pixelsPlaced: userInfo.pixels_placed,
            createdAt: userInfo.created_at,
            isLoggedIn: true,
            profileImage: userInfo.profile_image,
            settings: userInfo.settings
        };

        if (userInfo.settings.palette) {
            const paletteResponse = await getPalette(userInfo.settings.palette, fetch, headers);
            if (paletteResponse.state === MESSAGES_TYPES.SUCCESS) {
                initialPalette = paletteResponse.data.info.colors;
                initialPaletteName = paletteResponse.data.info.name;
            }
        }
    }

    return {
        initialUser,
        initialPalette,
        initialPaletteName
    };
}