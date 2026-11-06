import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem, CartState } from "../types/cart";
import type { Product } from "../types/product";
import { Cart, cartReducer, isCartItem, isCartState } from "../models/Cart";
import { STORAGE_KEYS, StorageService } from "../models/StorageService";

interface CartContextType {
  items: CartItem[];
  promoCode: string | null;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartStateStorage = new StorageService<CartState>(
  STORAGE_KEYS.cart,
  isCartState
);

const getInitialCartState = (): CartState => {
  const savedState = cartStateStorage.get();
  if (savedState) return savedState;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart);
    if (!raw) return { items: [], promoCode: null };
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { items: parsed.filter(isCartItem), promoCode: null };
    }
  } catch (error) {
    console.error("Failed to read legacy cart from localStorage:", error);
  }
  return { items: [], promoCode: null };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    getInitialCartState
  );

  useEffect(() => {
    cartStateStorage.set(state);
  }, [state]);

  const cartModel = useMemo(
    () => new Cart(state.items, state.promoCode),
    [state.items, state.promoCode]
  );

  const addItem = (product: Product, qty = 1): void => {
    dispatch({ type: "ADD_ITEM", product, qty });
  };

  const removeItem = (productId: number): void => {
    dispatch({ type: "REMOVE_ITEM", productId });
  };

  const setQuantity = (productId: number, quantity: number): void => {
    dispatch({ type: "SET_QTY", productId, qty: quantity });
  };

  const clearCart = (): void => {
    dispatch({ type: "CLEAR" });
  };

  const applyPromo = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === Cart.PROMO_CODE) {
      dispatch({ type: "APPLY_PROMO", code: normalized });
      return true;
    }
    return false;
  };

  const removePromo = (): void => {
    dispatch({ type: "REMOVE_PROMO" });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        promoCode: state.promoCode,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
        applyPromo,
        removePromo,
        totalItems: cartModel.itemCount,
        subtotal: cartModel.subtotal(),
        discount: cartModel.discount(),
        shippingCost: cartModel.shipping(),
        total: cartModel.total(),
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