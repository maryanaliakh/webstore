import type { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { push } from "redux-first-history";
import type { RootState } from "../store";


export const modifyUrlThunk = (key: string, value: string | string[]) =>
    async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const params = new URL(window.location.href).searchParams;

        if (value.length > 0) {
            if (typeof value === "string") {
                params.set(key, value);
            } else {
                params.delete(key);
                value.forEach(val => params.append(key, val));
            }
        } else {
            params.delete(key);
        }

        const filters = params.toString();

        dispatch(push({
            search: filters
        }));
    };

export const clearSearchThunk = () =>
    async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => RootState) => {
        const pathname = getState().router.location.pathname;

        dispatch(push({
            pathname,
            search: ""
        }));
    };

export const selectPanelFiltersThunk = (gender: "men" | "women", key?: string, value?: string) =>
    async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const params = new URL(window.location.href).searchParams;

        ["q", "category", "subcategory", "collection", "discount"].forEach(key => params.delete(key));

        params.set("gender", gender);

        if (key && value) {
            params.set(key, value);
        }

        dispatch(push({
            pathname: "/products",
            search: params.toString()
        }));
    };