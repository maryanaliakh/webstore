import * as query from "../queries/product";
import {ProductFilters} from "../types/product";

export const getProductDetails = async (id: number, color?: string) => {
    const productId = Number(id);
    return await query.getProductDetails(productId, color);
};

export const getProducts = async (params: any) => {
    return query.getProducts(params);
};

export const getProductFilterOptions = async (params: ProductFilters) => {
    return query.getProductFilterOptions(params);
};