
import { prisma } from "../db";
import {CreateOrderData} from "../types/order";

export async function getOrderData(shippingOptionId: number, variantIds: number[]) {
    const shipping = await prisma.shipping_options.findUnique({
        where: { id: shippingOptionId }
    });

    const variants = await prisma.product_variants.findMany({
        where: { id: { in: variantIds } },
        include: {
            products: {
                include: {
                    discounts: true
                }
            }
        }
    });

    return { shipping, variants };
}

export async function createOrder(data: CreateOrderData) {
    return prisma.$transaction(async (tx) => {
        const shipping = await tx.shipping_options.findUnique({
            where: { id: data.shippingOptionId }
        });

        if (!shipping) {
            throw new Error("SHIPPING_OPTION_NOT_FOUND");
        }

        for (const item of data.items) {
            const result = await tx.product_variants.updateMany({
                where: {
                    id: item.variantId,
                    stock: { gte: item.quantity }
                },
                data: {
                    stock: { decrement: item.quantity }
                }
            });

            if (result.count !== 1) {
                throw new Error(`INSUFFICIENT_STOCK:${item.variantId}`);
            }
        }

        const shippingPrice = Number(shipping.price);
        const total = Math.round((data.subtotal + shippingPrice) * 100) / 100;

        return tx.orders.create({
            data: {
                user_id: data.userId,
                customer_name: data.customerName,
                customer_email: data.customerEmail,
                customer_phone: data.customerPhone,
                shipping_option_id: shipping.id,
                shipping_method: shipping.name,
                shipping_country: data.shippingCountry,
                shipping_city: data.shippingCity,
                shipping_postal_code: data.shippingPostalCode,
                shipping_street: data.shippingStreet,
                shipping_building: data.shippingBuilding,
                shipping_apartment: data.shippingApartment,
                shipping_price: shippingPrice.toFixed(2),
                pickup_point_id: data.pickupPointId,
                pickup_point_name: data.pickupPointName,
                store_id: data.storeId,
                store_name: data.storeName,
                payment_method: data.paymentMethod,
                subtotal: data.subtotal.toFixed(2),
                total: total.toFixed(2),
                status: "pending",
                order_items: {
                    create: data.items.map(item => ({
                        variant_id: item.variantId,
                        product_name: item.productName,
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity,
                        price: item.price.toFixed(2)
                    }))
                },
                payments: {
                    create: {
                        method: data.paymentMethod,
                        status: "succeeded",
                        transaction_id: `TEST-${Date.now()}`
                    }
                }
            },
            include: {
                order_items: true,
                payments: true
            }
        });
    });
}


export async function getUserOrders(userId: number) {
    return prisma.orders.findMany({
        where: {
            user_id: userId
        },
        include: {
            order_items: {
                include: {
                    product_variants: {
                        include: {
                            products: {
                                include: {
                                    product_images: true
                                }
                            }
                        }
                    }
                }
            },
            payments: true
        },
        orderBy: {
            created_at: "desc"
        }
    });
}

