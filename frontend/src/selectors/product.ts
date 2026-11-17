import type {RootState} from "../store";
import {createSelector} from "reselect";
import {getSearchParam, getSearchParams} from "../common/helpers.ts";
import type {ProductFilters} from "../store/product/types.ts";
import * as _ from "lodash";

export const searchSelector = (state: RootState) => state.router.location.search

export const idSelector = (state: RootState) => state.router.location.pathname.split("/").pop();

export const qParamSelector = createSelector(
    searchSelector,
    (search) => {
        return getSearchParam(search, 'q')
    }
)

export const colorParamSelector = createSelector(
    searchSelector,
    (search) => {
        return getSearchParams(search, 'color')
    }
)

export const sizeParamSelector = createSelector(
    searchSelector,
    (search) => {
        return getSearchParams(search, 'size')
    }
)

export const categoryParamSelector = createSelector(
    searchSelector,
    (search) => {
        return getSearchParams(search, 'category')
    }
)

export const subcategoryParamSelector = createSelector(
    searchSelector,
    (search) => {
        return getSearchParams(search, 'subcategory')
    }
)

export const collectionParamSelector = createSelector(
    searchSelector,
    (search) => {
        return getSearchParams(search, 'collection')
    }
)

export const materialParamSelector = createSelector(
    searchSelector,
    (search) => {
        return getSearchParams(search, 'material')
    }
)

export const originParamSelector = createSelector(
    searchSelector,
    (search) => {
        return getSearchParams(search, 'origin')
    }
)

export const minPriceParamSelector = createSelector(
    searchSelector,
    (search) => {
        const result = getSearchParam(search, 'minPrice')
        return result ? _.toInteger(result) : 0
    }
)

export const maxPriceParamSelector = createSelector(
    searchSelector,
    (search) => {
        const result = getSearchParam(search, 'maxPrice')
        return result ? _.toInteger(result) : 500 //from db
    }
)

export const genderParamSelector = createSelector(
    searchSelector,
    (search) => {
        const result = getSearchParam(search, 'gender')
        if (result === 'men' || result === 'women') {
            return result;
        }
        return undefined
    }
)

export const sortParamSelector  = createSelector(
    searchSelector,
    (search) => {
        const result = getSearchParam(search, 'sort')
        if (result === 'asc' || result === 'desc') {
            return result;
        }
        return undefined
    }
)

export const discountParamSelector = createSelector(
    searchSelector,
    (search) => getSearchParams(search, "discount")
);

export const productFilterSelector = createSelector([
        qParamSelector,
        colorParamSelector,
        sizeParamSelector,
        categoryParamSelector,
        subcategoryParamSelector,
        collectionParamSelector,
        materialParamSelector,
        originParamSelector,
        minPriceParamSelector,
        maxPriceParamSelector,
        genderParamSelector,
        discountParamSelector,
        sortParamSelector],
    (q, color, size, category, subcategory, collection, material, origin, minPrice, maxPrice, gender, discount): ProductFilters => ({
        q, color, size, category, subcategory, collection, material, origin, minPrice, maxPrice, gender, discount
    })
)

