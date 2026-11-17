import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import type {RootState} from "../store";
import * as api from "../api/shipping.ts";
import * as action from "../store/shipping/action.ts";

export const fetchShippingThunk = () => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const options = await api.getShippingOptions();

        dispatch(action.loadShippingAction(options));
    };
};