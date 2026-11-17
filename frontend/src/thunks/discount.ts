import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {RootState} from "../store";
import * as api from "../api/discount.ts";
import * as action from "../store/discount/action.ts";
export function fetchDiscountsThunk(gender?: "men" | "women") {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const discounts = await api.getDiscounts(gender)

        dispatch(action.loadDiscount(discounts))
    }
}

