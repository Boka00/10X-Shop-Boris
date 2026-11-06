import type { Category, Product, ProductsResponse } from "../types/product";
import { apiClient } from "./ApiClient";

export async function fetchProducts(
  limit = 50,
  skip = 0,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  return apiClient.get<ProductsResponse>(
    `/products?limit=${limit}&skip=${skip}`,
    signal
  );
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal
): Promise<Product> {
  return apiClient.get<Product>(`/products/${id}`, signal);
}

export async function fetchCategories(
  signal?: AbortSignal
): Promise<Category[]> {
  return apiClient.get<Category[]>("/products/categories", signal);
}

export async function fetchProductsByCategory(
  slug: string,
  limit = 12,
  skip = 0,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  return apiClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(slug)}?limit=${limit}&skip=${skip}`,
    signal
  );
}