<script>
    import { user, drawingState, ui } from "../../shared.svelte.js";
    import { registerNewUser, loginUser, getUserInformation, getPalette } from "../../pixlandApi.js";
    import { showAlert, isValidEmail, getUserLevel, changeColorSchema, MESSAGES_TYPES, sleep } from "$lib/utils.js";

    let username = $state("");
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let register = $state(false);
    let pressed = $state(false);

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

            showAlert(MESSAGES_TYPES.INFO, "Missing Information", "Please fill in all required fields before submitting the form. Make sure no fields are left empty.");
            return false;
        }

        if (username.trim().length < 1) {
            const inputUsername = document.body.querySelector("#input-username");
            inputUsername.classList.add("error");

            showAlert(MESSAGES_TYPES.INFO, "Username Too Short", "Your username must be at least 1 character long.");
            return false;
        }

        if (!isValidEmail(email.trim())) {
            const inputEmail = document.body.querySelector("#input-email");
            inputEmail.classList.add("error");

            showAlert(MESSAGES_TYPES.INFO, "Invalid Email", "The email address you entered is not valid. Please check for any typos or use a valid email format.");
            return false;
        }

        if (password.length < 4) {
            const inputPassword = document.body.querySelector("#input-password");
            inputPassword.classList.add("error");

            showAlert(MESSAGES_TYPES.INFO, "Password Too Short", "Your password must be at least 4 characters long.");
            return false;
        }

        if (password !== confirmPassword) {
            const inputConfirmPassword = document.body.querySelector("#input-confirm-password");
            inputConfirmPassword.classList.add("error");

            showAlert(MESSAGES_TYPES.INFO, "Password Mismatch", "The passwords you entered do not match. Please ensure both passwords are identical and try again.");
            return false;
        }

        return true;
    }

    async function handleRegister() {
        if (!isValidFields()) {
            return false;
        }

        const response = await registerNewUser({
            username: username.trim(),
            email: email.trim(),
            password: password,
        });

        if (response.state !== MESSAGES_TYPES.SUCCESS) {
            const data = response.data;

            if (data && data.code === 409) {
                showAlert(MESSAGES_TYPES.INFO, "Username or Email Already Taken", "The username or email you entered is already in use. Please choose a different username or email address to proceed with your registration.");
            }
            else {
                showAlert(MESSAGES_TYPES.ERROR, "Unexpected Error Occurred", "An unexpected error has occurred while processing your request. Please try again later. If the problem persists, contact support for assistance.");
            }

            return false;
        }

        showAlert(MESSAGES_TYPES.SUCCESS, "Registration Successful", "Your account has been successfully registered. You can now log in and start to play. Welcome aboard!");
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
            
            showAlert(MESSAGES_TYPES.INFO, "Missing Information", "Please fill in all required fields before submitting the form. Make sure no fields are left empty.");
            return false;
        }

        const response = await loginUser(username.trim(), password);

        if (response.state !== MESSAGES_TYPES.SUCCESS) {
            const data = response.data;

            if (data && data.code === 401) {
                showAlert(MESSAGES_TYPES.INFO, "Login Failed", "The username or password you entered is incorrect. Please try again.");
            }
            else {
                showAlert(MESSAGES_TYPES.ERROR, "Unexpected Error Occurred", "An unexpected error has occurred while processing your request. Please try again later. If the problem persists, contact support for assistance.");
            }

            return false;
        }

        return response.data;
    }

    async function handleSignButton() {
        let updateCanvas = false;

        pressed = true;
        await sleep(300);
        pressed = false;

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
                let response = await getUserInformation();

                if (response.state !== MESSAGES_TYPES.SUCCESS) {
                    showAlert(MESSAGES_TYPES.ERROR, "Unexpected Error Occurred", "An error occurred while retrieving user information. Please try again.");
                    return;
                }

                const userInfo = response.data.info;

                if (userInfo.settings.palette) {
                    response = await getPalette(userInfo.settings.palette);

                    if (response.state === MESSAGES_TYPES.SUCCESS) {
                        drawingState.name = response.data.info.name;
                        const newPalette = response.data.info.colors;
                        changeColorSchema(newPalette);
                        updateCanvas = true;
                    }
                    else {
                        userInfo.settings.palette = null;
                    }
                }

                const userLevel = getUserLevel(userInfo.pixels_placed);

                drawingState.availablePixels = 0;
                drawingState.pixelLimit = userLevel.pixelsLimit;

                if (drawingState.showGrid !== userInfo.settings.show_grid) {
                    drawingState.showGrid = userInfo.settings.show_grid;
                    updateCanvas = true;
                }

                drawingState.playSound = userInfo.settings.play_sound;
                drawingState.palette = userInfo.settings.palette;

                user.id = userInfo.id;
                user.name = userInfo.username;
                user.pixelsPlaced = userInfo.pixels_placed;
                user.createdAt = userInfo.created_at;
                user.profileImage = userInfo.profile_image;
                user.isLoggedIn = true;
                user.disconnect = false;

                ui.loginModalIsOpen = false;
            }
        }

        if (updateCanvas) {
            drawingState.needsUpdate = true;
        }
    }

    function removeErrorClass(element) {
        element.classList.remove("error");
    }
</script>

<div id="login">
    <div id="login-buttons-container">
        <button
            class="login-button"
            title="Google login is temporarily disabled"
            aria-label="Login with Google"
            disabled
        >
            <i class="ph-bold ph-google-logo"></i>
        </button>
        <button
            class="login-button"
            title="Discord login is temporarily disabled"
            aria-label="Login with Discord"
            disabled
        >
            <i class="ph-bold ph-discord-logo"></i>
        </button>
    </div>
    <div id="login-separator">
        <hr><p>or</p><hr>
    </div>
    <form
        id="login-form"
        onsubmit={async (e) => {
            e.preventDefault();
            await handleSignButton();
        }}
    >
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
        <div id="summit-container">
            <label id="register-checkbox">
                <input id="register-button" type="checkbox" bind:checked={register}/>
                <span>register</span>
            </label>
            <button id="sign-button" class={[{pressed}]} type="submit">
                {#if register}
                    <i class="ph-bold ph-user-plus"></i>
                    <p>sign up</p>
                {:else} 
                    <i class="ph-bold ph-sign-in"></i>
                    <p>sign in</p>
                {/if}
            </button>
        </div>
    </form>
</div>

<style>
    #login p, 
    #login label {
        color: var(--text-primary);
    }

    #login {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 12px;
        background-color: var(--bg-elevated-1);
        box-shadow: var(--shadow-colored);
        border: 1px solid var(--border-default);
        border-radius: 6px;
        padding: 12px;
    }

    #login-buttons-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 0 8px;
    }

    .login-button {
        height: 42px;
        width: 100%;
        padding: 8px 12px;
        border-radius: 6px;
        border: none;
        color: var(--action-secondary-text);
        background-color: var(--action-secondary);
        transition: all 0.3s ease;
    }

    .login-button:disabled {
        background-color: var(--action-primary-disabled);
        cursor: not-allowed;
    }

    .login-button:not(:disabled):hover {
        background-color: var(--action-secondary-hover);
        box-shadow: var(--shadow-md);
    }

    .login-button > i {
        font-size: 1.5rem;
    }

    #login-separator {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    #login-separator > hr {
        width: 100%;
        border: 1px solid var(--border-subtle);
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
        padding: 0 8px;
    }

    #summit-container{
        width: 100%;
        margin-top: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
    }

    .input-form {
        width: 100%;
        border-radius: 6px;
        border: 1px solid var(--input-border);
        transition: border-color 0.3s ease;
        background-color: var(--input-bg);
        color: var(--input-text);
        padding: 0.5rem 0.75rem;
        font-size: 1rem;
    }

    .input-form:focus {
        outline: none;
        border-color: var(--input-border-focus);
    }

    .input-form::placeholder {
        color: var(--input-placeholder);
    }

    #sign-button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        height: 42px;
        padding: 8px 12px;
        border-radius: 6px;
        border: none;
        color: var(--action-primary-text);
        background-color: var(--action-primary);
        transition: all 0.3s ease;
        font-size: 1rem;
    }

    #sign-button:hover {
        background-color: var(--action-primary-hover);
        box-shadow: var(--shadow-md);
    }

    #sign-button:active,
    #sign-button.pressed {
        transform: scale(0.98);
        background-color: var(--action-primary-active);
    }

    #sign-button > i {
        font-size: 1.5rem;
    }

    .error {
        border-color: var(--state-error-border) !important;
    }

    #register-checkbox {
        display: flex;
        gap: 0.5rem
    }

    #register-button {
        accent-color: var(--action-secondary);
        cursor: pointer;
    }
</style>