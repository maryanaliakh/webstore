export interface Product {
    id: number;
    name: string;
    price: string;
    colors: string[];
    images: string[];
    gender: string;
}

export interface ProductState {
    data: Product[];
}

export interface ProductFilters {
    q?: string;
    color?: string[];
    size?: string[];
    category?: string[];
    material?: string[];
    origin?: string[];
    minPrice?: number; //return type
    maxPrice?: number;
    gender?: 'men' | 'women';
}


export type ProductSort = 'high' | 'low';

export const LOAD_PRODUCTS = 'PRODUCTS/LOAD'
export const DELETE_PRODUCTS = 'PRODUCTS/DELETE'

export interface LoadProductAction {
    type: typeof LOAD_PRODUCTS,
    payload: {
        data: Product[]
    }
}

export interface DeleteProductAction {
    type: typeof DELETE_PRODUCTS,
    payload: {
        id: number
    }
}



export type ProductsActions = LoadProductAction | DeleteProductAction
