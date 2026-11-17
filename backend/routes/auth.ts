import express from "express";
import * as userService from "../services/user";
import { createAuthToken, verifyAuthToken } from "../services/auth";
import { requestPasswordReset } from "../services/password";
import { getSession } from "@auth/express";
import { authOptions } from "../clients/auth";

export const router = express.Router();

router.post("/api/auth/register", async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const keepSignedIn = req.body.keepSignedIn === true;

        res.cookie("authToken", createAuthToken(user.id, keepSignedIn), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            ...(keepSignedIn ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
            path: "/"
        });

        res.status(201).json({
            message: "Registration successful",
            user
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "";

        if (message === "EMAIL_ALREADY_EXISTS") {
            res.status(409).json({ message: "Email is already registered" });
            return;
        }

        if (message === "PHONE_ALREADY_EXISTS") {
            res.status(409).json({ message: "Phone number is already registered" });
            return;
        }

        if (
            message === "All required fields must be filled in" ||
            message === "Password must contain at least 8 characters" ||
            message === "You must accept the terms and conditions"
        ) {
            res.status(400).json({ message });
            return;
        }

        if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
            res.status(409).json({ message: "Email or phone number is already registered" });
            return;
        }

        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.post("/api/auth/login", async (req, res) => {
    try {
        const user = await userService.loginUser(req.body);

        const rememberMe = req.body.rememberMe === true;

        res.cookie("authToken", createAuthToken(user.id, rememberMe), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
            path: "/"
        });

        res.status(200).json({
            message: "Login successful",
            user
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "";

        if (message === "INVALID_CREDENTIALS") {
            res.status(401).json({
                message: "Invalid email or password"
            });
            return;
        }

        if (message === "Email and password are required") {
            res.status(400).json({ message });
            return;
        }

        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/api/auth/me", async (req, res) => {
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        const userId = verifyAuthToken(token);

        if (!userId) {
            res.status(401).json({ message: "Invalid or expired token" });
            return;
        }

        const user = await userService.getUserById(userId);

        if (!user) {
            res.clearCookie("authToken", { path: "/" });
            res.status(401).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/api/auth/logout", (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    res.status(200).json({
        message: "Logout successful"
    });
});

router.post("/api/auth/google/session", async (req, res) => {
    try {
        const session = await getSession(req, authOptions);
        const userId = Number(session?.user?.id);

        if (!session?.user?.id || !Number.isInteger(userId) || userId <= 0) {
            res.status(401).json({ message: "Google authentication required" });
            return;
        }

        res.cookie("authToken", createAuthToken(userId), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        res.status(200).json({
            message: "Google login successful"
        });
    } catch (error) {
        console.error("Google session error:", error);
        res.status(500).json({ message: "Server error" });
    }
});