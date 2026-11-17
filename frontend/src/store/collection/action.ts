import {CollectionActions, Collection, LOAD_COLLECTION, LOAD_LATEST_COLLECTION} from "./types.ts";

export const loadCollections = (data: Collection[]): CollectionActions => {
    return {
        type: LOAD_COLLECTION,
        payload: {
            data
        }
    }
}

export const loadLatestCollection = (data: Collection): CollectionActions => {
    return {
        type: LOAD_LATEST_COLLECTION,
        payload: {
            data
        }
    }
}