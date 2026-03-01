import { ProductCard } from "@/components/veloria/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/data/products";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import { motion } from "motion/react";

export function WishlistPage() {
  const { wishlist } = useWishlist();
  const wishlisted = products.filter((p) => wishlist.includes(p.id));

  if (wishlisted.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heart
            size={64}
            className="mx-auto text-border mb-6"
            strokeWidth={1}
          />
          <h1 className="font-display text-3xl mb-3">Your wishlist is empty</h1>
          <p className="text-sm font-body text-muted-foreground mb-8">
            Save your favourite styles here
          </p>
          <Link to="/" className="btn-veloria inline-flex items-center gap-2">
            Explore Collections
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-xs font-body text-muted-foreground tracking-[0.2em] uppercase mb-1">
          Saved for Later
        </p>
        <h1 className="font-display text-3xl md:text-4xl mb-1">My Wishlist</h1>
        <p className="text-sm font-body text-muted-foreground">
          {wishlisted.length} item{wishlisted.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlisted.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </main>
  );
}
