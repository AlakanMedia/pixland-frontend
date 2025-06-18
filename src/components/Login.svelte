<script>
    import { onMount, tick } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { modals, user } from "../shared.svelte.js";
    import { registerNewUser, loginUser } from "../pixlandApi.js";
    import { decodeJWT, showAlert, isValidEmail } from "../utils.js";

    let username = $state("");
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let register = $state(false);

    let login;
    let loginContainer;

    onMount(async () => {
        loginContainer.focus();
        await tick();
    });

    function isValidFields() {
        if (!(username && email && password)) {
            if (!username) {
                const inputUsername = document.body.querySelector("#input-username");
                inputUsername.classList.add("error");
            }

            if (!email) {
                const inputEmail = document.body.querySelector("#input-email");
                inputEmail.classList.add("error");
            }

            if (!password) {
                const inputPassword = document.body.querySelector("#input-password");
                inputPassword.classList.add("error");
            }

            showAlert("info", "Missing Information", "Please fill in all required fields before submitting the form. Make sure no fields are left empty.");
            return false;
        }

        if (username.trim().length < 1) {
            const inputUsername = document.body.querySelector("#input-username");
            inputUsername.classList.add("error");

            showAlert("info", "Username Too Short", "Your username must be at least 1 character long.");
            return false;
        }

        if (!isValidEmail(email)) {
            const inputEmail = document.body.querySelector("#input-email");
            inputEmail.classList.add("error");

            showAlert("info", "Invalid Email", "The email address you entered is not valid. Please check for any typos or use a valid email format.");
            return false;
        }

        if (password.trim().length < 4) {
            const inputPassword = document.body.querySelector("#input-password");
            inputPassword.classList.add("error");

            showAlert("info", "Password Too Short", "Your password must be at least 4 characters long.");
            return false;
        }

        if (password !== confirmPassword) {
            const inputConfirmPassword = document.body.querySelector("#input-confirm-password");
            inputConfirmPassword.classList.add("error");

            showAlert("info", "Password Mismatch", "The passwords you entered do not match. Please ensure both passwords are identical and try again.");
            return false;
        }

        return true;
    }

    async function handleRegister() {
        if (!isValidFields()) {
            return false;
        }

        const response = await registerNewUser({
            username: username,
            email: email,
            password: password,
        });

        if (response.state !== "success") {
            const data = response.data;

            if (data && data.code === 409) {
                showAlert("info", "Username or Email Already Taken", "The username or email you entered is already in use. Please choose a different username or email address to proceed with your registration.");
            }
            else {
                showAlert("error", "Unexpected Error Occurred", "An unexpected error has occurred while processing your request. Please try again later. If the problem persists, contact support for assistance.");
            }

            return false;
        }

        showAlert("success", "Registration Successful", "Your account has been successfully registered. You can now log in and start to play. Welcome aboard!");
        return true;
    }

    async function handleLogin() {
        if (!(username && password)) {
            if (!username) {
                const inputUsername = document.body.querySelector("#input-username");
                inputUsername.classList.add("error");
            }

            if (!password) {
                const inputPassword = document.body.querySelector("#input-password");
                inputPassword.classList.add("error");
            }
            
            showAlert("info", "Missing Information", "Please fill in all required fields before submitting the form. Make sure no fields are left empty.");
            return false;
        }

        const response = await loginUser(username, password);

        if (response.state !== "success") {
            const data = response.data;

            if (data && data.code === 401) {
                showAlert("info", "Login Failed", "The username or password you entered is incorrect. Please try again.");
            }
            else {
                showAlert("error", "Unexpected Error Occurred", "An unexpected error has occurred while processing your request. Please try again later. If the problem persists, contact support for assistance.");
            }

            return false;
        }

        return response.data;
    }

    async function handleSignButton() {
        if (register) {
            const userAdded = await handleRegister();

            if (userAdded) {
                register = false;
                email = "";
                password = "";
                confirmPassword = "";
            }
        }
        else {
            const userLoged = await handleLogin();

            if (userLoged) {
                const decodeToken = decodeJWT(userLoged.token);

                user.id = decodeToken.payload.sub;
                user.logged = true;

                if (user.websocket) {
                    user.websocket.send(JSON.stringify({
                        type: "anonymous_to_registered",
                        data: {user_id: user.id},
                    }));
                }

                modals.loginIsOpen = false;

                localStorage.setItem("access_token", userLoged.token);
            }
        }
    }

    function closeLogin(event) {
        if (event.type === "click"){
            if (event.target !== login && !login.contains(event.target)) {
                modals.loginIsOpen = false;
            }
        }
        else if (event.type === "keydown") {
            if (event.key === "Escape") {
                modals.loginIsOpen = false;
            }
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            handleSignButton();
        }
        else {
            closeLogin(event);
        }
    }

    function removeErrorClass(element) {
        element.classList.remove("error");
    }
</script>

<div
    id="login-container"
    onclick={(e) => {closeLogin(e);}}
    onkeydown={(e) => {handleKeyDown(e);}}
    role="dialog"
    tabindex="0"
    bind:this={loginContainer}
    transition:fade={{duration: 600}}
>
    <div id="login" bind:this={login} in:scale={{duration: 900}}>
        <div id="login-buttons-container">
            <button class="login-button" aria-label="Google">
                <i class="ph ph-bold ph-google-logo"></i>
            </button>
            <button class="login-button" aria-label="Discord">
                <i class="ph ph-bold ph-discord-logo"></i>
            </button>
        </div>
        <div id="login-separator">
            <hr><p>or</p><hr>
        </div>
        <form id="login-form">
            <input
                id="input-username"
                class="input-form"
                bind:value={username}
                placeholder="username"
                type="text"
                onfocus={(e) => {removeErrorClass(e.target);}}
                required
            />
            {#if register}
                <input
                    id="input-email"
                    class="input-form"
                    bind:value={email}
                    placeholder="email"
                    type="email"
                    onfocus={(e) => {removeErrorClass(e.target);}}
                    required
                />
            {/if}
            <input
                id="input-password"
                class="input-form"
                bind:value={password}
                placeholder="password"
                type="password"
                onfocus={(e) => {removeErrorClass(e.target);}}
                required
            />
            {#if register}
                <input
                    id="input-confirm-password"
                    class={["input-form", confirmPassword && password !== confirmPassword ? "error" : ""]}
                    bind:value={confirmPassword}
                    placeholder="confirm password"
                    type="password"
                    required
                />
            {/if}
        </form>
        <div id="summit-container">
            <label>
                <input id="register-button" type="checkbox" bind:checked={register}/>
                <span>register</span>
            </label>
            <button
                id="sign-button"
                aria-label="Pixland"
                onclick={async () => {handleSignButton();}}
            >
                {#if register}
                    <i class="ph ph-bold ph-user-plus"></i>
                    <p>sign up</p>
                {:else} 
                    <i class="ph ph-bold ph-sign-in"></i>
                    <p>sign in</p>
                {/if}
            </button>
        </div>
    </div>
</div>

<style>
    #login p, 
    #login label {
        color: #f5f5f5;
    }

    #login-container {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #login {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #0f0f0f;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
        border-radius: 6px;
        width: 260px;
        padding: 12px;
    }

    #login-buttons-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        width: 100%;
    }

    .login-button {
        height: 42px;
        width: 100%;
        border-radius: 6px;
        color: #f5f5f5;
        background-color: #1e1e1e;
        border: 1px solid #2a2a2a;
        transition: transform 0.3s ease;
    }

    .login-button:hover {
        transform: scale(1.04);
    }

    .login-button > i {
        font-size: 1.5rem;
    }

    #login-separator {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        margin: 12px 0;
    }

    #login-separator > hr{
        width: 100%;
        border: 2px solid #2a2a2a;
    }

    #login-separator > hr:first-of-type {
        margin-right: 0.5rem;
    }

    #login-separator > hr:last-of-type {
        margin-left: 0.5rem;
    }

    #login-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 6px;
        width: 100%;
    }

    #summit-container{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
        margin-top: 12px;
    }

    .input-form {
        width: 100%;
        border-radius: 6px;
        border: 1px solid #2a2a2a;
        transition: border-color 0.3s ease;
        background-color: #1a1a1a;
        color: #e0e0e0;
        padding: 0.5rem 0.75rem;
        font-size: 1rem;
    }

    .input-form:focus {
        outline: none;
        border-color: #616161;
    }

    #sign-button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        height: 42px;
        padding: 0 0.5rem;
        border-radius: 6px;
        color: #f5f5f5;
        background-color: #1e1e1e;
        border: 1px solid #2a2a2a;
        transition: transform 0.3s ease;
        font-size: 1rem;
    }

    #sign-button:hover {
        transform: scale(1.04);
    }

    #sign-button > i {
        font-size: 1.5rem;
    }

    .error {
        border-color: #7D1E20 !important;
    }

    #register-button {
        accent-color: #616161;
        cursor: pointer;
    }
</style>