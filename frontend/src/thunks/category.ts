import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {RootState} from "../store";
import * as api from "../api/category.ts";
import * as action from "../store/category/action.ts";

export const fetchCategoriesThunk = (gender?: "men" | "women") => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const categories = await api.getCategories(gender);

        dispatch(action.loadCategoriesAction(categories));
    };
};