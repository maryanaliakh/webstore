import {DiscountActions, DiscountState, LOAD_DISCOUNT} from "./types.ts";


const initialDiscountState: DiscountState = {
    data: [],
}

export const discountReducer = (state = initialDiscountState, action: DiscountActions) => {
    switch(action.type) {
        case LOAD_DISCOUNT: {
            return {
                state,
                data: action.payload.data
            }
        }
        default: {
            return state
        }
    }
}