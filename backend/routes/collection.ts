import express from "express";
import * as collectionService from "../services/collection";

export const router = express.Router();

router.get('/collections', async (req, res) => {
    try {
        const gender = req.query.gender as "men" | "women" | undefined;
        const collections = await collectionService.getCollections(gender);

        res.json(collections);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get('/latest-collection', async (req, res) => {
    try {
        const collection = await collectionService.getLatestCollection();

        res.json(collection);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});