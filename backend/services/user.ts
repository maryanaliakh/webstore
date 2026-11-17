import * as userQuery from "../queries/user";
import bcrypt from "bcryptjs";

export async function createUser(data: UserData) {
    const { name, email, password, phone, newsletterConsent, termsAccepted } = data;

    if (!name?.trim() || !email?.trim() || !password || !phone?.trim()) {
        throw new Error("All required fields must be filled in");
    }

    if (password.length < 8) {
        throw new Error("Password must contain at least 8 characters");
    }

    if (!termsAccepted) {
        throw new Error("You must accept the terms and conditions");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    const existingEmail = await userQuery.getUserByEmail(normalizedEmail);

    if (existingEmail) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const existingPhone = await userQuery.getUserByPhone(normalizedPhone);

    if (existingPhone) {
        throw new Error("PHONE_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return userQuery.createUser({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: normalizedPhone,
        newsletter_consent: Boolean(newsletterConsent)
    });
}

export async function loginUser(data: {
    email: string;
    password: string;
}) {
    const { email, password } = data;

    if (!email?.trim() || !password) {
        throw new Error("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userQuery.getUserByEmailForLogin(normalizedEmail);

    if (!user || !user.password) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
}

export async function getUserById(id: number) {
    return userQuery.getUserById(id);
}

export async function loginWithGoogle(data: {
    name: string;
    email: string;
}) {
    if (!data.name?.trim() || !data.email?.trim()) {
        throw new Error("Google account information is incomplete");
    }

    return userQuery.findOrCreateGoogleUser({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase()
    });
}