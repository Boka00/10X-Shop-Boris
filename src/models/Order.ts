import type { CartItem } from "../types/cart";
import type { Order, OrderStatus, ShippingInfo } from "../types/order";
import { Cart } from "./Cart";
import { STORAGE_KEYS, StorageService } from "./StorageService";

export function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.number === "string" &&
    Array.isArray(candidate.items) &&
    typeof candidate.shipping === "object" &&
    candidate.shipping !== null &&
    typeof candidate.total === "number" &&
    typeof candidate.placedAt === "string"
  );
}

export function isOrderArray(value: unknown): value is Order[] {
  return Array.isArray(value) && value.every(isOrder);
}

export function getOrderStatus(
  order: Pick<Order, "placedAt">,
  now: Date = new Date()
): OrderStatus {
  const placedTime = new Date(order.placedAt).getTime();
  const elapsedMs = Math.max(0, now.getTime() - placedTime);
  const elapsedMinutes = elapsedMs / (1000 * 60);

  if (elapsedMinutes < 1) {
    return "Processing";
  }
  if (elapsedMinutes <= 3) {
    return "Shipped";
  }
  return "Delivered";
}

export class OrderModel {
  private readonly data: Order;

  constructor(data: Order) {
    this.data = data;
  }

  public static create(
    items: CartItem[],
    shipping: ShippingInfo,
    existingCount: number,
    promoCode: string | null = null
  ): OrderModel {
    const cart = new Cart(items, promoCode);
    const id = Date.now();
    const number = `10X-${String(existingCount + 1).padStart(5, "0")}`;

    return new OrderModel({
      id,
      number,
      items,
      shipping,
      subtotal: cart.subtotal(),
      discount: cart.discount(),
      shippingCost: cart.shipping(),
      total: cart.total(),
      placedAt: new Date().toISOString(),
    });
  }

  public getStatus(now: Date = new Date()): OrderStatus {
    return getOrderStatus(this.data, now);
  }

  public toJSON(): Order {
    return { ...this.data };
  }
}

export const ordersStorage = new StorageService<Order[]>(
  STORAGE_KEYS.orders,
  isOrderArray
);

export function getSavedOrders(): Order[] {
  return ordersStorage.get() ?? [];
}

export function saveNewOrder(order: Order): void {
  const current = getSavedOrders();
  ordersStorage.set([order, ...current]);
}