
import type {Address} from "../store/address/types.ts";
import {loadAddress, addressLoading, addressError} from "../store/address/action.ts";

export function fetchUserAddressesThunk() {
    return async (dispatch: any) => {
        dispatch(addressLoading());

        try {
            const response = await fetch("http://localhost:3000/api/addresses", {
                method: "GET",
                credentials: "include"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Could not retrieve addresses");
            }

            dispatch(loadAddress(result.addresses as Address[]));
        } catch (error) {
            dispatch(addressError(
                error instanceof Error ? error.message : "Unknown error"
            ));
        }
    };
}
