import { products } from "@/data/products";
import { motion } from "motion/react";
import { ProductCard } from "./ProductCard";

export function FeaturedCollection() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <p className="text-xs font-body text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Handpicked for You
          </p>
          <h2 className="font-display text-3xl md:text-4xl">
            Featured <span className="italic text-brand">Collection</span>
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {featured.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <ProductCard product={product} priority={i < 4} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
