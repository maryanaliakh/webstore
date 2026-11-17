import type { User } from "../store/user/types.ts";

interface CreateUserData {
    name: string;
    email: string;
    password: string;
    phone: string;
    keepSignedIn: boolean;
    newsletterConsent: boolean;
    termsAccepted: boolean;
}

export async function loginUser(data: { email: string, password: string, rememberMe: boolean}) {
    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Login failed");
        }

        return result.user;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

export async function createUser(data: CreateUserData): Promise<User> {
    try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseText = await response.text();

        console.log("Registration status:", response.status);
        console.log("Registration response:", responseText);

        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            throw new Error("Server returned HTML instead of JSON");
        }

        if (!response.ok) {
            throw new Error(result.message || "Registration failed");
        }

        return result.user ?? result;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}

export async function getCurrentUser(): Promise<User> {
    const response = await fetch("http://localhost:3000/api/auth/me", {
        method: "GET",
        credentials: "include"
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to get current user");
    }

    return result.user;
}

export async function logoutUser(): Promise<void> {
    try {
        const response = await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Logout failed");
        }
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
}

