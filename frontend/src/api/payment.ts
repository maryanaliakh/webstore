import type {PaymentMethod} from "../store/payment/types";

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch("http://localhost:3000/api/payment-methods");

    if (!response.ok) {
        throw new Error("Could not load payment methods");
    }

    return response.json();
}