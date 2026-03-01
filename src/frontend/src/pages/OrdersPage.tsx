import { useOrders } from "@/context/OrdersContext";
import { products } from "@/data/products";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";

const statusConfig = {
  placed: {
    label: "Order Placed",
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50 border-green-200",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  delivered: {
    label: "Delivered",
    icon: MapPin,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
};

export function OrdersPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Package
            size={64}
            className="mx-auto text-border mb-6"
            strokeWidth={1}
          />
          <h1 className="font-display text-3xl mb-3">No orders yet</h1>
          <p className="text-sm font-body text-muted-foreground mb-8">
            Your placed orders will appear here
          </p>
          <Link to="/" className="btn-veloria inline-flex items-center gap-2">
            Start Shopping
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-1">My Orders</h1>
        <p className="text-sm font-body text-muted-foreground">
          {orders.length} order{orders.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-5">
        {orders.map((order, i) => {
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;
          const date = new Date(order.date);
          const orderProducts = order.items
            .map((item) => ({
              ...item,
              product: products.find((p) => p.id === item.productId),
            }))
            .filter((x) => x.product !== undefined);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white border border-border"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
                <div>
                  <p className="text-xs font-body text-muted-foreground mb-0.5">
                    Order ID
                  </p>
                  <p className="text-sm font-body font-semibold text-brand">
                    #{order.id}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-body text-muted-foreground mb-0.5">
                    Date
                  </p>
                  <p className="text-sm font-body">
                    {date.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-body text-muted-foreground mb-0.5">
                    Payment
                  </p>
                  <p className="text-sm font-body font-medium">
                    {order.paymentMethod === "upi" ? "UPI" : "Cash on Delivery"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-body text-muted-foreground mb-0.5">
                    Total
                  </p>
                  <p className="text-sm font-body font-semibold">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-medium border ${status.color}`}
                  >
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-5">
                <div className="flex flex-wrap gap-4">
                  {orderProducts.map(({ product, size, quantity }) => (
                    <div key={`${product!.id}-${size}`} className="flex gap-3">
                      <Link
                        to="/product/$id"
                        params={{ id: String(product!.id) }}
                      >
                        <img
                          src={product!.imageUrl}
                          alt={product!.name}
                          className="w-16 aspect-[3/4] object-cover hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      <div>
                        <p className="text-sm font-body font-medium">
                          {product!.name}
                        </p>
                        <p className="text-xs font-body text-muted-foreground">
                          Size: {size}
                        </p>
                        <p className="text-xs font-body text-muted-foreground">
                          Qty: {quantity}
                        </p>
                        <p className="text-xs font-body font-semibold mt-1">
                          ₹{(product!.price * quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-body text-muted-foreground">
                    Shipping to:{" "}
                    <span className="text-foreground">
                      {order.shippingInfo.name} · {order.shippingInfo.address},{" "}
                      {order.shippingInfo.city}, {order.shippingInfo.state} -{" "}
                      {order.shippingInfo.pincode}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
