
import type {AddressesState, AddressesActions} from "./types.ts";
import {
    LOAD_ADDRESSES,
    ADDRESSES_LOADING,
    ADDRESSES_ERROR
} from "./types.ts";

const initialState: AddressesState = {
    data: [],
    loading: false,
    error: null
};

export function addressReducer(
    state = initialState,
    action: AddressesActions
): AddressesState {
    switch (action.type) {
        case ADDRESSES_LOADING:
            return {...state, loading: true, error: null};

        case LOAD_ADDRESSES:
            return {
                ...state,
                data: action.payload.data,
                loading: false,
                error: null
            };

        case ADDRESSES_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        default:
            return state;
    }
}
