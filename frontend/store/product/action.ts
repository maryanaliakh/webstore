import type {Product, ProductsActions} from "./types";
import {LOAD_PRODUCTS} from "./types";

export const loadProducts = (data: Product[]): ProductsActions => {
    return {
        type: LOAD_PRODUCTS,
        payload: {
            data
        }
    }
}
