const API_URL = import.meta.env.VITE_API_URL

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
            if (response.status === 401) {
                return response.status;
            }
            else {
                const errorJson = await response.json();
                throw new Error(`Error ${response.status}: ${errorJson.detail}`);
            }
        }

        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        return response.status;
    }
    catch (error) {
        console.log(error);
        return 500;
    }
}

export async function registerNewUser(userInfo) {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            // headers: {"Content-Type": "application/json"},
            // body: JSON.stringify(userInfo),
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({
                username: userInfo.username,
                email: userInfo.email,
                password: userInfo.password,
            })
        });

        if (!response.ok) {
            if (response.status === 409) {
                return response.status;
            }
            else if (response.status === 422) {
                const errorJson = await response.json();
                const detail = errorJson.detail[0];

                if (detail.loc.includes("password")) {
                    return response.status;
                }

                throw new Error(`Error ${response.status}: ${errorJson.detail}`);
            }
            else {
                const errorJson = await response.json();
                throw new Error(`Error ${response.status}: ${errorJson.detail}`);
            }
        }

        await response.json();
        return response.status;
    }
    catch (error) {
        console.log(error);
        return 500;
    }
}