export const STORAGE_KEYS = {
  user: "shop_user",
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export class StorageService<T> {
  private readonly key: StorageKey;
  private readonly validator?: (val: unknown) => val is T;

  constructor(key: StorageKey, validator?: (val: unknown) => val is T) {
    this.key = key;
    this.validator = validator;
  }

  public get(): T | null {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      if (this.validator && !this.validator(parsed)) {
        return null;
      }
      return parsed as T;
    } catch (error) {
      console.error(`Failed to read "${this.key}" from localStorage:`, error);
      return null;
    }
  }

  public set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to write "${this.key}" to localStorage:`, error);
    }
  }

  public remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`Failed to remove "${this.key}" from localStorage:`, error);
    }
  }
}