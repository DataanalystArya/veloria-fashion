import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/data/products";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0];
    addToCart(product.id, defaultSize, 1);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${defaultSize}`,
      duration: 2000,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", {
      icon: wishlisted ? "💔" : "❤️",
      duration: 1500,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div
        className="h-full flex flex-col"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Link
          to="/product/$id"
          params={{ id: String(product.id) }}
          className="group block bg-white h-full flex flex-col overflow-hidden border border-transparent hover:border-border hover:shadow-lg transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative overflow-hidden aspect-[3/4] bg-muted flex-none">
            <img
              src={product.imageUrl}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && <span className="badge-new">NEW</span>}
              <span className="badge-discount">-{product.discount}%</span>
            </div>

            {/* Wishlist button */}
            <button
              type="button"
              onClick={handleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white shadow-xs transition-all duration-200 ${
                wishlisted
                  ? "text-brand"
                  : "text-foreground/60 hover:text-brand"
              }`}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart size={16} className={wishlisted ? "fill-current" : ""} />
            </button>

            {/* Add to cart overlay */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-foreground/95 py-3 flex items-center justify-center gap-2 cursor-pointer"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={14} className="text-white" />
              <span className="text-white text-xs font-body font-medium tracking-widest uppercase">
                Add to Bag
              </span>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="pt-3 pb-3 px-2 flex flex-col flex-1">
            <p className="text-[10px] font-body text-muted-foreground tracking-widest uppercase mb-1">
              {product.category}
            </p>
            <h3 className="text-sm font-body font-medium text-foreground line-clamp-2 min-h-[2.5rem] mb-1.5 leading-snug">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-sm font-semibold font-body text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-body text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
