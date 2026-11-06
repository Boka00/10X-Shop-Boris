import type { CartItem } from "../types/cart";
import { discountPrice } from "../utils/format";

export interface ICart {
  subtotal(): number;
  discount(): number;
  shipping(): number;
  total(): number;
}

export class Cart implements ICart {
  public static readonly FREE_SHIPPING_FROM = 100;
  public static readonly SHIPPING_COST = 10;
  public static readonly PROMO_CODE = "10X10";
  public static readonly PROMO_DISCOUNT_RATE = 0.1;

  private readonly items: CartItem[];
  private readonly promoCode: string | null;

  constructor(items: CartItem[], promoCode: string | null = null) {
    this.items = items;
    this.promoCode = promoCode;
  }

  public get itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public static isValidPromo(code: string): boolean {
    return code.trim().toUpperCase() === Cart.PROMO_CODE;
  }

  public subtotal(): number {
    const raw = this.items.reduce((sum, item) => {
      const unitPrice = discountPrice(item.price, item.discountPercentage);
      return sum + unitPrice * item.quantity;
    }, 0);
    return Math.round(raw * 100) / 100;
  }

  public discount(): number {
    if (!this.promoCode || !Cart.isValidPromo(this.promoCode)) {
      return 0;
    }
    return Math.round(this.subtotal() * Cart.PROMO_DISCOUNT_RATE * 100) / 100;
  }

  public shipping(): number {
    const afterDiscount = this.subtotal() - this.discount();
    if (afterDiscount <= 0) return 0;
    return afterDiscount >= Cart.FREE_SHIPPING_FROM ? 0 : Cart.SHIPPING_COST;
  }

  public total(): number {
    const rawTotal = this.subtotal() - this.discount() + this.shipping();
    return Math.max(0, Math.round(rawTotal * 100) / 100);
  }
}