import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  productId: number;
  size: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (productId: number, size: string, quantity?: number) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  getItemQuantity: (productId: number, size: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (productId: number, size: string, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === productId && i.size === size,
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...prev, { productId, size, quantity }];
      });
    },
    [],
  );

  const removeFromCart = useCallback((productId: number, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size)),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: number, size: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => !(i.productId === productId && i.size === size)),
        );
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity }
              : i,
          ),
        );
      }
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const getItemQuantity = useCallback(
    (productId: number, size: string) =>
      items.find((i) => i.productId === productId && i.size === size)
        ?.quantity ?? 0,
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
