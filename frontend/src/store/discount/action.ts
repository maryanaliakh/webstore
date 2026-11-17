import {LOAD_DISCOUNT, Discount, DiscountActions} from "./types.ts";

export const loadDiscount = (data: Discount[]): DiscountActions => {
    return {
        type: LOAD_DISCOUNT,
        payload: {
            data
        }
    }
}