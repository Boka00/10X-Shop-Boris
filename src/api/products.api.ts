import { apiClient } from "./ApiClient";
import type { Category, Product, ProductsResponse } from "../types/product";

export function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.title === "string" &&
    typeof candidate.price === "number" &&
    typeof candidate.discountPercentage === "number" &&
    typeof candidate.stock === "number" &&
    typeof candidate.thumbnail === "string"
  );
}

export async function fetchProducts(
  limit = 0,
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
  limit = 0,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  return apiClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(slug)}?limit=${limit}`,
    signal
  );
}