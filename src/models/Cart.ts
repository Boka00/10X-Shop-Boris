import type { CartAction, CartItem, CartState } from "../types/cart";
import { discountPrice } from "../utils/format";

export interface ICart {
  subtotal(): number;
  discount(): number;
  shipping(): number;
  total(): number;
}

export function isCartItem(item: unknown): item is CartItem {
  if (typeof item !== "object" || item === null) return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.productId === "number" &&
    typeof candidate.title === "string" &&
    typeof candidate.thumbnail === "string" &&
    typeof candidate.price === "number" &&
    typeof candidate.discountPercentage === "number" &&
    typeof candidate.stock === "number" &&
    typeof candidate.quantity === "number"
  );
}

export function isCartState(value: unknown): value is CartState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.items)) return false;
  const validItems = candidate.items.every(isCartItem);
  const validPromo =
    candidate.promoCode === null ||
    candidate.promoCode === undefined ||
    typeof candidate.promoCode === "string";
  return validItems && validPromo;
}

export class Cart implements ICart {
  public static readonly FREE_SHIPPING_FROM = 100;
  public static readonly SHIPPING_COST = 10;
  public static readonly PROMO_CODE = "10X10";
  public static readonly PROMO_RATE = 0.1;

  private readonly items: CartItem[];
  private readonly promoCode: string | null;

  constructor(items: CartItem[], promoCode: string | null = null) {
    this.items = items;
    this.promoCode = promoCode;
  }

  public get itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public subtotal(): number {
    const raw = this.items.reduce((sum, item) => {
      const unit = discountPrice(item.price, item.discountPercentage);
      return sum + unit * item.quantity;
    }, 0);
    return Math.round(raw * 100) / 100;
  }

  public discount(): number {
    if (
      this.promoCode &&
      this.promoCode.trim().toUpperCase() === Cart.PROMO_CODE
    ) {
      return Math.round(this.subtotal() * Cart.PROMO_RATE * 100) / 100;
    }
    return 0;
  }

  public shipping(): number {
    const afterDiscount = this.subtotal() - this.discount();
    if (afterDiscount <= 0) return 0;
    return afterDiscount >= Cart.FREE_SHIPPING_FROM ? 0 : Cart.SHIPPING_COST;
  }

  public total(): number {
    const afterDiscount = Math.max(0, this.subtotal() - this.discount());
    if (afterDiscount === 0) return 0;
    return Math.round((afterDiscount + this.shipping()) * 100) / 100;
  }
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, qty } = action;
      if (product.stock <= 0 || qty <= 0) return state;

      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + qty, product.stock);
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: nextQty, stock: product.stock }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        quantity: Math.min(qty, product.stock),
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case "SET_QTY": {
      const { productId, qty } = action;
      if (qty <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, Math.min(qty, item.stock)) }
            : item
        ),
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    }

    case "CLEAR": {
      return {
        items: [],
        promoCode: null,
      };
    }

    case "APPLY_PROMO": {
      return {
        ...state,
        promoCode: action.code.trim().toUpperCase(),
      };
    }

    case "REMOVE_PROMO": {
      return {
        ...state,
        promoCode: null,
      };
    }

    default: {
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
    }
  }
}