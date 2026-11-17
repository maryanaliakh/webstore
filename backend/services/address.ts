
import * as addressQuery from "../queries/address";

export async function getUserAddresses(userId: number) {
    return addressQuery.getUserAddresses(userId);
}

export async function createAddress(userId: number, data: {
    name: string;
    phone: string;
    country: string;
    city: string;
    postal_code: string;
    street: string;
    building: string;
    apartment?: string | null;
    is_default?: boolean;
}) {
    return addressQuery.createAddress(userId, data);
}

export async function deleteAddress(userId: number, addressId: number) {
    return addressQuery.deleteAddress(userId, addressId);
}
