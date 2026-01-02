# Donate Page - Phase 2 Regression Checklist

**Last Updated**: 2026-01-02
**Purpose**: Verify 100% visual and behavioral parity after Phase 2 refactor (data extraction + cleanup)

---

## Visual Testing (Required Breakpoints)

Test the donate page at these viewport widths:

- [ ] **375px** (Mobile)
- [ ] **768px** (Tablet)
- [ ] **1440px** (Desktop)

### Visual Parity Checks

- [ ] All sections render in correct order
- [ ] All text content identical (no typos, punctuation changes)
- [ ] All spacing/padding unchanged
- [ ] All colors/gradients identical
- [ ] All card hover effects work (3D transforms, shadows)
- [ ] All decorative blobs/grain overlays visible
- [ ] Hero gradient background renders correctly
- [ ] Section stagger animations play on page load (if motion enabled)

---

## Interaction Testing

### Hero Section
- [ ] "Support Reframe.me" button scrolls smoothly to Payment section
- [ ] "How your support is used" link scrolls smoothly to Transparency section
- [ ] Heart icon and text animations play on mount

### Payment Section
- [ ] **Mobile (< 768px)**: Cash App and PayPal **big buttons** visible
- [ ] **Desktop (>= 768px)**: Cash App and PayPal **QR codes** visible
- [ ] Cash App link opens in new tab
- [ ] PayPal link opens in new tab
- [ ] Safety notice box renders with orange styling

### FAQ Section
- [ ] Click first question → expands answer smoothly
- [ ] Click second question → first closes, second opens
- [ ] Click open question → collapses
- [ ] Chevron icon rotates 180° when expanded
- [ ] Only one FAQ item can be open at a time

### Back to Top Button
- [ ] Button **appears** when `scrollY > 400px`
- [ ] Button **disappears** when scrolling back up `< 400px`
- [ ] Click button → smoothly scrolls to top
- [ ] Button gradient, shadow, and position match original

### Other Interactions
- [ ] All card hover effects work (Support Matters, Transparency, Other Ways)
- [ ] Closing CTA button scrolls to Payment section
- [ ] No console errors or warnings

---

## DOM Parity Reminders

**Critical constraints (must remain unchanged):**
- Element nesting and order within sections
- `className` strings (exact match)
- Inline styles and style objects
- Text content (including punctuation/whitespace)
- `aria-*` attributes
- `section:nth-child(N)` animation delays still work (stagger effect)
- `<DonateStyles />` remains first child inside outer wrapper div

---

## Performance Checks

- [ ] Page loads without flickering
- [ ] Animations smooth (no jank)
- [ ] Scroll behavior responsive
- [ ] No layout shifts on load

---

## Data Integrity Checks

After Phase 2 data extraction:

- [ ] **FAQ items**: 2 questions render correctly
- [ ] **Transparency items**: 3 cards with correct colors (teal, orange, purple)
- [ ] **Other Ways items**: 3 cards with correct icons (Share2, MessageSquare, Briefcase)
- [ ] All icons render correctly
- [ ] All colors match original (teal = #14b8a6, orange = #f97316, purple = #8b5cf6)

---

## Cross-Browser Testing (Optional)

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

---

## Build Verification

- [ ] `npm run check` passes (TypeScript)
- [ ] `npm run build` succeeds
- [ ] Production build loads and functions identically

---

## Notes

If any check fails, the refactor has introduced a regression. Revert changes and investigate before proceeding.

Phase 2 changes are **DOM-IDENTICAL** by design. Any visual or behavioral difference is a bug.
