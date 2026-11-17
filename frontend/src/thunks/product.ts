import type {RootState} from "../store";
import * as api from "../api/product.ts";
import * as action from "../store/product/action.ts";
import * as selector from "../selectors/product.ts";
import {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {ProductFilters} from "../store/product/types.ts";


export const fetchProductsThunk = () => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => RootState) => {
        const state = getState()
        const filters = selector.productFilterSelector(state)
        const sort = selector.sortParamSelector(state)
        const products = await api.getProducts(filters, sort)

        dispatch(action.loadProducts(products))
    }
}

export const fetchProductFilterOptionsThunk = (filters?: ProductFilters) => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const allOptions = await api.getProductFilterOptions();
        dispatch(action.loadProductFilterOptions(allOptions, 'all'));

        if (filters) {
            const filteredOptions = await api.getProductFilterOptions(filters);
            dispatch(action.loadProductFilterOptions(filteredOptions, 'filtered'));
        }
    };
};

export const fetchProductDetailsThunk = (color?: string, id?: number) => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => RootState) => {
        const state = getState()
        const productId = id ?? selector.idSelector(state)

        const product = await api.getProductDetails(productId, color)
        dispatch(action.loadProductDetails(product))
    }
}

export const fetchModalProductDetailsThunk = (productId: number, color?: string) => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const product = await api.getProductDetails(productId, color);
        dispatch(action.loadModalProductDetails(product));
    };
};