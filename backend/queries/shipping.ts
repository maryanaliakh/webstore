import { prisma } from "../db";

export async function getShippingOptions() {
    return prisma.shipping_options.findMany({
        orderBy: { id: "asc" }
    });
}