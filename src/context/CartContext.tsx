import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import { discountPrice } from '../utils/format';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, qty?: number) => void;
  setQuantity: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shop_cart';

// საწყისი მონაცემების წაკითხვა localStorage-დან (Lazy Initialization)
function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  // ყოველ ცვლილებაზე ვინახავთ localStorage-ში ('shop_cart')
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // 1. ნივთის დამატება (მზა ნიმუში Immutable განახლებით და stock-ის შემოწმებით)
  const addItem = (product: Product, qty = 1): void => {
    if (product.stock <= 0 || qty <= 0) return;

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.productId === product.id);

      if (existing) {
        // თუ უკვე კალათაშია, ვზრდით რაოდენობას (მაქსიმუმ stock-მდე)
        const nextQty = Math.min(existing.quantity + qty, product.stock);
        return prevItems.map((item) =>
          item.productId === product.id ? { ...item, quantity: nextQty } : item
        );
      }

      // თუ ახალია, ვამატებთ მასივის ბოლოში [...prevItems, newItem]
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

  // TODO 1: დაასრულე setQuantity ფუნქცია:
  // გადაუარე prevItems-ს .map()-ით: თუ item.productId === productId,
  // დააბრუნე განახლებული ობიექტი { ...item, quantity: Math.max(1, Math.min(qty, item.stock)) }
  // წინააღმდეგ შემთხვევაში დააბრუნე იგივე item.
  const setQuantity = (productId: number, qty: number): void => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        // დაწერე ტერნარული პირობა აქ...
        item.productId === productId ? { ...item, quantity: Math.max(1, Math.min(qty, item.stock)) } : item
      )
    );
  };

  // TODO 2: დაწერე removeItem ფუნქცია:
  // setItems-ში გამოიყენე prevItems.filter(...), რომ დატოვო მხოლოდ ის ნივთები,
  // რომელთა item.productId !== productId
  const removeItem = (productId: number): void => {
    // დაწერე აქ...
    setItems((prevItems) => 
    prevItems.filter((item)=> item.productId !== productId)
    )
  };

  // TODO 3: დაწერე clearCart ფუნქცია, რომელიც items სთეითს გახდის ცარიელ მასივს: []
  const clearCart = (): void => {
    // დაწერე აქ...
    setItems([]);
  };

  // TODO 4: გამოთვალე totalItems (ყველა ნივთის quantity-ს ჯამი Header-ის ბეჯისთვის)
  // მინიშნება: items.reduce((sum, item) => sum + item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // ფასდაკლებული ჯამის (Subtotal) დათვლა
  const subtotal = Number(
    items
      .reduce(
        (sum, item) =>
          sum + discountPrice(item.price, item.discountPercentage) * item.quantity,
        0
      )
      .toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        setQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}