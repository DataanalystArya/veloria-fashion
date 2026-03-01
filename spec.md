# Veloria Fashion - UI Polish & Feature Updates

## Current State
- Full e-commerce site with Home, Category, Product Detail, Cart, Checkout, Wishlist, Orders pages
- Hero banner with background text overlay causing "VELORIA / FASHION FOR HER" text bleeding through the gradient
- Sale banner with text overlapping due to insufficient overlay and large font sizes
- ProductCard has basic layout, no consistent height enforcement
- ProductDetailPage has a non-functional "Size Guide" button (no modal)
- CheckoutPage uses a generated QR code image for UPI payment (needs to use the real uploaded PhonePe QR)
- Mobile layout has potential overlap and padding issues

## Requested Changes (Diff)

### Add
- Size Guide modal on ProductDetailPage: clicking "Size Guide" opens a Dialog with a table showing XS/S/M/L bust, waist, and length measurements
- Size Guide button also accessible on ProductCard hover area (link to product page)

### Modify
- **HeroBanner**: Increase gradient overlay strength (`from-black/75 via-black/45`) so background decorative text never bleeds through; ensure content `z-index` is above overlay; add `relative z-10` wrapper with proper padding so no text clips
- **SaleBanner**: Replace full-bleed stacked headings with a cleaner flex layout; reduce font sizes on mobile; use `leading-none` + proper `gap` between each text element; strengthen overlay to `from-foreground/90`
- **ProductCard**: Add `min-h` to info section so cards have consistent height; ensure product name uses `line-clamp-2` with fixed height; add shadow on hover via `group-hover:shadow-lg`; add `overflow-hidden` to card container
- **CheckoutPage UPI QR**: Replace generated QR image path with the uploaded PhonePe QR image at `/assets/uploads/image-1.png`; update alt text to "PhonePe QR - Scan & Pay"
- **index.css**: Add `overflow-wrap: break-word` and `word-break: break-word` on body; tighten heading `line-height` to `1.1` for display headings; ensure `.btn-veloria` has `white-space: nowrap`
- **CategoryGrid**: Ensure category name text has proper `text-shadow` or stronger gradient for legibility
- **Navbar**: Ensure `z-50` and `position: sticky top-0` so it never overlaps content

### Remove
- Nothing removed

## Implementation Plan
1. Fix HeroBanner gradient overlay strength and z-index layering
2. Fix SaleBanner text overlap - restructure layout with proper spacing
3. Add Size Guide modal (Dialog component) to ProductDetailPage with measurements table
4. Improve ProductCard: consistent height, line-clamp-2 for name, hover shadow
5. Update CheckoutPage QR code to use `/assets/uploads/image-1.png` (PhonePe QR)
6. Mobile padding fixes across all pages (px-4 minimum, buttons not touching edges)
7. Add general polish: smooth transitions, font hierarchy consistency
