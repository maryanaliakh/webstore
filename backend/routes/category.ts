import express from "express";
import * as categoryService from "../services/category";

export const router = express.Router();

router.get("/categories", async (req, res) => {
    try {
        const gender = req.query.gender as "men" | "women" | undefined;

        const categories = await categoryService.getCategories(gender);

        res.json(categories);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});