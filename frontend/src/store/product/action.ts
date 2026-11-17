import type {Product, ProductActions, ProductDetails, ProductFilterOptions} from "./types.ts";
import {
    LOAD_MODAL_PRODUCT_DETAILS,
    LOAD_PRODUCT,
    LOAD_PRODUCT_DETAILS,
    LOAD_PRODUCT_FILTER_OPTIONS,
    TOGGLE_PRODUCTS_FAVORITE
} from "./types.ts";

export const loadProducts = (data: Product[]): ProductActions => {
    return {
        type: LOAD_PRODUCT,
        payload: {
            data
        }
    }
}

export const loadProductFilterOptions = (data: ProductFilterOptions, target: "all" | "filtered"): ProductActions => ({
    type: LOAD_PRODUCT_FILTER_OPTIONS,
    payload: {
        data,
        target
    }
});

export const loadProductDetails = (data: ProductDetails) : ProductActions => {
    return {
        type: LOAD_PRODUCT_DETAILS,
        payload: {
            data
        }
    }
}

export const toggleProductFavorites = (data: number) : ProductActions => {
    return {
        type: TOGGLE_PRODUCTS_FAVORITE,
        payload: {
            data
        }
    }
}

export const loadModalProductDetails = (data: ProductDetails): ProductActions => ({
    type: LOAD_MODAL_PRODUCT_DETAILS,
    payload: {data}
});