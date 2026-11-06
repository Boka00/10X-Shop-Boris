export const STORAGE_KEYS = {
  user: "shop_user",
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export class StorageService<T> {
  private readonly key: string;
  private readonly validator?: (val: unknown) => val is T;

  constructor(key: string, validator?: (val: unknown) => val is T) {
    this.key = key;
    this.validator = validator;
  }

  public get(): T | null {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      if (this.validator) {
        return this.validator(parsed) ? parsed : null;
      }
      return parsed as T;
    } catch (error) {
      console.error(`StorageService: Failed to read key "${this.key}":`, error);
      return null;
    }
  }

  public set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      console.error(`StorageService: Failed to write key "${this.key}":`, error);
    }
  }

  public remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`StorageService: Failed to remove key "${this.key}":`, error);
    }
  }
}