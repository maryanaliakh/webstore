export interface Category {
    id: number;
    name: string;
    image: string;
}

export interface CategoryState {
    data: Category[];
}

export const LOAD_CATEGORY = 'CATEGORY/LOAD';

export interface LoadCategoryAction {
    type: typeof LOAD_CATEGORY,
    payload: {
        data: Category[];
    }
}

export type CategoryActions = LoadCategoryAction;