import express from "express";
import * as paymentService from "../services/payment";

export const router = express.Router();

router.get("/api/payment-methods", async (_req, res) => {
    try {
        const methods = await paymentService.getPaymentMethods();
        res.status(200).json(methods);
    } catch (error) {
        console.error("Get payment methods error:", error);
        res.status(500).json({message: "Could not load payment methods"});
    }
});