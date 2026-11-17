import { ProductFilters } from "../types/product"
import { Prisma } from "../db/generated/prisma/client";

export const getWhereConstruction = (params: ProductFilters, exclude?: keyof ProductFilters): Prisma.productsWhereInput => {
    const where: Prisma.productsWhereInput = {}

    if (params.q && exclude !== "q") {
        where.OR = [
            { name: { contains: params.q, mode: "insensitive" } },
            { subtitle: { contains: params.q, mode: "insensitive" } },
            { description: { contains: params.q, mode: "insensitive" } },
            { material: { contains: params.q, mode: "insensitive" } },
            { origin: { contains: params.q, mode: "insensitive" } },

            { categories: { name: { contains: params.q, mode: "insensitive" } } },
            { subcategories: { name: { contains: params.q, mode: "insensitive" } } },
            { collections: { name: { contains: params.q, mode: "insensitive" } } },
            { discounts: { name: { contains: params.q, mode: "insensitive" } } },

            {
                product_variants: {
                    some: {
                        color: { contains: params.q, mode: "insensitive" }
                    }
                }
            },
            {
                product_variants: {
                    some: {
                        size: { contains: params.q, mode: "insensitive" }
                    }
                }
            },
            {
                product_images: {
                    some: {
                        color: { contains: params.q, mode: "insensitive" }
                    }
                }
            }
        ];
    }

    if (params.category?.length && exclude !== "category") {
        where.categories = {
            name: {
                in: params.category
            }
        }
    }

    if (params.subcategory?.length && exclude !== "subcategory") {
        where.subcategories = {
            is: {
                name: {
                    in: params.subcategory
                }
            }
        }
    }

    if (params.material?.length && exclude !== "material") {
        where.material = {
            in: params.material
        }
    }

    if (params.origin?.length && exclude !== "origin") {
        where.origin = {
            in: params.origin
        }
    }

    if (params.gender && exclude !== "gender") {
        where.genders = {
            name: {
                equals: params.gender
            }
        }
    }

    if (params.discount?.length && exclude !== "discount") {
        where.discounts = {
            is: {
                name: {
                    in: params.discount
                },
                start_date: {
                    lte: new Date()
                },
                end_date: {
                    gte: new Date()
                }
            }
        };
    }

    if (params.collection?.length && exclude !== "collection") {
        where.collections = {
            name: {
                in: params.collection
            }
        }
    }

    if (
        (params.color?.length && exclude !== "color") ||
        (params.size?.length && exclude !== "size")
    ) {
        where.product_variants = {
            some: {
                ...(params.color?.length && exclude !== "color" && {
                    color: {
                        in: params.color
                    }
                }),

                ...(params.size?.length && exclude !== "size" && {
                    size: {
                        in: params.size
                    }
                })
            }
        }
    }

    if (
        (params.minPrice !== undefined && exclude !== "minPrice") ||
        (params.maxPrice !== undefined && exclude !== "maxPrice")
    ) {
        where.price = {
            ...(params.minPrice !== undefined && exclude !== "minPrice" && {
                gte: params.minPrice
            }),

            ...(params.maxPrice !== undefined && exclude !== "maxPrice" && {
                lte: params.maxPrice
            })
        }
    }

    return where
}