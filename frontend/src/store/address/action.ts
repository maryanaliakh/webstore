import {LOAD_ADDRESSES, ADDRESSES_LOADING, ADDRESSES_ERROR} from "./types.ts";
import type {Address, LoadAddressesAction, AddressesLoadingAction, AddressesErrorAction} from "./types.ts";

export function loadAddress(data: Address[]): LoadAddressesAction {
    return {
        type: LOAD_ADDRESSES,
        payload: {data}
    };
}

export function addressLoading(): AddressesLoadingAction {
    return {
        type: ADDRESSES_LOADING
    };
}

export function addressError(error: string): AddressesErrorAction {
    return {
        type: ADDRESSES_ERROR,
        payload: {error}
    };
}
