import {ProductFilters, ProductSort} from "../store/product/types.ts";
import * as _ from "lodash";

export async function getProduct (param: string) {
    try {
        const response = await fetch(`http://localhost:3000/product/${param}`);

        console.log(response)

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error(error);
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

        filters.material.forEach((material) => {
            params.append("material", material);
        });

        filters.origin.forEach((origin) => {
            params.append("origin", origin);
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

