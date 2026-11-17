import { prisma } from "../db";

export async function getPaymentMethods() {
    return prisma.payment_methods.findMany({
        where: { is_active: true },
        orderBy: { display_order: "asc" }
    });
}

export async function getPaymentMethod(name: string) {
    return prisma.payment_methods.findFirst({
        where: {
            name,
            is_active: true
        }
    });
}