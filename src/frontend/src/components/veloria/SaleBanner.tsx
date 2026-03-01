import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function SaleBanner() {
  return (
    <section className="relative overflow-hidden my-12">
      <div className="relative h-[260px] md:h-[300px]">
        <img
          src="/assets/generated/sale-banner.dim_1200x300.jpg"
          alt="Sale - Up to 40% off"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/60" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-3">
                <p className="text-white/60 text-xs font-body tracking-[0.3em] uppercase">
                  Limited Time Offer
                </p>
                <h2 className="font-display text-white text-2xl md:text-5xl font-semibold leading-none">
                  SALE UP TO
                </h2>
                <h2
                  className="font-display italic text-3xl md:text-6xl font-bold leading-none mb-3"
                  style={{ color: "oklch(0.88 0.06 10)" }}
                >
                  40% OFF
                </h2>
                <p className="text-white/70 text-sm font-body">
                  On selected styles across all categories
                </p>
                <Link
                  to="/category/$slug"
                  params={{ slug: "dresses" }}
                  className="btn-veloria inline-flex"
                >
                  Grab the Deal
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
