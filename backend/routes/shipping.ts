import express from "express";
import * as shippingService from "../services/shipping";

export const router = express.Router();

router.get("/api/shipping-options", async (_req, res) => {
    try {
        const options = await shippingService.getShippingOptions();
        res.status(200).json(options);
    } catch (error) {
        console.error("Get shipping options error:", error);
        res.status(500).json({message: "Could not load shipping options"});
    }
});