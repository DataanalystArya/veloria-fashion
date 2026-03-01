import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductCard } from "@/components/veloria/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getSlugByCategory, products } from "@/data/products";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, Ruler, Share2, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="font-display text-2xl mb-4">Product not found</p>
        <Link to="/" className="btn-veloria inline-block">
          Go Home
        </Link>
      </main>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product.id, selectedSize, quantity);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${selectedSize} · Qty: ${quantity}`,
    });
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", {
      icon: wishlisted ? "💔" : "❤️",
    });
  };

  // Similar products
  const similar = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-6 flex-wrap">
        <button
          type="button"
          onClick={() =>
            void navigate({
              to: "/category/$slug",
              params: { slug: getSlugByCategory(product.category) },
            })
          }
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <span>/</span>
        <Link
          to="/category/$slug"
          params={{ slug: getSlugByCategory(product.category) }}
          className="hover:text-foreground transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-[3/4] overflow-hidden bg-secondary"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="eager"
            className="w-full h-full object-cover"
          />
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && <span className="badge-new">NEW</span>}
            <span className="badge-discount">-{product.discount}%</span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
            className="absolute top-4 right-4 w-9 h-9 bg-white flex items-center justify-center text-foreground hover:text-brand transition-colors shadow-xs"
          >
            <Share2 size={16} />
          </button>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <Link
            to="/category/$slug"
            params={{ slug: getSlugByCategory(product.category) }}
            className="text-[10px] font-body font-semibold tracking-widest uppercase text-brand mb-3 hover:underline"
          >
            {product.category}
          </Link>
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-display text-2xl text-foreground">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-base font-body text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-body text-brand font-semibold">
              {product.discount}% OFF
            </span>
          </div>

          {/* Description */}
          <p className="text-sm font-body text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-body font-semibold tracking-widest uppercase">
                Select Size
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs font-body text-muted-foreground underline hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Ruler size={12} />
                Size Guide
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {["XS", "S", "M", "L"].map((size) => {
                const available = product.sizes.includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    disabled={!available}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 text-sm font-body font-medium border transition-all duration-150 ${
                      selectedSize === size
                        ? "bg-foreground text-white border-foreground"
                        : available
                          ? "border-border hover:border-foreground text-foreground"
                          : "border-border text-muted-foreground/40 cursor-not-allowed line-through"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {!selectedSize && (
              <p className="text-xs text-muted-foreground mt-2 font-body">
                Please select a size
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-xs font-body font-semibold tracking-widest uppercase mb-3">
              Quantity
            </h3>
            <div className="flex items-center border border-border w-fit">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary transition-colors text-lg"
              >
                −
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-sm font-body font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary transition-colors text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 btn-veloria flex items-center justify-center gap-2 py-3.5"
            >
              <ShoppingBag size={16} />
              Add to Bag
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              className={`flex-1 sm:flex-none sm:w-14 h-[50px] border flex items-center justify-center transition-all duration-200 ${
                wishlisted
                  ? "bg-brand border-brand text-white"
                  : "border-border text-foreground hover:border-brand hover:text-brand"
              }`}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart size={18} className={wishlisted ? "fill-current" : ""} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="border-t border-border pt-6 space-y-2">
            {[
              "🚚 Free delivery on orders above ₹999",
              "↩️ Easy 7-day returns",
              "✅ 100% authentic products",
            ].map((info) => (
              <p key={info} className="text-xs font-body text-muted-foreground">
                {info}
              </p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl mb-6">
            You Might Also <span className="italic text-brand">Love</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Ruler size={18} className="text-brand" />
              Size Guide
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs font-body text-muted-foreground mb-4">
            All measurements are in centimeters (cm). Choose the size that best
            matches your measurements.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body border-collapse">
              <thead>
                <tr
                  style={{
                    backgroundColor: "oklch(var(--brand))",
                    color: "white",
                  }}
                >
                  <th className="text-left px-4 py-3 text-xs font-semibold tracking-wider uppercase">
                    Measurement
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider uppercase text-center">
                    XS
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider uppercase text-center">
                    S
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider uppercase text-center">
                    M
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider uppercase text-center">
                    L
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Bust (cm)", xs: 78, s: 82, m: 86, l: 90 },
                  { label: "Waist (cm)", xs: 60, s: 64, m: 68, l: 72 },
                  { label: "Length (cm)", xs: 90, s: 92, m: 94, l: 96 },
                ].map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-secondary/30" : "bg-white"}
                  >
                    <td className="px-4 py-3 text-xs font-medium text-foreground border border-border">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground border border-border">
                      {row.xs}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground border border-border">
                      {row.s}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground border border-border">
                      {row.m}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground border border-border">
                      {row.l}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-brand/5 border border-brand/20 rounded-sm p-3">
            <p className="text-xs font-body text-muted-foreground">
              <strong className="text-foreground">Tip:</strong> If you're
              between sizes, we recommend sizing up for a comfortable fit.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
