import type {Product, ProductFilters, ProductsActions} from "./types.ts";
import {LOAD_PRODUCTS} from "./types.ts";

export const loadProducts = (data: Product[]): ProductsActions => {
    return {
        type: LOAD_PRODUCTS,
        payload: {
            data
        }
    }
}