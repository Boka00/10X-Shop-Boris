export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export type SortOption =
  | ""
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "title-asc";

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