
export interface Address {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    country: string;
    city: string;
    postal_code: string;
    street: string;
    building: string;
    apartment: string | null;
    is_default: boolean;
    created_at: string;
}

export interface AddressesState {
    data: Address[];
    loading: boolean;
    error: string | null;
}

export const LOAD_ADDRESSES = "ADDRESSES/LOAD";
export const ADDRESSES_LOADING = "ADDRESSES/LOADING";
export const ADDRESSES_ERROR = "ADDRESSES/ERROR";

export interface LoadAddressesAction {
    type: typeof LOAD_ADDRESSES;
    payload: { data: Address[] };
}

export interface AddressesLoadingAction {
    type: typeof ADDRESSES_LOADING;
}

export interface AddressesErrorAction {
    type: typeof ADDRESSES_ERROR;
    payload: { error: string };
}

export type AddressesActions = | LoadAddressesAction | AddressesLoadingAction | AddressesErrorAction;
