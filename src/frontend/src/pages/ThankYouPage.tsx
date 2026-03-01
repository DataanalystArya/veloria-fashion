import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

export function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full text-center"
      >
        {/* Animated check circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
            <CheckCircle2
              size={44}
              className="text-green-500"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="font-display text-3xl md:text-4xl mb-3 leading-tight">
            Thank You for Shopping
            <br />
            <span className="text-brand">with Veloria!</span>
          </h1>
          <p className="text-sm font-body text-muted-foreground mb-2 leading-relaxed">
            Your order has been placed successfully.
          </p>
          <p className="text-sm font-body text-muted-foreground mb-8 leading-relaxed">
            We'll notify you on WhatsApp once your order is confirmed and
            dispatched.
          </p>

          {/* Info box */}
          <div className="bg-secondary/40 border border-border rounded-sm p-4 mb-8 text-sm font-body text-left space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-brand font-medium">📦</span>
              <span className="text-muted-foreground">
                Estimated delivery:{" "}
                <strong className="text-foreground">3–7 business days</strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-brand font-medium">📱</span>
              <span className="text-muted-foreground">
                WhatsApp updates on your registered number
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-brand font-medium">📞</span>
              <span className="text-muted-foreground">
                Questions?{" "}
                <a
                  href="tel:9351469466"
                  className="text-brand font-medium hover:underline"
                >
                  +91 93514 69466
                </a>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => void navigate({ to: "/" })}
              className="btn-veloria py-3 inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag size={15} />
              Continue Shopping
            </button>
            <button
              type="button"
              onClick={() => void navigate({ to: "/orders" })}
              className="px-6 py-3 text-xs font-body font-medium tracking-widest uppercase border border-foreground hover:bg-foreground hover:text-white transition-colors"
            >
              View My Orders
            </button>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
