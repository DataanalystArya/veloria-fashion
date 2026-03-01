import { ProductCard } from "@/components/veloria/ProductCard";
import { getCategoryBySlug, products } from "@/data/products";
import { useParams } from "@tanstack/react-router";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "discount";

export function CategoryPage() {
  const { slug } = useParams({ from: "/category/$slug" });
  const categoryName = slug ? getCategoryBySlug(slug) : "All";

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const categoryProducts = useMemo(() => {
    if (!slug || slug === "all") return products;
    return products.filter((p) => getCategoryBySlug(slug) === p.category);
  }, [slug]);

  const filtered = useMemo(() => {
    let result = [...categoryProducts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    switch (sort) {
      case "newest":
        result = result
          .filter((p) => p.isNew)
          .concat(result.filter((p) => !p.isNew));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        result.sort((a, b) => b.discount - a.discount);
        break;
      default:
        result = result
          .filter((p) => p.isFeatured)
          .concat(result.filter((p) => !p.isFeatured));
    }

    return result;
  }, [categoryProducts, search, minPrice, maxPrice, sort]);

  const sortLabels: Record<SortOption, string> = {
    featured: "Featured",
    newest: "Newest First",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    discount: "Biggest Discount",
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-body text-muted-foreground tracking-[0.2em] uppercase mb-1">
          {slug !== "all" ? "Shop" : "All Products"}
        </p>
        <h1 className="font-display text-3xl md:text-4xl mb-1">
          {categoryName}
        </h1>
        <p className="text-sm font-body text-muted-foreground">
          {filtered.length} styles
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm font-body bg-white border border-border outline-none focus:border-foreground transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-body font-medium hover:bg-secondary transition-colors sm:max-w-max"
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>

        {/* Sort */}
        <div className="relative sm:max-w-max">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none w-full sm:w-auto pl-4 pr-9 py-2.5 border border-border text-sm font-body bg-white outline-none focus:border-foreground cursor-pointer"
          >
            {(Object.keys(sortLabels) as SortOption[]).map((s) => (
              <option key={s} value={s}>
                {sortLabels[s]}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
          />
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-secondary/50 border border-border p-5 mb-6">
              <h3 className="text-xs font-body font-semibold tracking-widest uppercase mb-4">
                Price Range
              </h3>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <label
                    htmlFor="min-price"
                    className="text-xs text-muted-foreground mb-1 block"
                  >
                    Min ₹
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    min={0}
                    max={maxPrice}
                    className="w-24 px-3 py-2 text-sm border border-border bg-white outline-none focus:border-foreground"
                  />
                </div>
                <span className="text-muted-foreground mt-5">—</span>
                <div>
                  <label
                    htmlFor="max-price"
                    className="text-xs text-muted-foreground mb-1 block"
                  >
                    Max ₹
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    min={minPrice}
                    max={10000}
                    className="w-24 px-3 py-2 text-sm border border-border bg-white outline-none focus:border-foreground"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(5000);
                  }}
                  className="mt-5 text-xs font-body text-muted-foreground hover:text-brand transition-colors underline"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-muted-foreground mb-2">
            No styles found
          </p>
          <p className="text-sm font-body text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
