import type { ProductsResponse } from "../types/product";

const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts(limit=12, skip = 0) : Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);

    if (!response.ok){
        throw new Error(`Failed to load products (status: ${response.status})`)
    }

    const data = (await response.json()) as ProductsResponse;
    return data;
}
fetchProducts()