import * as query from "../queries/category";

export const getCategories = async (gender?: "men" | "women") => {
    return query.getCategories(gender)
}
