import express from 'express'
import {json, urlencoded} from "body-parser";
import {router as productRouter} from './products'

const routers = [productRouter];
export default function () {
    const app = express.Router();

    app.use(urlencoded({ extended: false }));
    app.use(json());

    routers.forEach(router => {
        app.use("/", router);
    });

    return app;
}