export interface Product {
    id: number;
    name: string;
    price: number;
    discount_id: number | null;
    colors: string[];
    images: string[];
    category: string[];
    subcategory: string[];
    gender: string;
    collection: string | null;
}

export interface ProductState {
    data: Product[];
}

export interface ProductFavorites {
    ids: number[];
}

export interface ProductFilterOptionsState {
    all: ProductFilterOptions;
    filtered: ProductFilterOptions;
}

export interface ProductFilters {
    q?: string;
    color?: string[];
    size?: string[];
    category?: string[];
    subcategory?: string[];
    material?: string[];
    origin?: string[];
    discount?: string[];
    collection?: string[];
    minPrice?: number; //return type
    maxPrice?: number;
    gender?: 'men' | 'women';
}

export interface ProductFilterOptions {
    minPrice: number;
    maxPrice: number;
    colors: string[];
    sizes: string[];
    categories: string[];
    subcategories: string[];
    materials: string[];
    origins: string[];
    discounts: string[];
    collections: string[];
}

export interface ProductDetails {
    id: number;
    name: string;
    subtitle: string;
    price: string;
    description: string;
    material: string;
    care: string;
    origin: string;
    category: string;
    subcategory: string;
    colors: string[];
    selectedColor: string;

    variants: {
        id: number;
        size: string;
        stock: number;
    }[];

    images: {
        id: number;
        color: string;
        url: string;
    }[];

    gender: 'men' | 'women';

    shipOptions: {
        id: number;
        name: string;
        price: number;
        description: string;
        deliveryTime: string;
    }[];

    returnOptions: {
        id: number;
        name: string;
        price: number;
        description: string;
    }[];

    returnPolicy: {
        id: number;
        description: string;
        title: string;
    }[];
}

export type ProductSort = 'asc' | 'desc';

export const LOAD_PRODUCT = 'PRODUCT/LOAD'
export const LOAD_PRODUCT_FILTER_OPTIONS = 'PRODUCT/LOAD_PRODUCT_FILTER_OPTIONS'

export const LOAD_PRODUCT_DETAILS = 'PRODUCT/LOAD_PRODUCT_DETAILS'
export const TOGGLE_PRODUCTS_FAVORITE = 'PRODUCT/TOGGLE_FAVORITE'
export const LOAD_MODAL_PRODUCT_DETAILS = 'PRODUCT/LOAD_MODAL_DETAILS';


export interface LoadProductAction {
    type: typeof LOAD_PRODUCT,
    payload: {
        data: Product[]
    }
}

export interface LoadProductFilterOptionsAction {
    type: typeof LOAD_PRODUCT_FILTER_OPTIONS;
    payload: {
        data: ProductFilterOptions;
        target: "all" | "filtered";
    };
}

export interface LoadProductDetailsAction {
    type: typeof LOAD_PRODUCT_DETAILS,
    payload: {
        data: ProductDetails
    }
}

export interface ToggleProductFavoritesAction {
    type: typeof TOGGLE_PRODUCTS_FAVORITE,
    payload: {
        data: number
    }
}

export interface LoadModalProductDetailsAction {
    type: typeof LOAD_MODAL_PRODUCT_DETAILS;
    payload: {
        data: ProductDetails;
    };
}

export type ProductActions =
    | LoadProductAction
    | LoadProductFilterOptionsAction
    | LoadProductDetailsAction
    | ToggleProductFavoritesAction
    | LoadModalProductDetailsAction
