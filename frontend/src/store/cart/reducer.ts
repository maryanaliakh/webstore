import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    type CartState,
    type CartActions,
    type CartItem,
    CLEAR_CART
} from "./types.ts";

const loadCart = (): CartItem[] => {
    try {
        const items: unknown = JSON.parse(localStorage.getItem("cart") || "[]");
        return Array.isArray(items)
            ? items.filter((i): i is CartItem =>
                i && typeof i === "object" && typeof i.variantId === "number" &&
                typeof i.name === "string" && typeof i.image === "string" &&
                typeof i.price === "string" && typeof i.stock === "number")
            : [];
    } catch {
        return [];
    }
};

const initialState: CartState = {
    items: loadCart()
};

export const cartReducer = (state = initialState, action: CartActions): CartState => {
    switch (action.type) {
        case ADD_TO_CART: {
            const item = action.payload.data;
            const existing = state.items.find(i => i.variantId === item.variantId);

            return {
                ...state,
                items: existing
                    ? state.items.map(i => i.variantId === item.variantId
                        ? {...item, quantity: Math.min(i.quantity + item.quantity, item.stock)}
                        : i)
                    : [...state.items, {...item, quantity: Math.min(item.quantity, item.stock)}]
            };
        }

        case REMOVE_FROM_CART:
            return {...state, items: state.items.filter(i => i.variantId !== action.payload.variantId)};

        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                items: state.items.map(i => i.variantId === action.payload.variantId
                    ? {...i, quantity: Math.max(1, Math.min(action.payload.quantity, i.stock))}
                    : i)
            };

        case CLEAR_CART:
            return {...state, items: []};

        default:
            return state;
    }
};