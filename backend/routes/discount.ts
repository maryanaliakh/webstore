import express from "express";
import * as discountService from "../services/discount";

export const router = express.Router();

router.get('/discounts', async (req, res) => {
    try {
        const gender = req.query.gender as "men" | "women" | undefined;
        const discounts = await discountService.getDiscounts(gender);
        res.json(discounts);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});