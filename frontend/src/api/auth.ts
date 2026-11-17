import {User} from "../store/user/types.ts";
import {getCurrentUser} from "./user.ts";

export async function startGoogleLogin() {
    const response = await fetch("http://localhost:3000/auth/csrf", {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to get Google authentication token");
    }

    const { csrfToken } = await response.json();

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "http://localhost:3000/auth/signin/google";

    const fields = {
        csrfToken,
        callbackUrl: "http://localhost:5173/auth/google/callback"
    };

    Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
}

export async function completeGoogleLogin(): Promise<User> {
    const response = await fetch("http://localhost:3000/api/auth/google/session", {
        method: "POST",
        credentials: "include"
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Google login failed");
    }

    return getCurrentUser();
}