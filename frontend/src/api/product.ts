import {ProductFilters, ProductSort} from "../store/product/types.ts";
import * as _ from "lodash";
import type {ProductDetails} from "../store/product/types.ts";


export async function getProductDetails(param: string | number, color?: string): Promise<ProductDetails> {
    try {
        const url = color
            ? `http://localhost:3000/product/${param}?color=${encodeURIComponent(color)}`
            : `http://localhost:3000/product/${param}`;

        console.log("Product param:", param);
        console.log("Product URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Product details error:", response.status, errorText);
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("getProductDetails error:", error);
        throw error;
    }
}


export async function getProductFilterOptions(params?: ProductFilters) {
    try {
        const searchParams = new URLSearchParams();

        params?.category?.forEach(value => searchParams.append("category", value));
        params?.collection?.forEach(value => searchParams.append("collection", value));

        if (params?.gender) {
            searchParams.set("gender", params.gender);
        }

        const response = await fetch(
            `http://localhost:3000/product-filter-options?${searchParams.toString()}`
        );

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getProducts(filters: ProductFilters, sort: ProductSort) {
    try {
        const params = new URLSearchParams();

        if (filters.q !== undefined) {
            params.set("q", filters.q);
        }

        filters.color.forEach((color) => {
            params.append("color", color);
        });

        filters.size.forEach((size) => {
            params.append("size", size);
        });

        filters.category.forEach((category) => {
            params.append("category", category);
        });

        filters.subcategory.forEach((subcategory) => {
            params.append("subcategory", subcategory);
        });

        filters.material.forEach((material) => {
            params.append("material", material);
        });

        filters.origin.forEach((origin) => {
            params.append("origin", origin);
        });

        filters.collection?.forEach(collection => {
            params.append("collection", collection);
        });

        filters.discount?.forEach(discount => {
            params.append("discount", discount);
        });

        params.set("minPrice", _.toString(filters.minPrice));
        params.set("maxPrice", _.toString(filters.maxPrice));

        if (filters.gender !== undefined) {
            params.set("gender", filters.gender);
        }

        if (sort !== undefined) {
            params.set("sort", sort);
        }

        console.log(params.toString());

        const response = await fetch(
            `http://localhost:3000/products?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}
