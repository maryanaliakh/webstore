import {Product, ProductFilters} from "../types/product";
import {prisma as db} from "../db";
import * as _ from "lodash"
import { Prisma } from "../db/generated/prisma/client";
import { getWhereConstruction } from "../helpers/whereConstruction";

export async function getProducts(params: ProductFilters) {
    const where = getWhereConstruction(params);

    try {
        const products = await db.products.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                discount_id: true,

                product_variants: {
                    select: {
                        color: true
                    }
                },

                product_images: {
                    select: {
                        image_url: true
                    }
                },

                genders: {
                    select: {
                        name: true
                    }
                },

                categories: {
                    select: {
                        name: true
                    }
                },

                subcategories: {
                    select: {
                        name: true
                    }
                },

                collections: {
                    select: {
                        name: true
                    }
                }
            },

            where,

            orderBy: params.sort
                ? { price: params.sort }
                : undefined
        });

        return products.map(product => ({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            discount_id: product.discount_id,

            colors: _.uniq(
                product.product_variants.map(v => v.color)
            ),

            images: _.uniq(
                product.product_images.map(i => i.image_url)
            ),

            category: product.categories ? [product.categories.name] : [],
            subcategory: product.subcategories ? [product.subcategories.name] : [],
            gender: product.genders?.name,
            collection: product.collections?.name ?? null
        }));

    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}



export async function getProductFilterOptions(params: ProductFilters) {
    try {
        const where = getWhereConstruction(params);
        const categoriesWhere = getWhereConstruction(params, "category");

        const [
            colorProducts,
            sizeProducts,
            categoryProducts,
            subcategoryProducts,
            materialProducts,
            originProducts,
            collectionProducts,
            discountProducts,
            price
        ] = await Promise.all([
            db.products.findMany({
                where,
                select: {
                    product_variants: { select: { color: true } },
                    product_images: { select: { color: true } }
                }
            }),

            db.products.findMany({
                where,
                select: {
                    product_variants: { select: { size: true } }
                }
            }),

            db.products.findMany({
                where: categoriesWhere,
                select: {
                    categories: { select: { name: true } }
                }
            }),

            db.products.findMany({
                where,
                select: {
                    subcategories: { select: { name: true } }
                }
            }),

            db.products.findMany({
                where,
                select: { material: true }
            }),

            db.products.findMany({
                where,
                select: { origin: true }
            }),

            db.products.findMany({
                where,
                select: {
                    collections: { select: { name: true } }
                }
            }),

            db.products.findMany({
                where,
                select: {
                    discounts: {
                        select: {
                            name: true,
                            start_date: true,
                            end_date: true
                        }
                    }
                }
            }),

            db.products.aggregate({
                where,
                _min: { price: true },
                _max: { price: true }
            })
        ]);

        return {
            minPrice: price._min.price,
            maxPrice: price._max.price,

            colors: _.uniq([
                ...colorProducts.flatMap(product =>
                    product.product_variants.map(v => v.color)
                ),
                ...colorProducts.flatMap(product =>
                    product.product_images
                        .map(image => image.color)
                        .filter((color): color is string => color !== null)
                )
            ]).sort(),

            sizes: _.uniq(
                sizeProducts.flatMap(product =>
                    product.product_variants.map(v => v.size)
                )
            ).sort((a, b) => {
                const order = ["one size", "xs", "s", "m", "l", "xl", "xxl"];
                return (order.indexOf(a.toLowerCase()) + 1 || 99) -
                    (order.indexOf(b.toLowerCase()) + 1 || 99) ||
                    Number(a) - Number(b);
            }),

            categories: _.uniq(
                categoryProducts.map(product =>
                    product.categories.name
                )
            ),

            subcategories: _.uniq(
                subcategoryProducts
                    .map(product => product.subcategories?.name)
                    .filter((value): value is string => value !== null && value !== undefined)
            ),

            materials: _.uniq(
                materialProducts
                    .map(product => product.material)
                    .filter((value): value is string => value !== null)
            ),

            origins: _.uniq(
                originProducts
                    .map(product => product.origin)
                    .filter((value): value is string => value !== null)
            ),

            collections: _.uniq(
                collectionProducts
                    .map(product => product.collections?.name)
                    .filter((name): name is string => name !== null && name !== undefined)
            ),

            discounts: _.uniq(
                discountProducts
                    .filter(product => {
                        const discount = product.discounts;
                        const now = new Date();

                        return discount &&
                            new Date(discount.start_date) <= now &&
                            new Date(discount.end_date) >= now;
                    })
                    .map(product => product.discounts!.name)
            )
        };

    } catch (error) {
        console.error("Error fetching product filter options:", error);
        throw error;
    }
}

export async function getProductDetails(productId: number, color?: string) {
    try {
        const product = await db.products.findUnique({
            select: {
                id: true,
                name: true,
                subtitle: true,
                price: true,
                description: true,
                material: true,
                care: true,
                origin: true,

                categories: {
                    select: {
                        name: true
                    }
                },

                product_variants: {
                    select: {
                        id: true,
                        size: true,
                        color: true,
                        stock: true
                    }
                },

                product_images: {
                    select: {
                        id: true,
                        color: true,
                        image_url: true
                    }
                },

                genders: {
                    select: {
                        name: true
                    }
                }
            },

            where: {
                id: productId
            },
        });

        if (!product) {
            return null;
        }

        const colors = _.uniq(
            product.product_variants.map(v => v.color)
        );

        const selectedColor = color ?? colors[0];

        const variants = product.product_variants
            .filter(v => v.color === selectedColor)
            .map(v => ({
                id: v.id,
                size: v.size,
                stock: v.stock,
            }));

        const images = product.product_images
            .filter(image => image.color === selectedColor)
            .map(image => ({
                id: image.id,
                color: image.color,
                url: image.image_url,
            }));

        const shipOptions = await db.shipping_options.findMany();
        const returnOptions = await db.return_options.findMany();
        const returnPolicy = await db.return_policy.findMany();

        return {
            id: product.id,
            name: product.name,
            subtitle: product.subtitle,
            price: product.price,
            description: product.description,
            material: product.material,
            care: product.care,
            origin: product.origin,

            category: product.categories.name,

            colors,
            selectedColor,

            variants,
            images,

            gender: product.genders?.name,

            shipOptions: shipOptions.map(option => ({
                id: option.id,
                name: option.name,
                price: Number(option.price),
                description: option.description,
                deliveryTime: option.delivery_time,
            })),

            returnOptions: returnOptions.map(option => ({
                id: option.id,
                name: option.name,
                price: Number(option.price),
                description: option.description,
            })),

            returnPolicy: returnPolicy.map(option => ({
                id: option.id,
                description: option.description,
                title: option.title,
            })),
        };

    } catch (error) {
        console.error("Error fetching product details: ", error);
        throw error;
    }
}
