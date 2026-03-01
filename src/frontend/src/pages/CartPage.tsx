import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

export function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems } = useCart();
  const navigate = useNavigate();

  const cartProducts = items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((i) => i.product !== undefined);

  const subtotal = cartProducts.reduce(
    (sum, { product, quantity }) => sum + product!.price * quantity,
    0,
  );
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (totalItems === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag
            size={64}
            className="mx-auto text-border mb-6"
            strokeWidth={1}
          />
          <h1 className="font-display text-3xl mb-3">Your bag is empty</h1>
          <p className="text-sm font-body text-muted-foreground mb-8">
            Add some fabulous styles to your bag
          </p>
          <Link to="/" className="btn-veloria inline-flex items-center gap-2">
            Continue Shopping
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-1">Shopping Bag</h1>
        <p className="text-sm font-body text-muted-foreground">
          {totalItems} item{totalItems > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartProducts.map(({ product, size, quantity }) => (
              <motion.div
                key={`${product!.id}-${size}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 p-4 bg-white border border-border"
              >
                <Link
                  to="/product/$id"
                  params={{ id: String(product!.id) }}
                  className="flex-none w-20 sm:w-24"
                >
                  <img
                    src={product!.imageUrl}
                    alt={product!.name}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-body text-muted-foreground tracking-widest uppercase mb-0.5">
                        {product!.category}
                      </p>
                      <Link
                        to="/product/$id"
                        params={{ id: String(product!.id) }}
                        className="text-sm font-body font-medium text-foreground hover:text-brand transition-colors"
                      >
                        {product!.name}
                      </Link>
                      <p className="text-xs font-body text-muted-foreground mt-1">
                        Size: {size}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product!.id, size)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-none"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(product!.id, size, quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-body font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(product!.id, size, quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-body font-semibold">
                        ₹{(product!.price * quantity).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs font-body text-muted-foreground">
                        ₹{product!.price.toLocaleString("en-IN")} each
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border p-6 sticky top-24">
            <h2 className="font-display text-xl mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">
                  Subtotal ({totalItems} items)
                </span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Shipping</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>₹{shipping}</span>
                )}
              </div>
              {shipping > 0 && (
                <p className="text-xs font-body text-muted-foreground">
                  Add ₹{(SHIPPING_THRESHOLD - subtotal).toLocaleString("en-IN")}{" "}
                  more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between font-body font-semibold">
                <span>Total</span>
                <span className="text-lg">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void navigate({ to: "/checkout" })}
              className="w-full btn-veloria flex items-center justify-center gap-2 py-3.5"
            >
              Proceed to Checkout
              <ArrowRight size={14} />
            </button>

            <Link
              to="/"
              className="mt-3 block text-center text-xs font-body text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
