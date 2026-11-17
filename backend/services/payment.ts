import * as paymentQuery from "../queries/payment";

export async function getPaymentMethods() {
    return paymentQuery.getPaymentMethods();
}