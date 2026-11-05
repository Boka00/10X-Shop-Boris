import type { Product, ProductsResponse } from "../types/product";

const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts(limit=100, skip = 0) : Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);

    if (!response.ok){
        throw new Error(`Failed to load products (status: ${response.status})`)
    }

    const data = (await response.json()) as ProductsResponse;

    return data;
}

export async function fetchProductById(id: number) : Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok){
        throw new Error(`Product not found (status: ${response.status})`)
    }

    const data = (await response.json()) as Product;
  
    return data;
}