import {ShippingOption, LOAD_SHIPPING, LoadShippingAction} from "./types";

export const loadShippingAction = (data: ShippingOption[]): LoadShippingAction => {
    return {
        type: LOAD_SHIPPING,
        payload: {data}
    };
};