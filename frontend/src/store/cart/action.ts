import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    type CartItem,
    type CartActions,
    CLEAR_CART
} from "./types.ts";

export const addToCart = (data: CartItem): CartActions => {
    return {
        type: ADD_TO_CART,
        payload: {data}
    }
};

export const removeFromCart = (variantId: number): CartActions => {
    return {
        type: REMOVE_FROM_CART,
        payload: {variantId}
    }
};

export const updateCartQuantity = (variantId: number, quantity: number): CartActions => {
    return {
        type: UPDATE_CART_QUANTITY,
        payload: {variantId, quantity}
    }
};

export const clearCart = (): CartActions => {
    return {
        type: CLEAR_CART
    }
};