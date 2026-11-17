import {prisma as db} from "../db/index";

export async function getCollections(gender?: "men" | "women") {
    try {
        return await db.collections.findMany({
            where: gender ? {
                products: {
                    some: {
                        genders: {
                            name: gender
                        }
                    }
                }
            } : undefined,
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                image_1: true,
                image_2: true,
                image_3: true
            },
        });
    } catch (error) {
        console.error("Error fetching collections:", error)
        throw error
    }
}

export async function getLatestCollection() {
    try {
        return await db.collections.findFirst({
            orderBy: {
                id: "desc"
            },
            select: {
                id: true,
                name: true,
                image_1: true,
                image_2: true,
                image_3: true
            }
        });
    } catch (error) {
        console.error("Error fetching latest collection:", error);
        throw error;
    }
}