import { prisma as db } from "../db";

export async function getDiscounts(gender?: "men" | "women") {
    try {
        const now = new Date();

        return await db.discounts.findMany({
            where: {
                start_date: { lte: now },
                end_date: { gte: now },
                ...(gender && {
                    products: {
                        some: {
                            genders: {
                                name: gender
                            }
                        }
                    }
                })
            },
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                percentage: true,
                start_date: true,
                end_date: true
            }
        });

    } catch (error) {
        console.error("Error fetching discounts:", error);
        throw error;
    }
}