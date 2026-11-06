import type { Product } from "./product";

export type CartItem = Pick<
  Product,
  "title" | "thumbnail" | "price" | "discountPercentage" | "stock"
> & {
  productId: number;
  quantity: number;
};

export interface CartState {
  items: CartItem[];
  promoCode: string | null;
}

export type CartAction =
  | { type: "ADD_ITEM"; product: Product; qty: number }
  | { type: "SET_QTY"; productId: number; qty: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "REMOVE_PROMO" };