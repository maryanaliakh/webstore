import type {RootState} from "../../store";
import {createSelector} from "reselect";
import {getSearchParam, getSearchParams} from "../common/helpers.ts";
import type {ProductFilters} from "../../store/product/types.ts";
import {toInteger} from "lodash";

export const searchSelector = (state: RootState) => state.router.location.search

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
        return result ? toInteger(result) : undefined
    }
)

export const maxPriceParamSelector = createSelector(
    searchSelector,
    (search) => {
        const result = getSearchParam(search, 'maxPrice')
        return result ? toInteger(result) : undefined
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

export const productFilterSelector = createSelector([
        qParamSelector,
        colorParamSelector,
        sizeParamSelector,
        categoryParamSelector,
        materialParamSelector,
        originParamSelector,
        minPriceParamSelector,
        maxPriceParamSelector,
        genderParamSelector],
    (q, color, size, category, material, origin, minPrice, maxPrice, gender): ProductFilters => ({
        q, color, size, category, material, origin, minPrice, maxPrice, gender
    })
)

