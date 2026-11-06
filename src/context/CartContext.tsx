import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
import { discountPrice } from "../utils/format";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "shop_cart";

function isCartItem(item: unknown): item is CartItem {
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

const getInitialCart = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return [];
    const parsed: unknown = JSON.parse(savedCart);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem);
  } catch (error) {
    console.error("Failed to parse cart items from localStorage:", error);
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart items to localStorage (quota exceeded or access denied):", error);
    }
  }, [items]);

  const addItem = (product: Product, qty = 1): void => {
    if (product.stock <= 0 || qty <= 0) return;

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        const nextQty = Math.min(existingItem.quantity + qty, product.stock);
        return prevItems.map((item) =>
          item.productId === product.id ? { ...item, quantity: nextQty } : item
        );
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

      return [...prevItems, newItem];
    });
  };

  const removeItem = (productId: number): void => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const setQuantity = (productId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
          : item
      )
    );
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    const rawTotal = items.reduce((sum, item) => {
      const unitPrice = discountPrice(item.price, item.discountPercentage);
      return sum + unitPrice * item.quantity;
    }, 0);
    return Math.round(rawTotal * 100) / 100;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQuantity,
        updateQuantity: setQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};