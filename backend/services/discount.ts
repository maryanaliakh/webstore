import * as query from "../queries/discount";


export const getDiscounts = async (gender?: "men" | "women") => {
    return query.getDiscounts(gender)
}