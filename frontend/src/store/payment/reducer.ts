import {PaymentActions, PaymentState, LOAD_PAYMENT} from "./types";

const initialPaymentState: PaymentState = {
    data: []
};

export const paymentReducer = (state = initialPaymentState, action: PaymentActions): PaymentState => {
    switch (action.type) {
        case LOAD_PAYMENT:
            return {
                ...state,
                data: action.payload.data
            };
        default:
            return state;
    }
};