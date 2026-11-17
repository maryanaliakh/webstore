import * as shippingQuery from "../queries/shipping";

export async function getShippingOptions() {
    return shippingQuery.getShippingOptions();
}