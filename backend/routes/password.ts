import * as  passwordService from "../services/password";
import express from "express";
import {verifyAuthToken} from "../services/auth";
export const router = express.Router();

router.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            res.status(400).json({ message: "Email is required" });
            return;
        }

        await passwordService.requestPasswordReset(email);

        res.status(200).json({
            message: "If an account with this email exists, you will receive password reset instructions."
        });
    } catch (error) {
        console.error("Password reset request error:", error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

router.patch("/api/user/change-password", async (req, res) => {
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            res.status(401).json({message: "Please sign in"});
            return;
        }

        const userId = verifyAuthToken(token);

        if (!userId) {
            res.status(401).json({message: "Invalid token"});
            return;
        }

        const {currentPassword, newPassword} = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({message: "All fields are required"});
            return;
        }

        if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
            res.status(400).json({message: "Invalid password"});
            return;
        }

        if (newPassword.length < 8) {
            res.status(400).json({message: "Password must contain at least 8 characters"});
            return;
        }

        await passwordService.changePassword(userId, currentPassword, newPassword);

        res.status(200).json({message: "Password changed successfully"});
    } catch (error) {
        if (error instanceof Error && error.message === "Current password is incorrect") {
            res.status(400).json({message: error.message});
            return;
        }

        console.error("Change password error:", error);
        res.status(500).json({message: "Could not change password"});
    }
});