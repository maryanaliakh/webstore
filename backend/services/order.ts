
import * as orderQuery from "../queries/order";
import * as paymentQuery from "../queries/payment";
import { verifyAuthToken } from "./auth";
import {CreateOrderInput} from "../types/order";

export async function createOrder(input: CreateOrderInput, token?: string) {
    if (
        !input.customerName?.trim() ||
        !input.customerEmail?.trim() ||
        !input.customerPhone?.trim()
    ) {
        throw new Error("CUSTOMER_FIELDS_REQUIRED");
    }

    if (!Array.isArray(input.items) || input.items.length === 0) {
        throw new Error("CART_IS_EMPTY");
    }

    const paymentMethod = await paymentQuery.getPaymentMethod(input.paymentMethod);

    if (!paymentMethod) {
        throw new Error("INVALID_PAYMENT_METHOD");
    }

    if (!Number.isInteger(input.shippingOptionId) || input.shippingOptionId <= 0) {
        throw new Error("INVALID_SHIPPING_OPTION");
    }

    for (const item of input.items) {
        if (
            !Number.isInteger(item.variantId) ||
            !Number.isInteger(item.quantity) ||
            item.variantId <= 0 ||
            item.quantity <= 0
        ) {
            throw new Error("INVALID_CART_ITEM");
        }
    }

    const userId = token ? verifyAuthToken(token) : null;

    if (token && !userId) {
        throw new Error("INVALID_AUTH_TOKEN");
    }

    const variantIds = input.items.map(item => item.variantId);

    if (new Set(variantIds).size !== variantIds.length) {
        throw new Error("DUPLICATE_CART_ITEMS");
    }

    const { shipping, variants } = await orderQuery.getOrderData(
        input.shippingOptionId,
        variantIds
    );

    if (!shipping) {
        throw new Error("SHIPPING_OPTION_NOT_FOUND");
    }

    if (variants.length !== input.items.length) {
        throw new Error("PRODUCT_VARIANT_NOT_FOUND");
    }

    const now = new Date();
    let subtotal = 0;

    const orderItems = input.items.map(item => {
        const variant = variants.find(v => v.id === item.variantId)!;

        if (variant.stock < item.quantity) {
            throw new Error(`INSUFFICIENT_STOCK:${variant.id}`);
        }

        const product = variant.products;
        let price = Number(product.price);
        const discount = product.discounts;

        if (
            discount &&
            new Date(discount.start_date) <= now &&
            new Date(discount.end_date) >= now
        ) {
            price *= 1 - Number(discount.percentage) / 100;
        }

        price = Math.round(price * 100) / 100;
        subtotal += price * item.quantity;

        return {
            variantId: variant.id,
            productName: product.name,
            size: variant.size,
            color: variant.color,
            quantity: item.quantity,
            price
        };
    });

    subtotal = Math.round(subtotal * 100) / 100;

    return orderQuery.createOrder({
        userId,
        customerName: input.customerName.trim(),
        customerEmail: input.customerEmail.trim(),
        customerPhone: input.customerPhone.trim(),
        shippingOptionId: input.shippingOptionId,
        paymentMethod: input.paymentMethod,
        shippingCountry: input.shippingCountry,
        shippingCity: input.shippingCity,
        shippingPostalCode: input.shippingPostalCode,
        shippingStreet: input.shippingStreet,
        shippingBuilding: input.shippingBuilding,
        shippingApartment: input.shippingApartment,
        pickupPointId: input.pickupPointId,
        pickupPointName: input.pickupPointName,
        storeId: input.storeId,
        storeName: input.storeName,
        subtotal,
        items: orderItems
    });
}

export async function getUserOrders(userId: number) {
    const orders = await orderQuery.getUserOrders(userId);

    console.log("ORDER ITEM IMAGES:", orders[0]?.order_items[0]?.product_variants?.products.product_images);

    return orders.map(order => ({
        ...order,
        order_items: order.order_items.map(item => {
            const images = item.product_variants?.products.product_images || [];

            const image = images.find(img =>
                img.color?.toLowerCase() === item.color.toLowerCase()
            ) || images[0];

            return {
                ...item,
                image_url: image?.image_url || null
            };
        })
    }));
}

