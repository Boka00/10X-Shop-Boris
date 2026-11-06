import type { Product, ProductsResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(
  limit = 12,
  skip = 0,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const response = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}`,
    { signal }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch products (status: ${response.status})`);
  }
  const data: ProductsResponse = await response.json();
  return data;
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal
): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`, { signal });
  if (!response.ok) {
    throw new Error(`Product not found (status: ${response.status})`);
  }
  const data: Product = await response.json();
  return data;
}