import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {RootState} from "../store";
import * as api from "../api/collection.ts";
import * as action from "../store/collection/action.ts";

export const fetchLatestCollectionThunk = () => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const collection = await api.getLatestCollection()

        dispatch(action.loadLatestCollection(collection))
    }
}

export const fetchCollectionsThunk = (gender?: "men" | "women") => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const collections = await api.getCollections(gender)

        dispatch(action.loadCollections(collections))
    }
}