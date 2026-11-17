import type {ShippingOption} from "../store/shipping/types";

export async function getShippingOptions(): Promise<ShippingOption[]> {
    const response = await fetch("http://localhost:3000/api/shipping-options");

    if (!response.ok) {
        const message = await response.text();
        throw new Error(`Shipping error ${response.status}: ${message}`);
    }

    return response.json();
}