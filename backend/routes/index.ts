import express from "express";
import {router as productRouter} from "./product";
import {router as collectionRouter} from "./collection";
import {router as categoryRouter} from "./category";
import {router as discountRouter} from "./discount";
import {router as userRouter} from "./auth";
import {router as orderRouter} from "./order";
import {router as shippingRouter} from "./shipping";
import {router as paymentRouter} from "./payment";
import {router as addressRouter} from "./address";

const routers = [
    productRouter,
    collectionRouter,
    categoryRouter,
    discountRouter,
    userRouter,
    orderRouter,
    shippingRouter,
    paymentRouter,
    addressRouter
];

export default function() {
    const app = express.Router();

    routers.forEach(router => {
        app.use("/", router);
    });

    return app;
}