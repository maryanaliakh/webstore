import {ShippingActions, ShippingState, LOAD_SHIPPING} from "./types";

const initialShippingState: ShippingState = {
    data: []
};

export const shippingReducer = (state = initialShippingState, action: ShippingActions): ShippingState => {
    switch (action.type) {
        case LOAD_SHIPPING:
            return {
                ...state,
                data: action.payload.data
            };
        default:
            return state;
    }
};