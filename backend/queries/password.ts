import { prisma as db } from "../db/index";

export async function createPasswordResetToken(userId: number, token: string, expiresAt: Date) {
    return db.password_reset_tokens.create({
        data: {
            user_id: userId,
            token,
            expires_at: expiresAt
        }
    });
}

export async function getPasswordResetToken(token: string) {
    return db.password_reset_tokens.findUnique({
        where: { token }
    });
}

export async function deletePasswordResetToken(token: string) {
    return db.password_reset_tokens.delete({
        where: { token }
    });
}

export async function deletePasswordResetTokensByUserId(userId: number) {
    return db.password_reset_tokens.deleteMany({
        where: { user_id: userId }
    });
}

export async function getPassword(userId: number) {
    return db.users.findUnique({
        where: {id: userId},
        select: {password: true}
    });
}

export async function updatePassword(userId: number, password: string) {
    return db.users.update({
        where: {id: userId},
        data: {password}
    });
}