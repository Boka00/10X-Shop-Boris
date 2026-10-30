import type { Key, ReactNode } from "react";

export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
}

export interface Product {
    key: Key | null | undefined;
    name: ReactNode;
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
    reviews? : Review[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}