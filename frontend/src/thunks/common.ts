import type {Dispatch} from "@reduxjs/toolkit";
import type {RootState} from "../store";
import {push} from "redux-first-history";

export const modifyUrlThunk = (key: string, value: string | string[]) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
        const params = new URL(window.location.href).searchParams
        console.log(value)
        if(value.length > 0) {
            if(typeof value === "string") {
                params.set(key, value);
            } else {
                params.delete(key)
                value.forEach(val => params.append(key, val))
            }
        } else {
            params.delete(key)
        }
        const filters = params.toString()
        dispatch(push({search: filters}))
    }

export const clearSearchThunk = () =>
    async (dispatch: Dispatch, getState: () => RootState) => {
        const state = getState();

        const pathname = state.router.location.pathname;
        console.log(pathname)
        dispatch(
            push({
                pathname,
                search: ""
            })
        );
    }
