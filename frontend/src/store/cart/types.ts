export interface CartItem {
    productId: number;
    variantId: number;
    quantity: number;
    name: string;
    price: string;
    image: string;
    color: string;
    size: string;
    stock: number;
}

export interface CartState {
    items: CartItem[];
}

export const ADD_TO_CART = "CART/ADD";
export const REMOVE_FROM_CART = "CART/REMOVE";
export const UPDATE_CART_QUANTITY = "CART/UPDATE_QUANTITY";

export const CLEAR_CART = "CART/CLEAR";
export interface AddToCartAction {
    type: typeof ADD_TO_CART;
    payload: {data: CartItem};
}

export interface RemoveFromCartAction {
    type: typeof REMOVE_FROM_CART;
    payload: {variantId: number};
}

export interface UpdateCartQuantityAction {
    type: typeof UPDATE_CART_QUANTITY;
    payload: {variantId: number; quantity: number};
}

export interface ClearCartAction {
    type: typeof CLEAR_CART;
}

export type CartActions = AddToCartAction | RemoveFromCartAction | UpdateCartQuantityAction | ClearCartAction;
