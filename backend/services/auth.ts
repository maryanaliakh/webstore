import jwt from "jsonwebtoken";

export function createAuthToken(userId: number, keepSignedIn = false): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        { userId },
        secret,
        keepSignedIn ? { expiresIn: "30d" } : {}
    );
}

export function verifyAuthToken(token: string): number | null {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    try {
        const decoded = jwt.verify(token, secret);

        if (
            typeof decoded === "object" &&
            decoded !== null &&
            "userId" in decoded &&
            typeof decoded.userId === "number"
        ) {
            return decoded.userId;
        }

        return null;
    } catch {
        return null;
    }
}
