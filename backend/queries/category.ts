import {prisma as db} from "../db/index";
import {getWhereConstruction} from "../helpers/whereConstruction";

export async function getCategories(gender?: "men" | "women") {
    try {
        return await db.categories.findMany({
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
                image: true,
            }
        });
    } catch (error) {
        console.error("Error fetching categories:", error)
        throw error
    }
}