import { categories } from "@/data/products";
import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone } from "lucide-react";
import { SiPinterest, SiX } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer className="bg-foreground text-white mt-20">
      {/* Top strip */}
      <div className="bg-brand py-3">
        <p className="text-center text-xs font-body font-medium tracking-widest uppercase text-white opacity-90">
          Free Shipping on Orders Above ₹999 &nbsp;|&nbsp; Easy Returns
          &nbsp;|&nbsp; COD Available
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <h2 className="font-display text-3xl font-semibold tracking-[0.15em] mb-3">
              VELORIA
            </h2>
            <p className="text-sm font-body text-white/60 leading-relaxed mb-5">
              Dress the future. Premium fashion curated for the modern girl who
              dares to be bold.
            </p>
            <div className="flex items-center gap-3 text-white/60 mb-3">
              <Phone size={14} />
              <a
                href="tel:9351469466"
                className="text-sm font-body hover:text-white transition-colors"
              >
                +91 93514 69466
              </a>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <MapPin size={14} />
              <span className="text-sm font-body">India</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-body font-semibold tracking-widest uppercase mb-5 text-white/80">
              Shop
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: cat.slug }}
                    className="text-sm font-body text-white/60 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-body font-semibold tracking-widest uppercase mb-5 text-white/80">
              Help
            </h3>
            <ul className="space-y-2">
              {[
                "Size Guide",
                "Track Order",
                "Returns & Exchanges",
                "Shipping Policy",
                "FAQs",
                "Contact Us",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm font-body text-white/60 cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-xs font-body font-semibold tracking-widest uppercase mb-5 text-white/80">
              Follow Us
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-brand hover:text-brand transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-brand hover:text-brand transition-colors"
              >
                <SiPinterest size={16} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-brand hover:text-brand transition-colors"
              >
                <SiX size={16} />
              </a>
            </div>
            <p className="text-xs font-body text-white/50 mb-3">
              Subscribe to get exclusive offers:
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 px-3 py-2 text-xs font-body text-white placeholder:text-white/40 outline-none focus:border-brand transition-colors"
              />
              <button
                type="button"
                className="bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand-dark transition-colors"
              >
                GO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-body text-white/40">
            © {year} VELORIA. All rights reserved.
          </p>
          <p className="text-xs font-body text-white/40">
            Built with <span className="text-brand">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
