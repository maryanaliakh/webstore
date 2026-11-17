import {Category, LOAD_CATEGORY, LoadCategoryAction} from "./types.ts";
export const loadCategoriesAction = (data: Category[]): LoadCategoryAction => {
    return {
        type: LOAD_CATEGORY,
        payload: {
            data
        }
    }
}