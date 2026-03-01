import { products } from "@/data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { ProductCard } from "./ProductCard";

export function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const newProducts = products.filter((p) => p.isNew);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-xs font-body text-muted-foreground tracking-[0.2em] uppercase mb-2">
              Just Dropped
            </p>
            <h2 className="font-display text-3xl md:text-4xl">
              New <span className="italic text-brand">Arrivals</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-9 h-9 border border-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-9 h-9 border border-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-4"
        >
          {newProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex-none w-[200px] sm:w-[220px] md:w-[240px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
