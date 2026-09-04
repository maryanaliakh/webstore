import * as query from "../queries/products";

export const getProduct = async(params) => {
    const productId = Number(params)
    const product = await query.getProduct(productId);
    const shipReturn = await query.getShipReturn();

    return {product, shipReturn}
}


export const getProducts = async (params) => {
    return query.getProducts(params)
}