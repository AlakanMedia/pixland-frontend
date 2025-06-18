const API_URL = import.meta.env.VITE_API_URL

export async function getUserInformation(token) {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
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

export async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_URL}/token`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
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

        return {
            state: "success",
            data: {
                code: response.status,
                token: responseData.access_token,
            }
        }
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