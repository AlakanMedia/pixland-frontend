const API_URL = import.meta.env.VITE_API_URL;

/**
 * Cliente centralizado para realizar llamadas a la API.
 * Maneja la lógica de fetch, el parseo de JSON y la estructura de respuesta de éxito/error.
 * @param {string} endpoint - El endpoint de la API al que se llamará (ej. "/users/me").
 * @param {object} options - El objeto de opciones para la función fetch (method, headers, body, etc.).
 * @returns {Promise<{state: "success" | "error", data: object | null}>}
 */
async function apiClient(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            credentials: "omit", // Por defecto, no enviar credenciales
            ...options, // Las opciones pasadas pueden sobreescribir los valores por defecto
        });

        // Intenta obtener el cuerpo de la respuesta como JSON.
        // Algunas respuestas exitosas (ej. 204 No Content) no tienen cuerpo.
        let responseData = {};

        try {
            responseData = await response.json();
        } catch (error) {
            // Ignora el error si el cuerpo está vacío, es normal.
        }

        if (!response.ok) {
            // Si la respuesta no es OK, devuelve una estructura de error estandarizada.
            return {
                state: "error",
                data: {
                    code: response.status,
                    message: responseData.detail || `Error ${response.status}`,
                },
            };
        }

        // Si la respuesta es OK, devuelve la estructura de éxito.
        return {
            state: "success",
            data: {
                code: response.status,
                info: responseData,
            },
        };
    } catch (error) {
        // Captura errores de red o fallos graves.
        console.error("API Client Error:", error);
        return { state: "error", data: null };
    }
}

export function getUserInformation() {
    return apiClient("/users/me", {
        method: "GET",
        credentials: "include",
    });
}

export function loginUser(username, password) {
    return apiClient("/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: new URLSearchParams({ username, password }),
    });
}

export function registerNewUser(userInfo) {
    return apiClient("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(userInfo),
    });
}

export function deleteCookies() {
    return apiClient("/users/logout", {
        method: "POST",
        credentials: "include",
    });
}

export function getCellsBox(upperLeftLimit, lowerRightLimit) {
    if (
        !Array.isArray(upperLeftLimit) || upperLeftLimit.length !== 2 ||
        !Array.isArray(lowerRightLimit) || lowerRightLimit.length !== 2
    ) {
        console.error("Parámetros de getCellsBox inválidos.");
        return Promise.resolve({ state: "error", data: null }); // Retorna una promesa resuelta
    }

    return apiClient("/cells/box", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            upper_left_limit: upperLeftLimit,
            lower_right_limit: lowerRightLimit,
        }),
    });
}

export function getPalette(name) {
    return apiClient(`/palettes/${name}`, {
        method: "GET",
    });
}

export function updateUserConfigurations(config) {
    return apiClient("/users/modify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
    });
}