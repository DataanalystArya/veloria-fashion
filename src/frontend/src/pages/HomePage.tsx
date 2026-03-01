import { CategoryGrid } from "@/components/veloria/CategoryGrid";
import { FeaturedCollection } from "@/components/veloria/FeaturedCollection";
import { HeroBanner } from "@/components/veloria/HeroBanner";
import { NewArrivals } from "@/components/veloria/NewArrivals";
import { SaleBanner } from "@/components/veloria/SaleBanner";
import { motion } from "motion/react";

export function HomePage() {
  return (
    <main>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedCollection />
      <SaleBanner />
      <NewArrivals />

      {/* Brand Promise Section */}
      <section className="py-14 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: "🚚",
                title: "Free Shipping",
                desc: "On orders above ₹999",
              },
              {
                icon: "↩️",
                title: "Easy Returns",
                desc: "Hassle-free 7-day returns",
              },
              { icon: "💳", title: "Secure Payment", desc: "UPI, COD & more" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-display text-lg">{item.title}</h3>
                <p className="text-sm font-body text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
