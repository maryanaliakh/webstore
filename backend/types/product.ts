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
    minPrice?: number;
    maxPrice?: number;
    gender?: 'men' | 'women';
    sort?: "asc" | "desc";
}

export interface Product {
    id: number;
    name: string;
    price: number;
    discount_id: number | null;
    colors: string[];
    images: string[];
    category: string[];
    subcategory: string[];
    gender?: string;
    collection: string | null;
}