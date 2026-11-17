import {Order, LOAD_ORDERS, LoadOrdersAction, ORDERS_LOADING, OrdersLoadingAction, ORDERS_ERROR, OrdersErrorAction} from "./types";
import {getUserOrders} from "../../api/order.ts";

export const loadOrdersAction = (data: Order[]): LoadOrdersAction => ({
    type: LOAD_ORDERS,
    payload: {data}
});

export const ordersLoadingAction = (): OrdersLoadingAction => ({
    type: ORDERS_LOADING
});

export const ordersErrorAction = (error: string): OrdersErrorAction => ({
    type: ORDERS_ERROR,
    payload: {error}
});

export const getOrders = () => async (dispatch: any) => {
    dispatch(ordersLoadingAction());

    try {
        const data = await getUserOrders();
        dispatch(loadOrdersAction(data));
    } catch (error) {
        dispatch(ordersErrorAction(
            error instanceof Error ? error.message : "Could not retrieve orders"
        ));
    }
};