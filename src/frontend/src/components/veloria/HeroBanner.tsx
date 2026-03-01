import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function HeroBanner() {
  return (
    <section className="relative h-[85vh] min-h-[520px] max-h-[800px] overflow-hidden bg-secondary">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-banner.dim_1200x600.jpg"
          alt="Veloria - Premium Fashion"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/70 text-xs font-body tracking-[0.25em] uppercase mb-4"
          >
            New Collection 2025
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-white leading-[1.05] mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Dress the{" "}
            <span className="italic" style={{ color: "oklch(0.88 0.06 10)" }}>
              Future.
            </span>
            <br />
            Own the <span className="italic">Moment.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-white/70 text-sm font-body leading-relaxed mb-8 max-w-sm"
          >
            Premium fashion for bold women. Explore our curated collection of
            dresses, co-ords, and more — up to 40% off.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex items-center gap-4"
          >
            <Link
              to="/category/$slug"
              params={{ slug: "dresses" }}
              className="btn-veloria flex items-center gap-2 group"
            >
              Shop Now
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: "party-wear" }}
              className="text-white text-xs font-body font-medium tracking-widest uppercase border-b border-white/50 hover:border-white pb-0.5 transition-colors"
            >
              Party Wear
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
