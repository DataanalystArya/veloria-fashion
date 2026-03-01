// Veloria - Premium Girls Fashion E-Commerce
// Vercel settings:
// Root directory: src/frontend
// Build command: pnpm run build
// Output directory: dist

import { CartProvider } from "@/context/CartContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <OrdersProvider>
          <RouterProvider router={router} />
        </OrdersProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
