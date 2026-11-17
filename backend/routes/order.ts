import express from "express";
import * as orderService from "../services/order";
import {verifyAuthToken} from "../services/auth";

export const router = express.Router();

router.post("/api/orders", async (req, res) => {
    try {
        const token = req.cookies?.authToken;

        const order = await orderService.createOrder(req.body, token);

        res.status(201).json({
            message: "Order created successfully",
            order
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "";

        const validationErrors: Record<string, string> = {
            CUSTOMER_FIELDS_REQUIRED: "Customer information is required",
            CART_IS_EMPTY: "Your cart is empty",
            INVALID_PAYMENT_METHOD: "Invalid payment method",
            INVALID_SHIPPING_OPTION: "Invalid shipping option",
            INVALID_CART_ITEM: "Invalid cart item",
            INVALID_AUTH_TOKEN: "Authentication expired. Please sign in again.",
            SHIPPING_OPTION_NOT_FOUND: "Shipping option not found",
            PRODUCT_VARIANT_NOT_FOUND: "One or more product variants were not found",
            DUPLICATE_CART_ITEMS: "Duplicate cart items are not allowed"
        };

        if (message.startsWith("INSUFFICIENT_STOCK:")) {
            res.status(409).json({
                message: "Insufficient stock for one or more products"
            });
            return;
        }

        if (validationErrors[message]) {
            const status = message === "INVALID_AUTH_TOKEN" ? 401 : 400;

            res.status(status).json({
                message: validationErrors[message]
            });
            return;
        }

        console.error("Create order error:", error);

        res.status(500).json({
            message: "Could not create order"
        });
    }
});

router.get("/api/orders", async (req, res) => {
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            res.status(401).json({
                message: "Please sign in to view your orders"
            });
            return;
        }

        const userId = verifyAuthToken(token);

        if (!userId) {
            res.status(401).json({
                message: "Please sign in to view your orders"
            });
            return;
        }

        const orders = await orderService.getUserOrders(userId);

        res.status(200).json({orders});
    } catch (error) {
        console.error("GET ORDERS ERROR:", error);

        res.status(500).json({
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

