import crypto from "crypto";
import {getUserByEmail} from "../queries/user";
import {
    createPasswordResetToken,
    deletePasswordResetTokensByUserId,
    getPassword,
    updatePassword
} from "../queries/password";
import {sendEmail} from "./email";
import bcrypt from "bcryptjs";


export function generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

export async function requestPasswordReset(email: string) {
    const user = await getUserByEmail(email.trim().toLowerCase());

    if (!user) {
        return;
    }

    const token = generatePasswordResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await deletePasswordResetTokensByUserId(user.id);
    await createPasswordResetToken(user.id, token, expiresAt);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(
        user.email,
        "Reset your BUBBLE password",
        `
            <h2>Reset your password</h2>
            <p>We received a request to reset your BUBBLE account password.</p>
            <p><a href="${resetUrl}">Reset password</a></p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, you can ignore this email.</p>
        `
    );
}

export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await getPassword(userId);

    if (!user || !user.password) {
        throw new Error("User not found or password is not set");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(userId, hashedPassword);
}