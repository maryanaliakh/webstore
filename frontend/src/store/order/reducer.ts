import {OrdersActions, OrdersState, LOAD_ORDERS, ORDERS_LOADING, ORDERS_ERROR} from "./types";

const initialOrdersState: OrdersState = {
    data: [],
    loading: false,
    error: null
};

export const orderReducer = (state = initialOrdersState, action: OrdersActions): OrdersState => {
    switch (action.type) {
        case ORDERS_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };

        case LOAD_ORDERS:
            return {
                ...state,
                data: action.payload.data,
                loading: false,
                error: null
            };

        case ORDERS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        default:
            return state;
    }
};