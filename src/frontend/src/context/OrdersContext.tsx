import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "./CartContext";

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: "upi" | "cod";
  status: "placed" | "processing" | "shipped" | "delivered";
  shippingInfo: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface OrdersContextValue {
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "date" | "status">) => string;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = useCallback(
    (orderData: Omit<Order, "id" | "date" | "status">) => {
      const id = `VEL${Date.now().toString().slice(-8)}`;
      const newOrder: Order = {
        ...orderData,
        id,
        date: new Date().toISOString(),
        status: "placed",
      };
      setOrders((prev) => [newOrder, ...prev]);
      return id;
    },
    [],
  );

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
