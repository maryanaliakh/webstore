import {Collection, CollectionActions, CollectionState, LOAD_COLLECTION, LOAD_LATEST_COLLECTION} from "./types.ts";

const initialCollectionState: CollectionState = {
    data: [],
}

const initialLatestCollectionState: Collection = {
    id: undefined,
    name: null,
    image_1: null,
    image_2: null,
    image_3: null
}

export const collectionReducer = (state = initialCollectionState, action: CollectionActions) => {
    switch (action.type) {
        case LOAD_COLLECTION: {
            return {
                ...state,
                data: action.payload.data
            }
        }
        default: {
            return state
        }
    }
}

export const latestCollectionReducer = (state = initialLatestCollectionState, action: CollectionActions) => {
    switch (action.type) {
        case LOAD_LATEST_COLLECTION: {
            return {
                ...state,
                id: action.payload.data.id,
                name: action.payload.data.name,
                image_1: action.payload.data.image_1,
                image_2: action.payload.data.image_2,
                image_3: action.payload.data.image_3
            }
        }
        default: {
            return state
        }
    }
}