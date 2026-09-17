import express from "express";
import * as productService from "../services/products";
import {getProductInfo} from "../queries/products";
export const router = express.Router();

router.get('/products', async (req, res) => {
    try {
        const search = req.query.q as string | undefined;

        const color = req.query.color
            ? Array.isArray(req.query.color) ? req.query.color as string[] : [req.query.color as string]
            : undefined;

        const size = req.query.size
            ? Array.isArray(req.query.size) ? req.query.size as string[] : [req.query.size as string]
            : undefined;

        const category = req.query.category
            ? Array.isArray(req.query.category) ? req.query.category as string[] : [req.query.category as string]
            : undefined;

        const material = req.query.material
            ? Array.isArray(req.query.material) ? req.query.material as string[] : [req.query.material as string]
            : undefined;

        const origin = req.query.origin
            ? Array.isArray(req.query.origin) ? req.query.origin as string[] : [req.query.origin as string]
            : undefined;

        const gender = req.query.gender as string | undefined;
        const sort = req.query.sort as string | undefined;

        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

        const products = await productService.getProducts({
            search,
            color,
            size,
            category,
            material,
            origin,
            minPrice,
            maxPrice,
            gender,
            sort
        });

        res.json(products);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


router.get('/productInfo', async (req, res) => {
    try {
        const result = await getProductInfo();
        if(!result) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.json(result)
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
})

// router.get('/product/:id', async (req, res) => {
//     try {
//         const {product, shipReturn} = await productService.getProduct(req.params.id);
//         if(!product) {
//             return res.status(404).json({
//                 message: "Product not found"
//             });
//         }
//         res.json({product, shipReturn})
//     } catch (error) {
//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// })


