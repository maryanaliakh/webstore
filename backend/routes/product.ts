import express from "express";
import * as productService from "../services/product";
import {ProductFilters} from "../types/product";

export const router = express.Router();

router.get('/products', async (req, res) => {
    try {
        const params: ProductFilters = {
            q: req.query.q as string | undefined,

            color: req.query.color
                ? Array.isArray(req.query.color)
                    ? req.query.color as string[]
                    : [req.query.color as string]
                : undefined,

            size: req.query.size
                ? Array.isArray(req.query.size)
                    ? req.query.size as string[]
                    : [req.query.size as string]
                : undefined,

            category: req.query.category
                ? Array.isArray(req.query.category)
                    ? req.query.category as string[]
                    : [req.query.category as string]
                : undefined,

            subcategory: req.query.subcategory
                ? Array.isArray(req.query.subcategory)
                    ? req.query.subcategory as string[]
                    : [req.query.subcategory as string]
                : undefined,

            material: req.query.material
                ? Array.isArray(req.query.material)
                    ? req.query.material as string[]
                    : [req.query.material as string]
                : undefined,

            origin: req.query.origin
                ? Array.isArray(req.query.origin)
                    ? req.query.origin as string[]
                    : [req.query.origin as string]
                : undefined,

            collection: req.query.collection
                ? Array.isArray(req.query.collection)
                    ? req.query.collection as string[]
                    : [req.query.collection as string]
                : undefined,

            discount: req.query.discount
                ? Array.isArray(req.query.discount)
                    ? req.query.discount as string[]
                    : [req.query.discount as string]
                : undefined,

            gender: req.query.gender as 'men' | 'women' | undefined,

            minPrice: req.query.minPrice
                ? Number(req.query.minPrice)
                : undefined,

            maxPrice: req.query.maxPrice
                ? Number(req.query.maxPrice)
                : undefined,

            sort: req.query.sort as 'asc' | 'desc' | undefined,
        };

        const products = await productService.getProducts(params);

        res.json(products);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/product-filter-options", async (req, res) => {
    try {
        const params: ProductFilters = {
            q: req.query.q as string | undefined,

            category: Array.isArray(req.query.category)
                ? req.query.category as string[]
                : req.query.category ? [req.query.category as string] : [],

            collection: Array.isArray(req.query.collection)
                ? req.query.collection as string[]
                : req.query.collection ? [req.query.collection as string] : [],

            gender: req.query.gender === "men" || req.query.gender === "women"
                ? req.query.gender
                : undefined
        };

        const options = await productService.getProductFilterOptions(params);

        if (!options) {
            return res.status(404).json({
                message: "Filter options not found"
            });
        }

        res.json(options);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/product/:id", async (req, res) => {
    try {
        const productId = Number(req.params.id);

        if (!Number.isInteger(productId) || productId <= 0) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const color = typeof req.query.color === "string"
            ? req.query.color
            : undefined;

        const product = await productService.getProductDetails(
            productId,
            color
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        console.error("GET PRODUCT DETAILS ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

