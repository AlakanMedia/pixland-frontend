const API_URL = import.meta.env.VITE_API_URL

export async function getUserInformation() {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            credentials: "include"
        });

        const responseJson = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${responseJson.detail}`);
        }

        return {
            state: "success",
            data: {
                code: response.status,
                info: responseJson,
            }
        }
    }
    catch (error) {
        return {state: "error", data: null};
    }
}

export async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_URL}/token`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            credentials: "include",
            body: new URLSearchParams({
                username: username,
                password: password,
            })
        });

        if (!response.ok) {
            const errorJson = await response.json();

            if (response.status === 401) {
                return {
                    state: "error",
                    data: {
                        code: response.status,
                        message: errorJson.detail,
                    }
                }
            }

            throw new Error(`Error ${response.status}: ${errorJson.detail}`);
        }

        const responseData = await response.json();

        return {state: "success", data: {message: responseData.message}};
    }
    catch (error) {
        console.log(error);
        return {state: "error", data: null}
    }
}

export async function registerNewUser(userInfo) {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({
                username: userInfo.username,
                email: userInfo.email,
                password: userInfo.password,
            })
        });

        if (!response.ok) {
            const errorJson = await response.json();

            if (response.status === 409) {
                return {
                    state: "error",
                    data: {
                        code: response.status,
                        message: errorJson.detail,
                    }
                }
            }

            throw new Error(`Error ${response.status}: ${errorJson.detail}`);
        }

        const responseData = await response.json();

        return {
            state: "success",
            data: {
                code: response.status,
                user_id: responseData.user_id,
            }
        }
    }
    catch (error) {
        console.log(error);
        return {state: "error", data: null}
    }
}

export async function deleteCookies() {
    try {
        const response = await fetch(`${API_URL}/users/logout`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            const errorJson = await response.json();
            throw new Error(`Error ${response.status}: ${errorJson.detail}`);
        }

        const responseData = await response.json();

        return {
            state: "success",
            data: {
                code: response.status,
                user_id: responseData.message,
            }
        }
    }
    catch (error) {
        console.log(error);
        return {state: "error", data: null}
    }
}

export async function getCellsBox(upperLeftLimit, lowerRightLimit) {
    try {
        if (
            (!Array.isArray(upperLeftLimit) || !Array.isArray(lowerRightLimit)) || 
            (upperLeftLimit.length !== 2 || lowerRightLimit.length !== 2)
        ) {
            throw new Error("One of the parameters is not an array or its length is not equal to two");
        }

        const response = await fetch(`${API_URL}/cells/box`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                upper_left_limit: upperLeftLimit,
                lower_right_limit: lowerRightLimit,
            })
        });

        const responseJson = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${responseJson.detail}`);
        }

        return {
            state: "success",
            data: {
                code: response.status,
                info: responseJson,
            }
        }
    }
    catch (error) {
        console.log(error);
        return {state: "error", data: null}
    }
}

export async function getPalette(name) {
    try {
        const response = await fetch(`${API_URL}/palettes/${name}`, {
            method: "GET"
        });

        const responseJson = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${responseJson.detail}`);
        }

        return {
            state: "success",
            data: {
                code: response.status,
                info: responseJson,
            }
        }
    }
    catch (error) {
        return {state: "error", data: null};
    }
}

export async function updateUserConfigurations(config) {
    try {
        const response = await fetch(`${API_URL}/users/modify`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify(config)

        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return {
            state: "success",
            data: {
                code: response.status,
                info: "Successful update",
            }
        }
    }
    catch (error) {
        return {state: "error", data: null};
    }
}