import express from "express";
import * as productService from "../services/products";
export const router = express.Router();

router.get('/product/search', async (req, res) => {
    try {
        const search = req.query.q as string | undefined;
        const colors = req.query.color as string | undefined;
        const sizes = req.query.size as string | undefined;
        const categories = req.query.category as string | undefined;
        const materials = req.query.material as string | undefined;
        const origins = req.query.origin as string | undefined;
        const sort = req.query.sort as string | undefined;

        const minPrice = req.query.minPrice
            ? Number(req.query.minPrice)
            : undefined;

        const maxPrice = req.query.maxPrice
            ? Number(req.query.maxPrice)
            : undefined;

        const products = await productService.getProducts({search, colors, sizes, categories, materials, origins, minPrice, maxPrice, sort});

        if(!products.length) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.json(products)
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
})

router.get('/product/:id', async (req, res) => {
    try {
        const {product, shipReturn} = await productService.getProduct(req.params.id);
        if(!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.json({product, shipReturn})
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
})


