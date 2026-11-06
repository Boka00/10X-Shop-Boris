import type { Order, OrderStatus, ShippingInfo } from "../types/order";
import type { CartItem } from "../types/cart";
import { Cart, isCartItem } from "./Cart";
import { STORAGE_KEYS, StorageService } from "./StorageService";

function isShippingInfo(val: unknown): val is ShippingInfo {
  if (typeof val !== "object" || val === null) return false;
  const s = val as Record<string, unknown>;
  return (
    typeof s.fullName === "string" &&
    typeof s.email === "string" &&
    typeof s.address === "string" &&
    typeof s.city === "string"
  );
}

function isOrder(val: unknown): val is Order {
  if (typeof val !== "object" || val === null) return false;
  const o = val as Record<string, unknown>;
  return (
    typeof o.id === "number" &&
    typeof o.number === "string" &&
    Array.isArray(o.items) &&
    o.items.every(isCartItem) &&
    isShippingInfo(o.shipping) &&
    typeof o.subtotal === "number" &&
    typeof o.discount === "number" &&
    typeof o.shippingCost === "number" &&
    typeof o.total === "number" &&
    typeof o.placedAt === "string"
  );
}

function isOrderArray(val: unknown): val is Order[] {
  return Array.isArray(val) && val.every(isOrder);
}

const ordersStorage = new StorageService<Order[]>(
  STORAGE_KEYS.orders,
  isOrderArray
);

export function getOrderStatus(order: Order, now: Date = new Date()): OrderStatus {
  const placedTime = new Date(order.placedAt).getTime();
  const elapsedMs = Math.max(0, now.getTime() - placedTime);
  const elapsedMinutes = elapsedMs / 60_000;

  if (elapsedMinutes < 1) return "Processing";
  if (elapsedMinutes <= 3) return "Shipped";
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
    promoCode: string | null = null,
    ownerUsername?: string
  ): Order {
    const cart = new Cart(items, promoCode);
    const allOrders = ordersStorage.get() ?? [];
    const maxSeq = allOrders.reduce((max, ord) => {
      const match = /^10X-(\d+)$/.exec(ord.number);
      const num = match ? Number(match[1]) : 0;
      return Math.max(max, num);
    }, 0);

    const nextSeq = maxSeq + 1;
    const formattedNumber = `10X-${String(nextSeq).padStart(5, "0")}`;

    return {
      id: Date.now(),
      number: formattedNumber,
      ownerUsername: ownerUsername ? ownerUsername.trim().toLowerCase() : undefined,
      items: items.map((item) => ({ ...item })),
      shipping: { ...shipping },
      subtotal: cart.subtotal(),
      discount: cart.discount(),
      shippingCost: cart.shipping(),
      total: cart.total(),
      placedAt: new Date().toISOString(),
    };
  }

  public getStatus(now: Date = new Date()): OrderStatus {
    return getOrderStatus(this.data, now);
  }

  public toJSON(): Order {
    return { ...this.data };
  }
}

export function getSavedOrders(username?: string): Order[] {
  const all = ordersStorage.get() ?? [];
  if (!username) return all;
  const normalized = username.trim().toLowerCase();
  return all.filter(
    (order) =>
      !order.ownerUsername || order.ownerUsername.toLowerCase() === normalized
  );
}

export function saveOrder(order: Order): void {
  const existing = ordersStorage.get() ?? [];
  ordersStorage.set([order, ...existing]);
}