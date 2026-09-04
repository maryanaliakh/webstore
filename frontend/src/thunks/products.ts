import type {Dispatch} from "@reduxjs/toolkit";
import type {RootState} from "../../store";
import {getProducts} from "../api/products.ts";
import {loadProducts} from "../../store/product/action.ts";
import {productFilterSelector} from "../selectors/products.ts";


export const fetchProductsThunk = () => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const state = getState()
        const filters = productFilterSelector(state)
        const products = await getProducts(filters.q);

        dispatch(loadProducts(products))
    }
}

