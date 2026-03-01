import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { products } from "@/data/products";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ClipboardCheck,
  Copy,
  CreditCard,
  MapPin,
  MessageCircle,
  Phone,
  Truck,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

interface ShippingForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

type PaymentMethod = "upi" | "cod";

const SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;
const VELORIA_UPI_ID = "9351469466@ibl";
const WHATSAPP_NUMBER = "919351469466";

function buildWhatsAppMessage(
  orderId: string,
  form: ShippingForm,
  cartProducts: Array<{
    product: { name: string; price: number } | undefined;
    size: string;
    quantity: number;
    productId: number;
  }>,
  total: number,
  paymentMethod: PaymentMethod,
): string {
  const itemLines = cartProducts
    .filter((i) => i.product !== undefined)
    .map(
      (i) =>
        `• ${i.product!.name} (Size: ${i.size}, Qty: ${i.quantity}) - ₹${(i.product!.price * i.quantity).toLocaleString("en-IN")}`,
    )
    .join("\n");

  return `🛍️ New Order on Veloria!

Order ID: #${orderId}
Customer: ${form.name}
Phone: ${form.phone}

📦 Items Ordered:
${itemLines}

💰 Total: ₹${total.toLocaleString("en-IN")}
Payment: ${paymentMethod === "upi" ? `UPI (${VELORIA_UPI_ID})` : "Cash on Delivery"}

📍 Delivery Address:
${form.name}
${form.address}, ${form.city}
${form.state} - ${form.pincode}
Phone: ${form.phone}`;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [form, setForm] = useState<ShippingForm>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [isPlaced, setIsPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});

  // UPI specific state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState("");
  const [copied, setCopied] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const cartProducts = items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((i) => i.product !== undefined);

  const subtotal = cartProducts.reduce(
    (sum, { product, quantity }) => sum + product!.price * quantity,
    0,
  );
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleCopyUpi = () => {
    void navigator.clipboard.writeText(VELORIA_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setScreenshotFile(file);
    if (file) setScreenshotError("");
  };

  const validate = (): boolean => {
    const e: Partial<ShippingForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      e.phone = "Valid 10-digit number required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode))
      e.pincode = "Valid 6-digit pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    if (items.length === 0) return;

    // UPI screenshot validation
    if (paymentMethod === "upi" && !screenshotFile) {
      setScreenshotError(
        "Please upload payment screenshot to confirm UPI payment",
      );
      return;
    }

    const id = placeOrder({
      items,
      total,
      paymentMethod,
      shippingInfo: form,
    });

    const message = buildWhatsAppMessage(
      id,
      form,
      cartProducts,
      total,
      paymentMethod,
    );
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(waUrl);

    setOrderId(id);
    clearCart();
    setIsPlaced(true);

    // Open WhatsApp immediately
    window.open(waUrl, "_blank");
  };

  if (items.length === 0 && !isPlaced) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Your bag is empty</h1>
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="btn-veloria"
        >
          Go Shopping
        </button>
      </main>
    );
  }

  if (isPlaced) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center"
        >
          <CheckCircle2
            size={72}
            className="mx-auto text-green-500 mb-6"
            strokeWidth={1.5}
          />
          <h1 className="font-display text-3xl md:text-4xl mb-3">
            Order Placed!
          </h1>
          <p className="text-sm font-body text-muted-foreground mb-2">
            Thank you, <strong>{form.name}</strong>! Your order has been
            confirmed.
          </p>
          <div className="bg-secondary/50 border border-border p-4 my-6 text-left space-y-2">
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-semibold text-brand">#{orderId}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium">
                {paymentMethod === "upi" ? "UPI" : "Cash on Delivery"}
              </span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* WhatsApp notice */}
          <div className="bg-green-50 border border-green-200 rounded-sm p-3 mb-4 text-xs font-body text-green-800 flex items-start gap-2">
            <MessageCircle
              size={15}
              className="flex-none mt-0.5 text-green-600"
            />
            <span>
              A WhatsApp message has been opened with your order details. Please
              send it to confirm your order.
            </span>
          </div>

          <p className="text-xs font-body text-muted-foreground mb-6">
            For queries, call us at{" "}
            <a
              href="tel:9351469466"
              className="text-brand font-medium hover:underline"
            >
              +91 93514 69466
            </a>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => void navigate({ to: "/orders" })}
              className="btn-veloria"
            >
              View My Orders
            </button>
            <button
              type="button"
              onClick={() => void navigate({ to: "/" })}
              className="px-6 py-3 text-xs font-body font-medium tracking-widest uppercase border border-foreground hover:bg-foreground hover:text-white transition-colors"
            >
              Continue Shopping
            </button>
            <button
              type="button"
              onClick={() => window.open(whatsappUrl, "_blank")}
              className="px-6 py-3 text-xs font-body font-medium tracking-widest uppercase border border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} />
              Send Order on WhatsApp
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-1">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Info */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={18} className="text-brand" />
              <h2 className="font-display text-xl">Shipping Address</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                error={errors.name}
                placeholder="Your full name"
              />
              <Field
                label="Phone Number"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                error={errors.phone}
                placeholder="10-digit mobile number"
                type="tel"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Address"
                  value={form.address}
                  onChange={(v) => setForm((f) => ({ ...f, address: v }))}
                  error={errors.address}
                  placeholder="House/Flat/Street/Area"
                />
              </div>
              <Field
                label="City"
                value={form.city}
                onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                error={errors.city}
                placeholder="City"
              />
              <Field
                label="State"
                value={form.state}
                onChange={(v) => setForm((f) => ({ ...f, state: v }))}
                error={errors.state}
                placeholder="State"
              />
              <Field
                label="Pincode"
                value={form.pincode}
                onChange={(v) => setForm((f) => ({ ...f, pincode: v }))}
                error={errors.pincode}
                placeholder="6-digit pincode"
              />
            </div>
          </section>

          {/* Payment */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={18} className="text-brand" />
              <h2 className="font-display text-xl">Payment Method</h2>
            </div>
            <div className="space-y-3">
              {/* UPI */}
              <div
                className={`block border transition-all ${
                  paymentMethod === "upi"
                    ? "border-foreground bg-white"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <label
                  htmlFor="payment-upi"
                  className="flex items-center gap-3 p-4 cursor-pointer"
                >
                  <input
                    id="payment-upi"
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-none transition-all ${
                      paymentMethod === "upi"
                        ? "border-foreground bg-foreground"
                        : "border-border"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-body font-medium">UPI Payment</p>
                    <p className="text-xs font-body text-muted-foreground">
                      Google Pay, PhonePe, Paytm, BHIM UPI
                    </p>
                  </div>
                </label>

                <AnimatePresence>
                  {paymentMethod === "upi" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 pt-1 border-t border-border space-y-5">
                        {/* UPI Banner */}
                        <div className="bg-brand/5 border border-brand/20 rounded-sm p-3 text-center">
                          <p className="text-xs font-body text-brand font-medium tracking-wide uppercase mb-0.5">
                            Send payment to Veloria via UPI
                          </p>
                          <p className="text-[10px] font-body text-muted-foreground">
                            Use any UPI app to pay instantly
                          </p>
                        </div>

                        {/* UPI ID + Copy */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary/60 border border-border px-3 py-2.5 rounded-sm">
                            <p className="text-[10px] font-body text-muted-foreground mb-0.5">
                              UPI ID
                            </p>
                            <p className="text-sm font-body font-semibold tracking-tight text-foreground select-all">
                              {VELORIA_UPI_ID}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className={`flex-none flex items-center gap-1.5 px-3 py-2.5 text-xs font-body font-medium border transition-all rounded-sm ${
                              copied
                                ? "border-green-500 text-green-600 bg-green-50"
                                : "border-foreground text-foreground hover:bg-foreground hover:text-white"
                            }`}
                          >
                            {copied ? (
                              <>
                                <ClipboardCheck size={13} />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                Copy UPI ID
                              </>
                            )}
                          </button>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="border border-border bg-black p-4 rounded-sm inline-block shadow-sm">
                            <img
                              src="/assets/uploads/image-1.png"
                              alt="PhonePe QR - Scan & Pay via PhonePe"
                              className="w-[220px] h-[280px] object-contain"
                            />
                          </div>
                          <p className="text-xs font-body text-muted-foreground text-center">
                            Scan & Pay via PhonePe
                            <br />
                            <span className="font-medium text-foreground">
                              ARYA VERMA
                            </span>
                          </p>
                        </div>

                        {/* Screenshot Upload */}
                        <div>
                          <p className="text-xs font-body font-medium text-foreground mb-2">
                            Upload Payment Screenshot{" "}
                            <span className="text-brand">*</span>{" "}
                            <span className="text-muted-foreground font-normal">
                              (required)
                            </span>
                          </p>
                          <input
                            ref={fileInputRef}
                            id="payment-screenshot"
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="sr-only"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-sm p-5 flex flex-col items-center gap-2 transition-colors cursor-pointer ${
                              screenshotError
                                ? "border-destructive bg-destructive/5"
                                : screenshotFile
                                  ? "border-green-400 bg-green-50"
                                  : "border-border hover:border-muted-foreground hover:bg-secondary/40"
                            }`}
                          >
                            <Upload
                              size={22}
                              className={
                                screenshotFile
                                  ? "text-green-500"
                                  : "text-muted-foreground"
                              }
                              strokeWidth={1.5}
                            />
                            {screenshotFile ? (
                              <span className="text-xs font-body text-green-700 font-medium text-center break-all px-2">
                                ✓ {screenshotFile.name}
                              </span>
                            ) : (
                              <span className="text-xs font-body text-muted-foreground text-center">
                                Click to upload screenshot
                                <br />
                                <span className="text-[10px]">
                                  JPG, PNG, WEBP supported
                                </span>
                              </span>
                            )}
                          </button>
                          {screenshotError && (
                            <p className="text-xs text-destructive mt-1.5">
                              {screenshotError}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* COD */}
              <label
                htmlFor="payment-cod"
                className={`block border p-4 cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-foreground bg-white"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    id="payment-cod"
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-none transition-all ${
                      paymentMethod === "cod"
                        ? "border-foreground bg-foreground"
                        : "border-border"
                    }`}
                  />
                  <div className="flex items-center gap-3">
                    <Truck size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-body font-medium">
                        Cash on Delivery
                      </p>
                      <p className="text-xs font-body text-muted-foreground">
                        Pay when your order arrives
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* Help */}
          <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
            <Phone size={15} />
            <span>
              Need help? Call us at{" "}
              <a
                href="tel:9351469466"
                className="text-brand font-medium hover:underline"
              >
                +91 93514 69466
              </a>
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border p-6 sticky top-24">
            <h2 className="font-display text-xl mb-5">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartProducts.map(({ product, size, quantity }) => (
                <div key={`${product!.id}-${size}`} className="flex gap-3">
                  <img
                    src={product!.imageUrl}
                    alt={product!.name}
                    className="w-14 aspect-[3/4] object-cover flex-none"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body font-medium line-clamp-1">
                      {product!.name}
                    </p>
                    <p className="text-[10px] font-body text-muted-foreground">
                      Size: {size} · Qty: {quantity}
                    </p>
                    <p className="text-xs font-body font-semibold mt-0.5">
                      ₹{(product!.price * quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Shipping</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>₹{shipping}</span>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between font-body font-semibold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full btn-veloria py-3.5 text-sm"
            >
              Place Order
            </button>

            <Link
              to="/cart"
              className="mt-3 block text-center text-xs font-body text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  const fieldId = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="text-xs font-body font-medium text-muted-foreground mb-1 block"
      >
        {label} <span className="text-brand">*</span>
      </label>
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 text-sm border bg-white outline-none transition-colors ${
          error ? "border-destructive" : "border-border focus:border-foreground"
        }`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
