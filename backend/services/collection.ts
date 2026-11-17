import * as query from "../queries/collection";


export const getCollections = async (gender?: "men" | "women") => {
    return query.getCollections(gender)
}

export const getLatestCollection = async () => {
    return query.getLatestCollection()
}
