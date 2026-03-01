import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/veloria/Footer";
import { Navbar } from "@/components/veloria/Navbar";
import { CartPage } from "@/pages/CartPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { HomePage } from "@/pages/HomePage";
import { OrdersPage } from "@/pages/OrdersPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { ThankYouPage } from "@/pages/ThankYouPage";
import { WishlistPage } from "@/pages/WishlistPage";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster position="bottom-right" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/$slug",
  component: CategoryPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: WishlistPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

const thankYouRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/thank-you",
  component: ThankYouPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  productRoute,
  cartRoute,
  wishlistRoute,
  checkoutRoute,
  ordersRoute,
  thankYouRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
