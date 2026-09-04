import type {Dispatch} from "@reduxjs/toolkit";
import type {RootState} from "../../store";
import {push} from "connected-react-router";

export const modifyUrlThunk = (type: 'add' | 'delete', key: string, value?: string) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
        const params = new URL(window.location.href).searchParams
        if(type === 'add') {
            params.set(key, value)
            const filters = params.toString()
            console.log(filters)
            dispatch(push({search: filters}))
        } else {
            params.delete(key)
            const filters = params.toString()
            dispatch(push({search: filters}))
        }
    }