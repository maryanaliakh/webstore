import { prisma as db } from "../db/index";

export async function getUserByEmail(email: string) {
    return db.users.findUnique({
        where: { email }
    });
}

export async function getUserByPhone(phone: string) {
    return db.users.findUnique({
        where: { phone }
    });
}

export async function createUser(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    newsletter_consent: boolean;
}) {
    return db.users.create({
        data: {
            ...data,
            terms_accepted: true,
            terms_accepted_at: new Date()
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            newsletter_consent: true,
            created_at: true
        }
    });
}

export async function getUserByEmailForLogin(email: string) {
    return db.users.findUnique({
        where: { email }
    });
}

export async function getUserById(id: number) {
    return db.users.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            newsletter_consent: true,
            created_at: true
        }
    });
}

export async function findOrCreateGoogleUser(data: { name: string; email: string; }) {
    const email = data.email.trim().toLowerCase();

    return db.users.upsert({
        where: { email },
        update: {
            name: data.name
        },
        create: {
            name: data.name,
            email,
            password: null,
            phone: null,
            newsletter_consent: false,
            terms_accepted: true,
            terms_accepted_at: new Date()
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            newsletter_consent: true,
            created_at: true
        }
    });
}