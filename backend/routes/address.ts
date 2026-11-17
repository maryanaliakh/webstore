import {Router} from "express";
import * as addressService from "../services/address";
import {verifyAuthToken} from "../services/auth";

export const router = Router();

router.get("/api/addresses", async (req, res) => {
    try {
        const token = req.cookies?.authToken;
        if (!token) {
            res.status(401).json({message: "Please sign in"});
            return;
        }

        const userId = verifyAuthToken(token);
        if (!userId) {
            res.status(401).json({message: "Invalid token"});
            return;
        }

        const addresses = await addressService.getUserAddresses(userId);
        res.status(200).json({addresses});
    } catch (error) {
        console.error("Get addresses error:", error);
        res.status(500).json({message: "Could not retrieve addresses"});
    }
});

router.post("/api/addresses", async (req, res) => {
    try {
        const token = req.cookies?.authToken;
        if (!token) {
            res.status(401).json({message: "Please sign in"});
            return;
        }

        const userId = verifyAuthToken(token);
        if (!userId) {
            res.status(401).json({message: "Invalid token"});
            return;
        }

        const address = await addressService.createAddress(userId, req.body);
        res.status(201).json({address});
    } catch (error) {
        console.error("Create address error:", error);
        res.status(500).json({message: "Could not create address"});
    }
});

router.delete("/api/addresses/:id", async (req, res) => {
    try {
        const token = req.cookies?.authToken;
        if (!token) {
            res.status(401).json({message: "Please sign in"});
            return;
        }

        const userId = verifyAuthToken(token);
        if (!userId) {
            res.status(401).json({message: "Invalid token"});
            return;
        }

        const addressId = Number(req.params.id);
        if (!Number.isInteger(addressId) || addressId <= 0) {
            res.status(400).json({message: "Invalid address ID"});
            return;
        }

        const result = await addressService.deleteAddress(userId, addressId);
        if (result.count === 0) {
            res.status(404).json({message: "Address not found"});
            return;
        }

        res.status(200).json({message: "Address deleted"});
    } catch (error) {
        console.error("Delete address error:", error);
        res.status(500).json({message: "Could not delete address"});
    }
});

export default router;
