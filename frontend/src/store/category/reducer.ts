import {CategoryActions, CategoryState, LOAD_CATEGORY} from "./types.ts";

const initialCategoryState: CategoryState = {
   data: []
}

export const categoryReducer = (state = initialCategoryState, action: CategoryActions) => {
    switch (action.type) {
        case LOAD_CATEGORY: {
            return {
                ...state,
                data: action.payload.data
            }
        }
        default: {
            return state
        }
    }
}