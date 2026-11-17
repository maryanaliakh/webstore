import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import type {RootState} from "../store";
import * as api from "../api/order.ts";
import {loadOrdersAction, ordersErrorAction, ordersLoadingAction} from "../store/order/action.ts";

export const createOrderThunk = (data: api.CreateOrderInput) => {
    return async (_dispatch: ThunkDispatch<RootState, void, Action>) => {
        return await api.createOrder(data);
    };
};

export const fetchUserOrdersThunk = () => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        dispatch(ordersLoadingAction());

        try {
            const data = await api.getUserOrders();
            dispatch(loadOrdersAction(data));
            return data;
        } catch (error) {
            dispatch(ordersErrorAction(
                error instanceof Error ? error.message : "Could not retrieve orders"
            ));
            throw error;
        }
    };
};