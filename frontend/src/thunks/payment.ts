import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import type {RootState} from "../store";
import * as api from "../api/payment.ts";
import * as action from "../store/payment/action.ts";

export const fetchPaymentThunk = () => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const methods = await api.getPaymentMethods();

        dispatch(action.loadPaymentAction(methods));
    };
};