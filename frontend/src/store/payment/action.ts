import {PaymentMethod, LOAD_PAYMENT, LoadPaymentAction} from "./types";

export const loadPaymentAction = (data: PaymentMethod[]): LoadPaymentAction => {
    return {
        type: LOAD_PAYMENT,
        payload: {data}
    };
};