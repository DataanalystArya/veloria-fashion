import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { categories } from "@/data/products";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalWishlisted } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      void navigate({ to: "/category/$slug", params: { slug: "all" } });
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-border"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 -ml-2 text-foreground hover:text-brand transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="font-display text-2xl md:text-3xl font-semibold tracking-[0.15em] text-foreground hover:text-brand transition-colors"
            >
              VELORIA
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-3 py-2 text-xs font-body font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>

              {/* Categories dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCatOpen(true)}
                onMouseLeave={() => setIsCatOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 text-xs font-body font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shop{" "}
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${isCatOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isCatOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-44 bg-white border border-border shadow-card py-2 z-50"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          to="/category/$slug"
                          params={{ slug: cat.slug }}
                          className="block px-4 py-2 text-xs font-medium tracking-wide text-foreground hover:bg-secondary hover:text-brand transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to="/category/$slug"
                  params={{ slug: cat.slug }}
                  className="px-3 py-2 text-xs font-body font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-foreground hover:text-brand transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-foreground hover:text-brand transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {totalWishlisted > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalWishlisted > 9 ? "9+" : totalWishlisted}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-foreground hover:text-brand transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-border"
              >
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-3 py-3"
                >
                  <Search
                    size={16}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search for dresses, tops, co-ords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display text-xl font-semibold tracking-[0.15em]">
                  VELORIA
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-3 text-sm font-medium tracking-wider text-foreground hover:text-brand hover:bg-secondary transition-colors"
                >
                  Home
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to="/category/$slug"
                    params={{ slug: cat.slug }}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-sm font-medium tracking-wider text-foreground hover:text-brand hover:bg-secondary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="mt-4 border-t border-border pt-4">
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-sm font-medium tracking-wider text-foreground hover:text-brand hover:bg-secondary transition-colors"
                  >
                    My Orders
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
