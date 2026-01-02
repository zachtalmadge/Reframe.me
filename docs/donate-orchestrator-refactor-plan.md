# Donate Page Orchestrator Refactor Plan

**Created**: 2026-01-02
**Updated**: 2026-01-02
**Status**: Phase 1 - Parity Phase (Revised)
**Target File**: `/client/src/pages/Donate.tsx` (977 lines)

---

## Goal

**Primary Success Criterion**: 100% visual and behavioral parity with the current implementation.

Phase 1 intentionally tolerates code duplication, verbose structures, and "ugly" extraction patterns to **eliminate any risk of visual regression**. Architecture cleanliness, deduplication, and optimization are explicitly **out of scope** for this phase.

All DOM structure, CSS classes, inline styles, text content, ARIA attributes, animation timing, and user interactions must remain **pixel-perfect identical** to the original.

---

## Current Page Inventory

### Top-Level Structure (Render Order)

1. **Outer wrapper div** (line 70) - `overflowX: 'hidden'` container
2. **Style block** (lines 73-236) - Page-specific CSS with keyframes
3. **Hero Section** (lines 240-356) - Animated header with gradient background
4. **Payment Section** (lines 360-573) - QR codes / payment buttons (responsive)
5. **Why Your Support Matters** (lines 576-666) - 4-card asymmetric grid
6. **Transparency Section** (lines 669-736) - Editorial-style breakdown of fund usage
7. **Testimonial Section** (lines 739-781) - Quote card with decorative elements
8. **Privacy & Data Reassurance** (lines 784-822) - Bullet list with highlighted callout
9. **FAQ Section** (lines 825-869) - Accordion with 2 items
10. **Other Ways to Support** (lines 872-926) - 3-card grid of non-monetary support options
11. **Closing CTA** (lines 929-956) - Final donation call-to-action
12. **Back to Top Button** (lines 960-968) - Conditional floating action button

### State Variables

| Variable | Type | Purpose | UI Behavior Controlled | **New Owner (Phase 1)** |
|----------|------|---------|------------------------|-------------------------|
| `showBackToTop` | `boolean` | Tracks scroll position | Shows/hides floating back-to-top button when `scrollY > 400` | **→ DonateBackToTopButton** |
| `qrSectionRef` | `RefObject<HTMLElement>` | Payment section ref | Target for smooth scroll from hero CTA and closing CTA | Orchestrator |
| `transparencySectionRef` | `RefObject<HTMLElement>` | Transparency section ref | Target for smooth scroll from hero "How your support is used" link | Orchestrator |
| `openFaq` | `number \| null` | FAQ accordion state | Controls which FAQ item is expanded (null = all closed) | **→ DonateFaqSection** |
| `heroMounted` | `boolean` | Animation gate | Triggers hero section fade-in animations via conditional classes | **→ DonateHeroSection** |

### Effects (Current Location → New Location)

**Effect 1: Scroll listener** (lines 24-30) → **Move to DonateBackToTopButton**
- **Trigger**: Component mount
- **Behavior**: Adds scroll event listener; sets `showBackToTop` to `true` when `window.scrollY > 400`
- **Cleanup**: Removes scroll listener on unmount
- **Dependencies**: `[]`

**Effect 2: Initial mount animation** (lines 32-37) → **Move to DonateHeroSection**
- **Trigger**: Component mount
- **Behavior**:
  1. Immediately scrolls to top (`window.scrollTo(0, 0)`)
  2. Uses `requestAnimationFrame` to delay setting `heroMounted = true` by one frame
- **Purpose**: Ensures hero animations play on page load
- **Dependencies**: `[]`

### Event Handlers (Current Location → New Location)

| Handler | Purpose | Implementation | **New Owner** |
|---------|---------|----------------|---------------|
| `scrollToQR` | Scroll to payment section | Calls `qrSectionRef.current?.scrollIntoView({ behavior: "smooth" })` | Orchestrator (multi-section dependency) |
| `scrollToTransparency` | Scroll to transparency section | Calls `transparencySectionRef.current?.scrollIntoView({ behavior: "smooth" })` | Orchestrator (multi-section dependency) |
| `scrollToTop` | Scroll to page top | Calls `window.scrollTo({ top: 0, behavior: "smooth" })` | **→ DonateBackToTopButton** |
| `toggleFaq` | Toggle FAQ accordion item | Sets `openFaq` to `index` if closed, `null` if already open | **→ DonateFaqSection** |

### Data (Current Location → New Location)

**`faqItems`** (lines 55-66) → **Move to DonateFaqSection (or local constants)**
Array of 2 FAQ objects: `{ question: string, answer: string }[]`

Used in FAQ Section map (line 836).

### CSS & Animation Dependencies

**Inline `<style>` block** (lines 73-236) → **Extract to DonateStyles component**:
- **Keyframes**: `float-subtle`, `glow-pulse`
- **Custom classes**: `display-font`, `grain-overlay`, `shimmer-gradient`, `text-gradient-warm`, `organic-blob`, `card-3d`, `qr-card`, `donate-button-enhanced`, `faq-item`
- **Critical selector**: `section:nth-child(N)` animation delays (lines 232-235)
  - Applies staggered fade-in to sections based on DOM order
  - **WILL BREAK** if sections are wrapped or reordered
  - **Mitigation**: Extract to component that renders `<style>` tag at exact same DOM position
  - **IMPORTANT**: `section:nth-child(...)` is evaluated among **children of the outer wrapper div**
  - `<DonateStyles />` must remain the **first child** inside that wrapper
  - Each section component must return a `<section>` as its **top-level DOM element**
  - No additional element siblings may be introduced before or between sections

**Tailwind classes**: Extensive use throughout (responsive breakpoints, gradients, spacing)

**Inline styles**: Present in nearly every section (gradient backgrounds, shadows, transform delays)

---

## Parity Risk Register

### Critical Risks & Mitigations

1. **`nth-child` selectors breaking** (lines 232-235)
   - **Risk**: Adding wrapper divs around sections will change `:nth-child()` indexes
   - **Mitigation**: Extract each section as a **component that returns a `<section>` element directly** (no wrapper). Parent returns a fragment or preserves exact DOM structure. Extract styles to a component that renders a literal `<style>` tag at the exact same sibling position.

2. **Style block relocation changing cascade**
   - **Risk**: Moving the `<style>` block to a different file or position could affect specificity/order or break `nth-child` selectors
   - **Mitigation**: Extract to `DonateStyles` component that renders a literal `<style>{`CSS string`}</style>` tag. Render `<DonateStyles />` at the **exact same DOM position** (line 73, immediately after outer div opens). CSS string must be **copy/pasted verbatim** (no modifications).

3. **Ref attachment to wrong DOM node**
   - **Risk**: If section components accept refs incorrectly, `scrollIntoView` will fail
   - **Mitigation**: Pass refs via `React.forwardRef` to ensure they attach to the correct `<section>` element.

4. **Animation timing differences**
   - **Risk**: `heroMounted` state + `requestAnimationFrame` timing is fragile; moving to child could break timing
   - **Mitigation**: Move the **entire effect** (including `window.scrollTo` and `requestAnimationFrame`) into `DonateHeroSection` as a unit. Do NOT modify the effect logic. Test animations carefully.

5. **Conditional rendering changes**
   - **Risk**: Back-to-top button uses `{showBackToTop && ...}` pattern; moving state could break visibility logic
   - **Mitigation**: Move `showBackToTop` state, scroll listener, and handler into `DonateBackToTopButton`. Component returns `null` when hidden, same button JSX when visible. Verify scroll threshold (400px) unchanged.

6. **Scroll behavior dependencies**
   - **Risk**: Section refs used in multiple handlers; refs crossing component boundaries could fail
   - **Mitigation**: Keep refs and cross-section scroll handlers (`scrollToQR`, `scrollToTransparency`) in orchestrator. Only move single-component handlers (`scrollToTop`) into their component.

7. **Responsive behavior changes**
   - **Risk**: Payment section has mobile/desktop conditional rendering (lines 387-541)
   - **Mitigation**: Extract entire Payment section verbatim, preserving both code paths and all classes.

8. **Inline style object references**
   - **Risk**: Some inline styles use object literals; changing structure could affect React reconciliation
   - **Mitigation**: Copy/paste inline style objects exactly as-is; do not refactor to named constants.

9. **FAQ accordion state management**
   - **Risk**: `openFaq` state controls expand/collapse; moving state could break accordion behavior
   - **Mitigation**: Move `openFaq` state, `toggleFaq` handler, and `faqItems` data into `DonateFaqSection` as a unit. Verify accordion logic unchanged (only one item open at a time, clicking open item closes it).

10. **Text content and whitespace**
    - **Risk**: Even minor changes to text (punctuation, line breaks) could cause layout shifts
    - **Mitigation**: Copy/paste all text content exactly, preserving JSX whitespace (`{' '}`, line breaks).

---

## Target Architecture (Phase 1 Only - Revised)

### File Structure

```
client/src/pages/
├── Donate.tsx                    # Orchestrator (target: ~80-100 lines)
└── donate/
    ├── sections/
    │   ├── DonateStyles.tsx      # Style block extraction
    │   ├── DonateHeroSection.tsx
    │   ├── DonatePaymentSection.tsx
    │   ├── DonateSupportMattersSection.tsx
    │   ├── DonateTransparencySection.tsx
    │   ├── DonateTestimonialSection.tsx
    │   ├── DonatePrivacySection.tsx
    │   ├── DonateFaqSection.tsx
    │   ├── DonateOtherWaysSection.tsx
    │   ├── DonateClosingCtaSection.tsx
    │   └── DonateBackToTopButton.tsx
    └── data/
        └── donate.constants.ts   # (Phase 2 - out of scope for now)
```

### Orchestrator Responsibilities (Donate.tsx)

**Orchestrator ONLY owns:**
- ✅ Cross-section refs: `qrSectionRef`, `transparencySectionRef`
- ✅ Cross-section handlers: `scrollToQR()`, `scrollToTransparency()` (these scroll to sections defined in other components, so must remain centralized)
- ✅ Outer wrapper div (line 70)
- ✅ Section composition (rendering section components in correct order)

**Orchestrator NO LONGER owns (moved to components):**
- ❌ `showBackToTop` state (→ DonateBackToTopButton)
- ❌ `heroMounted` state (→ DonateHeroSection)
- ❌ `openFaq` state (→ DonateFaqSection)
- ❌ `scrollToTop` handler (→ DonateBackToTopButton)
- ❌ `toggleFaq` handler (→ DonateFaqSection)
- ❌ `faqItems` data (→ DonateFaqSection)
- ❌ Scroll listener effect (→ DonateBackToTopButton)
- ❌ Mount animation effect (→ DonateHeroSection)
- ❌ Inline `<style>` block (→ DonateStyles)

**Final orchestrator structure:**
```tsx
import { useRef } from "react";
import { DonateStyles } from "./donate/sections/DonateStyles";
import { DonateHeroSection } from "./donate/sections/DonateHeroSection";
import { DonatePaymentSection } from "./donate/sections/DonatePaymentSection";
// ... other imports

export default function Donate() {
  // Only cross-section refs
  const qrSectionRef = useRef<HTMLElement>(null);
  const transparencySectionRef = useRef<HTMLElement>(null);

  // Only cross-section scroll handlers
  const scrollToQR = () => {
    qrSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTransparency = () => {
    transparencySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div style={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>
        {/* Style block extraction - SAME DOM POSITION */}
        <DonateStyles />

        {/* Section components - SAME ORDER */}
        <DonateHeroSection
          scrollToQR={scrollToQR}
          scrollToTransparency={scrollToTransparency}
        />
        <DonatePaymentSection ref={qrSectionRef} />
        <DonateSupportMattersSection />
        <DonateTransparencySection ref={transparencySectionRef} />
        <DonateTestimonialSection />
        <DonatePrivacySection />
        <DonateFaqSection />
        <DonateOtherWaysSection />
        <DonateClosingCtaSection scrollToQR={scrollToQR} />
      </div>

      <DonateBackToTopButton />
    </>
  );
}
```

### Component Ownership Model

**DonateStyles.tsx**
- **Owns**: CSS string (verbatim copy of lines 73-236)
- **Returns**: Literal `<style>{`CSS`}</style>` tag
- **Props**: None

**DonateHeroSection.tsx**
- **Owns**: `heroMounted` state, mount effect (scroll to top + requestAnimationFrame)
- **Receives**: `scrollToQR()`, `scrollToTransparency()` handlers from orchestrator
- **Returns**: `<section>` with hero content

**DonatePaymentSection.tsx**
- **Owns**: Payment section markup (QR codes, buttons)
- **Receives**: Ref from orchestrator via `forwardRef`
- **Returns**: `<section>` with payment content

**DonateFaqSection.tsx**
- **Owns**: `openFaq` state, `toggleFaq` handler, `faqItems` data (or imports from local constants)
- **Receives**: Nothing (fully self-contained)
- **Returns**: `<section>` with FAQ accordion

**DonateBackToTopButton.tsx**
- **Owns**: `showBackToTop` state, scroll listener effect, `scrollToTop` handler
- **Receives**: Nothing (fully self-contained)
- **Returns**: `null` when hidden, `<button>` when visible

**All other sections**
- **Owns**: Only their markup (no state/effects)
- **Receives**: Only cross-section handlers if needed (e.g., `scrollToQR` for closing CTA)
- **Returns**: `<section>` with section content

### Section Component Pattern

Each section component:
- **Returns a `<section>` element directly** (no wrapper div) to preserve `nth-child` selectors
- Uses `React.forwardRef` if it needs a ref from orchestrator
- Owns its state/effects if behavior is fully contained within that section
- Receives cross-section handlers as props
- **Copies DOM structure, classes, and styles verbatim**

Example (with forwardRef):
```tsx
import { forwardRef } from 'react';

interface DonatePaymentSectionProps {}

export const DonatePaymentSection = forwardRef<HTMLElement, DonatePaymentSectionProps>(
  (props, ref) => {
    return (
      <section ref={ref} className="relative py-24 md:py-32...">
        {/* EXACT copy of lines 362-572 */}
      </section>
    );
  }
);

DonatePaymentSection.displayName = 'DonatePaymentSection';
```

Example (with internal state):
```tsx
import { useState, useEffect } from 'react';

export function DonateHeroSection({
  scrollToQR,
  scrollToTransparency,
}: {
  scrollToQR: () => void;
  scrollToTransparency: () => void;
}) {
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      setHeroMounted(true);
    });
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{...}}>
      {/* EXACT copy of lines 248-355, using heroMounted state */}
    </section>
  );
}
```

### Props Specification (Revised)

| Section | Props | Ref Required | Internal State/Effects |
|---------|-------|--------------|------------------------|
| DonateStyles | _(none)_ | No | None (just CSS string) |
| DonateHeroSection | `scrollToQR: () => void`, `scrollToTransparency: () => void` | No | `heroMounted`, mount effect |
| DonatePaymentSection | _(none)_ | **Yes** (`qrSectionRef`) | None |
| DonateSupportMattersSection | _(none)_ | No | None |
| DonateTransparencySection | _(none)_ | **Yes** (`transparencySectionRef`) | None |
| DonateTestimonialSection | _(none)_ | No | None |
| DonatePrivacySection | _(none)_ | No | None |
| DonateFaqSection | _(none)_ | No | `openFaq`, `toggleFaq`, `faqItems` |
| DonateOtherWaysSection | _(none)_ | No | None |
| DonateClosingCtaSection | `scrollToQR: () => void` | No | None |
| DonateBackToTopButton | _(none)_ | No | `showBackToTop`, scroll listener, `scrollToTop` |

### NOT ALLOWED in Phase 1

- ❌ Moving `faqItems` to `donate.constants.ts` (defer to Phase 2 unless embedded in DonateFaqSection)
- ❌ Extracting hardcoded support cards to data file (defer to Phase 2)
- ❌ Modifying the CSS string in DonateStyles (must be verbatim copy)
- ❌ Adding `React.memo` to section components
- ❌ Using `lazy` or `Suspense`
- ❌ Reordering sections
- ❌ Changing any className strings
- ❌ Modifying inline styles
- ❌ Adding or removing wrappers
- ❌ "Cleaning up" duplication
- ❌ Changing DOM structure within sections (nesting/order)
- ❌ Changing text content (including punctuation/whitespace)

---

## DOM Parity Guardrails (MUST ENFORCE)

**These rules override all other instincts:**

1. **DO NOT change DOM structure** (element nesting or order) within any section
2. **DO NOT change `className` strings** (copy/paste verbatim)
3. **DO NOT change inline styles or style objects**
4. **DO NOT change text content** (including punctuation or whitespace)
5. **DO NOT change `aria-*` attributes** or `data-testid` values
6. **DO NOT add or remove wrappers** or layout containers
7. **DO NOT "clean up", dedupe, rename, or reorganize markup**
8. **DO NOT move state, effects, or handlers** into section components UNLESS specified in this plan
9. Keep each section's JSX in the **same section and relative location** it currently appears in (no cross-section moves)
10. **DO NOT introduce `React.memo`, `lazy`, `Suspense`, conditional rendering changes, or reorder sections**
11. Each section component **MUST return a `<section>` element as its top-level element** (no extra wrapper divs) to preserve `section:nth-child(...)` selectors

---

## Step-by-Step Execution Plan

### Step 0: Setup

**Scope**: Create folder structure

**Actions**:
1. Create `/client/src/pages/donate/` directory
2. Create `/client/src/pages/donate/sections/` directory
3. Create `/client/src/pages/donate/data/` directory

**Acceptance Criteria**:
- Folders exist
- No files changed yet

**Verification**: Run `ls -la client/src/pages/donate` and confirm structure

---

### Step 1: Extract Style Block to DonateStyles Component

**Scope**:
- Create `DonateStyles.tsx`
- Update `Donate.tsx` to import and render it at the **exact same DOM position**

**Actions**:
1. Create `/client/src/pages/donate/sections/DonateStyles.tsx`
2. **Copy lines 73-236 VERBATIM** (the entire `<style>{`...`}</style>` block including backticks, content, and closing tag)
   - **CRITICAL**: Do NOT reconstruct, reformat, re-indent, or "clean up" the CSS
   - **CRITICAL**: No whitespace, ordering, or selector changes are allowed
   - **CRITICAL**: Copy/paste the exact CSS string with no modifications whatsoever
3. Create component that returns this literal style tag (no modifications)
4. In `Donate.tsx`:
   - Import `DonateStyles`
   - Replace lines 73-236 with `<DonateStyles />`
   - **CRITICAL**: Ensure `<DonateStyles />` is at the **exact same position** (immediately after opening `<div style={{ overflowX: 'hidden'... }}>`)

**Code template**:
```tsx
// /client/src/pages/donate/sections/DonateStyles.tsx
export function DonateStyles() {
  return (
    <style>{`
      @keyframes float-subtle {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-6px);
        }
      }

      @keyframes glow-pulse {
        0%, 100% {
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.3), 0 0 40px rgba(249, 115, 22, 0.2);
        }
        50% {
          box-shadow: 0 0 30px rgba(20, 184, 166, 0.5), 0 0 60px rgba(249, 115, 22, 0.3);
        }
      }

      .display-font {
        font-family: 'Fraunces', Georgia, serif;
        letter-spacing: -0.02em;
      }

      /* ... EXACT COPY of all CSS from lines 73-236 ... */

      @media (prefers-reduced-motion: no-preference) {
        section {
          animation: fadeIn 0.6s ease-out backwards;
        }

        section:nth-child(2) { animation-delay: 0.1s; }
        section:nth-child(3) { animation-delay: 0.2s; }
        section:nth-child(4) { animation-delay: 0.3s; }
      }
    `}</style>
  );
}
```

**In Donate.tsx**:
```tsx
return (
  <>
    <div style={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>
      {/* Style block extraction - SAME DOM POSITION */}
      <DonateStyles />

      {/* Hero Section */}
      <section className="relative py-24...">
        {/* ... rest of hero ... */}
      </section>
      {/* ... rest of sections ... */}
    </div>
  </>
);
```

**Acceptance Criteria**:
- Page renders identically
- All styles apply correctly
- `section:nth-child(N)` animations still work (sections fade in with stagger)
- No console errors
- No visual differences

**Manual Verification Checklist**:
- [ ] Run `git diff` - verify it shows:
  - Replacement of `<style>{...}</style>` with `<DonateStyles />` in Donate.tsx
  - A new file containing the **exact same CSS string** (character-for-character match)
- [ ] Load page in browser
- [ ] All sections fade in with staggered timing (if animations enabled)
- [ ] All card hover effects work (3D transforms, shadows, glows)
- [ ] QR card glow pulse effect works on hover
- [ ] FAQ accordion styling unchanged
- [ ] Back to top button gradient unchanged
- [ ] No console errors or warnings
- [ ] Run `npm run typecheck` - passes

---

### Step 2: Extract Back to Top Button (with internal state)

**Scope**:
- Create `DonateBackToTopButton.tsx` with internal state/effects
- Update `Donate.tsx` to render without conditional

**Parity Note**:
- Do NOT change visibility threshold (`scrollY > 400`)
- Initial visibility behavior must match existing implementation exactly
- Optional improvements (e.g., eager state sync on mount) are **out of scope for Phase 1**

**Actions**:
1. Create `/client/src/pages/donate/sections/DonateBackToTopButton.tsx`
2. **Move** `showBackToTop` state (line 18)
3. **Move** scroll listener effect (lines 24-30)
4. **Move** `scrollToTop` handler (lines 47-49)
5. Copy button JSX (lines 960-968) - return `null` if `!showBackToTop`, otherwise return button
6. In `Donate.tsx`:
   - **Remove** `showBackToTop` state
   - **Remove** scroll listener effect (lines 24-30)
   - **Remove** `scrollToTop` handler
   - Import `DonateBackToTopButton`
   - Replace lines 960-968 with: `<DonateBackToTopButton />` (no conditional - component handles it internally)

**Code template**:
```tsx
// /client/src/pages/donate/sections/DonateBackToTopButton.tsx
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function DonateBackToTopButton() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showBackToTop) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center shimmer-gradient"
      aria-label="Back to top"
    >
      <ArrowUp className="w-7 h-7 text-white" />
    </button>
  );
}
```

**In Donate.tsx** (remove lines 18, 24-30, 47-49, and conditional at 960-968):
```tsx
import { useRef } from "react";
import { DonateStyles } from "./donate/sections/DonateStyles";
import { DonateBackToTopButton } from "./donate/sections/DonateBackToTopButton";
// ... other section imports

export default function Donate() {
  const qrSectionRef = useRef<HTMLElement>(null);
  const transparencySectionRef = useRef<HTMLElement>(null);

  const scrollToQR = () => {
    qrSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTransparency = () => {
    transparencySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div style={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>
        <DonateStyles />
        {/* ... sections ... */}
      </div>

      <DonateBackToTopButton />
    </>
  );
}
```

**Acceptance Criteria**:
- Button still appears when scrolling past 400px
- Button disappears when scrolling back up
- Click behavior (smooth scroll to top) unchanged
- Visual appearance identical
- No console errors

**Manual Verification Checklist**:
- [ ] Load page in browser
- [ ] Scroll down > 400px - button appears
- [ ] Scroll up < 400px - button disappears
- [ ] Click button - smoothly scrolls to top
- [ ] Button styling (gradient, shadow, position) matches original
- [ ] Hover effect works
- [ ] Run `npm run typecheck` - passes

---

### Step 3: Extract Hero Section (with internal state)

**Scope**:
- Create `DonateHeroSection.tsx` with internal state/effects
- Update `Donate.tsx`

**Actions**:
1. Create `/client/src/pages/donate/sections/DonateHeroSection.tsx`
2. **Move** `heroMounted` state (line 22)
3. **Move** mount animation effect (lines 32-37)
4. Copy hero section JSX (lines 240-356)
5. Define props: `{ scrollToQR: () => void, scrollToTransparency: () => void }`
6. In `Donate.tsx`:
   - **Remove** `heroMounted` state
   - **Remove** mount animation effect (lines 32-37)
   - Import `DonateHeroSection`
   - Replace lines 240-356 with component call, passing scroll handlers

**Code template**:
```tsx
// /client/src/pages/donate/sections/DonateHeroSection.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface DonateHeroSectionProps {
  scrollToQR: () => void;
  scrollToTransparency: () => void;
}

export function DonateHeroSection({
  scrollToQR,
  scrollToTransparency,
}: DonateHeroSectionProps) {
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      setHeroMounted(true);
    });
  }, []);

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a7e72 0%, #0d9488 30%, #f97316 100%)',
      }}
    >
      {/* EXACT copy of lines 248-355, using internal heroMounted state */}
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* ... exact copy ... */}
      </div>

      <div className="grain-overlay" />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-10">
        {/* Heart icon */}
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-md shadow-2xl border-2 border-white/30 transition-all duration-700 ease-out ${
            heroMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <Heart className="w-12 h-12 text-white" fill="white" />
        </div>

        {/* ... rest of hero content ... */}

        <div className="flex justify-center pt-4 transition-all duration-700 ease-out ${
          heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
          style={{ transitionDelay: '400ms' }}
        >
          <Button
            onClick={scrollToQR}
            size="lg"
            className="group relative min-h-[64px] px-12 text-xl font-bold shadow-2xl transition-all duration-500 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
              color: 'white',
              borderRadius: '16px',
            }}
          >
            {/* ... button content ... */}
          </Button>
        </div>

        {/* ... transparency link using scrollToTransparency prop ... */}
      </div>
    </section>
  );
}
```

**In Donate.tsx**:
```tsx
import { useRef } from "react";
import { DonateStyles } from "./donate/sections/DonateStyles";
import { DonateHeroSection } from "./donate/sections/DonateHeroSection";
import { DonateBackToTopButton } from "./donate/sections/DonateBackToTopButton";
// ... other section imports

export default function Donate() {
  const qrSectionRef = useRef<HTMLElement>(null);
  const transparencySectionRef = useRef<HTMLElement>(null);

  const scrollToQR = () => {
    qrSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTransparency = () => {
    transparencySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div style={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>
        <DonateStyles />

        <DonateHeroSection
          scrollToQR={scrollToQR}
          scrollToTransparency={scrollToTransparency}
        />

        {/* ... rest of sections ... */}
      </div>

      <DonateBackToTopButton />
    </>
  );
}
```

**Acceptance Criteria**:
- Hero section renders with gradient background
- Animations (fade-in, translate-y) play on page load
- "Support Reframe.me" button scrolls to payment section
- "How your support is used" link scrolls to transparency section
- All text, spacing, shadows identical
- Responsive behavior (text sizes, padding) unchanged

**Manual Verification Checklist**:
- [ ] Page loads - hero animates in smoothly
- [ ] Heart icon, title, subtitle, buttons visible
- [ ] "Support Reframe.me" button scrolls to QR section
- [ ] "How your support is used" link scrolls to transparency section
- [ ] Gradient background matches original
- [ ] Mobile view (< 768px): text sizes adjust correctly
- [ ] Desktop view (>= 768px): layout matches original
- [ ] Run `npm run typecheck` - passes

---

### Step 4: Extract Payment Section

**Scope**:
- Create `DonatePaymentSection.tsx` with `forwardRef`
- Update `Donate.tsx`

**Actions**:
1. Create `/client/src/pages/donate/sections/DonatePaymentSection.tsx`
2. Add imports: `forwardRef`, `Button`, `Card`, `CardContent`, `Heart`, `Lock`
3. Copy lines 360-573 (entire payment section JSX)
4. Use `forwardRef` pattern (no props, just ref)
5. Return the `<section>` element with `ref={ref}`
6. In `Donate.tsx`, import and replace lines 360-573 with:
   ```tsx
   <DonatePaymentSection ref={qrSectionRef} />
   ```

**Code template**:
```tsx
import { forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lock } from "lucide-react";

interface DonatePaymentSectionProps {}

export const DonatePaymentSection = forwardRef<HTMLElement, DonatePaymentSectionProps>(
  (props, ref) => {
    return (
      <section
        ref={ref}
        className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 scroll-mt-20 overflow-hidden dot-pattern dark:dot-pattern-dark"
      >
        {/* EXACT copy of lines 365-572 */}
      </section>
    );
  }
);

DonatePaymentSection.displayName = 'DonatePaymentSection';
```

**Acceptance Criteria**:
- Mobile (< 768px): Big buttons for Cash App / PayPal render
- Desktop (>= 768px): QR codes + links render
- Clicking "Support Reframe.me" button scrolls to this section
- Links open in new tabs (`target="_blank"`)
- QR code images load
- Safety notice renders with correct styling
- Ref attachment works (scrollIntoView behavior)

**Manual Verification Checklist**:
- [ ] Click hero "Support Reframe.me" button - scrolls smoothly to this section
- [ ] Mobile: Cash App and PayPal buttons visible, QR codes hidden
- [ ] Desktop: QR codes visible, buttons hidden
- [ ] Click Cash App link - opens in new tab
- [ ] Click PayPal link - opens in new tab
- [ ] QR codes render correctly
- [ ] Safety notice (orange box) displays
- [ ] All hover effects work
- [ ] Run `npm run typecheck` - passes

---

### Step 5: Extract Support Matters Section

**Scope**:
- Create `DonateSupportMattersSection.tsx`
- Update `Donate.tsx`

**Actions**:
1. Create `/client/src/pages/donate/sections/DonateSupportMattersSection.tsx`
2. Add imports: `Card`, `CardContent`, `Sparkles`, `Shield`, `MessageSquare`, `Users` icons
3. Copy lines 576-666 (entire section JSX)
4. No props needed (all data hardcoded in section)
5. Return the `<section>` element
6. In `Donate.tsx`, import and replace lines 576-666 with component call

**Code template**:
```tsx
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Shield, MessageSquare, Users } from "lucide-react";

export function DonateSupportMattersSection() {
  return (
    <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 dot-pattern dark:dot-pattern-dark">
      {/* EXACT copy of lines 578-665 */}
    </section>
  );
}
```

**Acceptance Criteria**:
- 4-card grid renders (2x2 on desktop, 1 column on mobile)
- Card hover effects (3D transform, shadow) work
- Icons display correctly
- "Whether you can donate or not..." callout renders
- Responsive layout unchanged

**Manual Verification Checklist**:
- [ ] Section renders with title
- [ ] 4 cards visible with correct icons
- [ ] Desktop: 2x2 grid layout
- [ ] Mobile: Single column stack
- [ ] Hover on cards: 3D lift effect + shadow
- [ ] Bottom callout box renders
- [ ] Run `npm run typecheck` - passes

---

### Step 6: Extract Transparency Section

**Scope**:
- Create `DonateTransparencySection.tsx` with `forwardRef`
- Update `Donate.tsx`

**Actions**:
1. Create `/client/src/pages/donate/sections/DonateTransparencySection.tsx`
2. Add imports: `forwardRef`
3. Copy lines 669-736 (entire section JSX)
4. Use `forwardRef` pattern (no props, just ref)
5. Return the `<section>` element with `ref={ref}`
6. In `Donate.tsx`, import and replace lines 669-736 with component call

**Code template**:
```tsx
import { forwardRef } from 'react';

interface DonateTransparencySectionProps {}

export const DonateTransparencySection = forwardRef<HTMLElement, DonateTransparencySectionProps>(
  (props, ref) => {
    return (
      <section
        ref={ref}
        className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 scroll-mt-20 overflow-hidden dot-pattern dark:dot-pattern-dark"
      >
        {/* EXACT copy of lines 674-735 */}
      </section>
    );
  }
);

DonateTransparencySection.displayName = 'DonateTransparencySection';
```

**Acceptance Criteria**:
- Clicking "How your support is used" link scrolls to this section
- 3 cards render (teal, orange, purple borders)
- Hover effects work
- Bottom callout box renders
- Ref attachment works

**Manual Verification Checklist**:
- [ ] Click hero link - scrolls to this section
- [ ] 3 cards visible with colored borders
- [ ] Hover effects work
- [ ] Bottom callout renders
- [ ] Run `npm run typecheck` - passes

---

### Step 7: Extract Testimonial Section

**Scope**:
- Create `DonateTestimonialSection.tsx`
- Update `Donate.tsx`

**Actions**:
1. Create `/client/src/pages/donate/sections/DonateTestimonialSection.tsx`
2. Copy lines 739-781 (entire section JSX)
3. No props needed
4. Return the `<section>` element
5. In `Donate.tsx`, import and replace lines 739-781

**Code template**:
```tsx
export function DonateTestimonialSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern dark:dot-pattern-dark">
      {/* EXACT copy of lines 741-780 */}
    </section>
  );
}
```

**Acceptance Criteria**:
- Title renders
- Quote card with decorative quotation marks renders
- Decorative blobs visible
- Responsive text sizes unchanged

**Manual Verification Checklist**:
- [ ] Section title visible
- [ ] Quote text renders
- [ ] Attribution line displays
- [ ] Decorative quotation marks visible
- [ ] Run `npm run typecheck` - passes

---

### Step 8: Extract Privacy Section

**Scope**:
- Create `DonatePrivacySection.tsx`
- Update `Donate.tsx`

**Actions**:
1. Create `/client/src/pages/donate/sections/DonatePrivacySection.tsx`
2. Add import: `Lock` icon
3. Copy lines 784-822 (entire section JSX)
4. No props needed
5. Return the `<section>` element
6. In `Donate.tsx`, import and replace lines 784-822

**Code template**:
```tsx
import { Lock } from "lucide-react";

export function DonatePrivacySection() {
  return (
    <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 dot-pattern dark:dot-pattern-dark">
      {/* EXACT copy of lines 786-821 */}
    </section>
  );
}
```

**Acceptance Criteria**:
- Lock icon renders
- Title renders
- 3 bullet points render
- Bottom callout box renders

**Manual Verification Checklist**:
- [ ] Lock icon visible
- [ ] Title with gradient text
- [ ] 3 bullet points with teal dots
- [ ] Bottom callout box
- [ ] Run `npm run typecheck` - passes

---

### Step 9: Extract FAQ Section (with internal state)

**Scope**:
- Create `DonateFaqSection.tsx` with internal state
- Update `Donate.tsx`

**Actions**:
1. Create `/client/src/pages/donate/sections/DonateFaqSection.tsx`
2. **Move** `openFaq` state (line 21)
3. **Move** `toggleFaq` handler (lines 51-53)
4. **Move** `faqItems` data (lines 55-66) - embed in component or import from local constants
5. Add import: `ChevronDown` icon
6. Copy lines 825-869 (entire section JSX)
7. In `Donate.tsx`:
   - **Remove** `openFaq` state
   - **Remove** `toggleFaq` handler
   - **Remove** `faqItems` data
   - Import `DonateFaqSection`
   - Replace lines 825-869 with component call (no props)

**Code template**:
```tsx
// /client/src/pages/donate/sections/DonateFaqSection.tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Do you sell or share my information?",
    answer:
      "No. Donations don't change how your data is handled. The goal is to keep this tool as safe and respectful as possible for people with records.",
  },
  {
    question: "Can organizations support this?",
    answer:
      "Yes. Re-entry programs, legal clinics, or employers who want to sponsor usage or collaborate can reach out for partnership options.",
  },
];

export function DonateFaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 dot-pattern dark:dot-pattern-dark">
      {/* EXACT copy of lines 827-868, using internal state */}
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-14 px-4">
          {/* ... title ... */}
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="faq-item rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-md"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-7 text-left hover:bg-gray-50 transition-colors group"
                aria-expanded={openFaq === index}
              >
                {/* ... button content ... */}
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                {/* ... answer content ... */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**In Donate.tsx**:
```tsx
import { useRef } from "react";
import { DonateStyles } from "./donate/sections/DonateStyles";
import { DonateHeroSection } from "./donate/sections/DonateHeroSection";
import { DonatePaymentSection } from "./donate/sections/DonatePaymentSection";
import { DonateSupportMattersSection } from "./donate/sections/DonateSupportMattersSection";
import { DonateTransparencySection } from "./donate/sections/DonateTransparencySection";
import { DonateTestimonialSection } from "./donate/sections/DonateTestimonialSection";
import { DonatePrivacySection } from "./donate/sections/DonatePrivacySection";
import { DonateFaqSection } from "./donate/sections/DonateFaqSection";
import { DonateBackToTopButton } from "./donate/sections/DonateBackToTopButton";
// ... other section imports

export default function Donate() {
  const qrSectionRef = useRef<HTMLElement>(null);
  const transparencySectionRef = useRef<HTMLElement>(null);

  const scrollToQR = () => {
    qrSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTransparency = () => {
    transparencySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div style={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>
        <DonateStyles />
        <DonateHeroSection
          scrollToQR={scrollToQR}
          scrollToTransparency={scrollToTransparency}
        />
        <DonatePaymentSection ref={qrSectionRef} />
        <DonateSupportMattersSection />
        <DonateTransparencySection ref={transparencySectionRef} />
        <DonateTestimonialSection />
        <DonatePrivacySection />
        <DonateFaqSection />
        {/* ... rest ... */}
      </div>

      <DonateBackToTopButton />
    </>
  );
}
```

**Acceptance Criteria**:
- 2 FAQ items render
- Clicking a question expands/collapses the answer
- Only one item can be open at a time
- Chevron icon rotates on expand
- Animations (max-height, opacity) work

**Manual Verification Checklist**:
- [ ] 2 FAQ items visible
- [ ] Click first question - expands answer
- [ ] Click second question - first closes, second opens
- [ ] Click open question - collapses
- [ ] Chevron rotates 180deg when open
- [ ] Expand/collapse animation smooth
- [ ] Run `npm run typecheck` - passes

---

### Step 10: Extract Other Ways Section

**Scope**:
- Create `DonateOtherWaysSection.tsx`
- Update `Donate.tsx`

**Actions**:
1. Create `/client/src/pages/donate/sections/DonateOtherWaysSection.tsx`
2. Add imports: `Card`, `CardContent`, `Share2`, `MessageSquare`, `Briefcase` icons
3. Copy lines 872-926 (entire section JSX)
4. No props needed
5. Return the `<section>` element
6. In `Donate.tsx`, import and replace lines 872-926

**Code template**:
```tsx
import { Card, CardContent } from "@/components/ui/card";
import { Share2, MessageSquare, Briefcase } from "lucide-react";

export function DonateOtherWaysSection() {
  return (
    <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern dark:dot-pattern-dark">
      {/* EXACT copy of lines 874-925 */}
    </section>
  );
}
```

**Acceptance Criteria**:
- Title renders
- 3 cards render with icons
- Card hover effects work
- Responsive grid (3 columns on desktop, 1 on mobile)

**Manual Verification Checklist**:
- [ ] Section title visible
- [ ] 3 cards with correct icons
- [ ] Desktop: 3-column grid
- [ ] Mobile: Single column stack
- [ ] Hover: 3D lift effect
- [ ] Run `npm run typecheck` - passes

---

### Step 11: Extract Closing CTA Section

**Scope**:
- Create `DonateClosingCtaSection.tsx`
- Update `Donate.tsx`

**Actions**:
1. Create `/client/src/pages/donate/sections/DonateClosingCtaSection.tsx`
2. Add imports: `Button`, `Heart` icon
3. Copy lines 929-956 (entire section JSX)
4. Define props: `{ scrollToQR: () => void }`
5. Return the `<section>` element
6. In `Donate.tsx`, import and replace lines 929-956

**Code template**:
```tsx
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface DonateClosingCtaSectionProps {
  scrollToQR: () => void;
}

export function DonateClosingCtaSection({ scrollToQR }: DonateClosingCtaSectionProps) {
  return (
    <section className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern dark:dot-pattern-dark">
      {/* EXACT copy of lines 931-955 */}
    </section>
  );
}
```

**Acceptance Criteria**:
- Closing quote text renders
- "Support Reframe.me" button scrolls to payment section
- Heart icon filled
- Button hover effects work

**Manual Verification Checklist**:
- [ ] Closing quote visible
- [ ] "Support Reframe.me" button renders
- [ ] Click button - scrolls to payment section
- [ ] Heart icon filled
- [ ] Hover effect works
- [ ] Run `npm run typecheck` - passes

---

### Step 12: Final Orchestrator Verification

**Scope**:
- Clean up `Donate.tsx` to final orchestrator state
- Verify all imports

**Actions**:
1. In `Donate.tsx`, verify all section components are imported
2. Verify only necessary imports remain (useRef from React, section components)
3. Remove any unused imports
4. Verify final structure matches target (~80-100 lines):
   ```tsx
   import { useRef } from "react";
   import { DonateStyles } from "./donate/sections/DonateStyles";
   import { DonateHeroSection } from "./donate/sections/DonateHeroSection";
   // ... other section imports

   export default function Donate() {
     const qrSectionRef = useRef<HTMLElement>(null);
     const transparencySectionRef = useRef<HTMLElement>(null);

     const scrollToQR = () => {
       qrSectionRef.current?.scrollIntoView({ behavior: "smooth" });
     };

     const scrollToTransparency = () => {
       transparencySectionRef.current?.scrollIntoView({ behavior: "smooth" });
     };

     return (
       <>
         <div style={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>
           <DonateStyles />
           <DonateHeroSection
             scrollToQR={scrollToQR}
             scrollToTransparency={scrollToTransparency}
           />
           <DonatePaymentSection ref={qrSectionRef} />
           <DonateSupportMattersSection />
           <DonateTransparencySection ref={transparencySectionRef} />
           <DonateTestimonialSection />
           <DonatePrivacySection />
           <DonateFaqSection />
           <DonateOtherWaysSection />
           <DonateClosingCtaSection scrollToQR={scrollToQR} />
         </div>

         <DonateBackToTopButton />
       </>
     );
   }
   ```

**Acceptance Criteria**:
- `Donate.tsx` is ~80-100 lines
- All section components properly imported
- No unused imports
- No TypeScript errors
- No console errors

**Manual Verification Checklist**:
- [ ] Run `npm run typecheck` - no errors
- [ ] Run `npm run dev` - no console errors
- [ ] Load `/donate` page - renders correctly
- [ ] No visual differences from original

---

### Step 13: Comprehensive Visual Regression Test

**Scope**:
- Full end-to-end verification of all behaviors

**Test Matrix**:

| Test | Original | Refactored | Pass/Fail |
|------|----------|------------|-----------|
| Hero animation on load | | | |
| "Support Reframe.me" button → QR section | | | |
| "How your support is used" → Transparency | | | |
| Mobile payment buttons visible (< 768px) | | | |
| Desktop QR codes visible (>= 768px) | | | |
| Cash App link opens in new tab | | | |
| PayPal link opens in new tab | | | |
| All card hover effects work | | | |
| FAQ expand/collapse | | | |
| FAQ chevron rotation | | | |
| Back to top button appears at 400px | | | |
| Back to top button scrolls to top | | | |
| All text content identical | | | |
| All spacing identical | | | |
| All colors identical | | | |
| Section stagger animations work | | | |

**Acceptance Criteria**:
- All tests pass
- Zero visual differences
- Zero behavioral differences

**Manual Verification Checklist**:
- [ ] Complete test matrix above
- [ ] Take screenshots at 375px, 768px, 1440px widths
- [ ] Compare screenshots (pixel-identical)
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test scroll performance

---

### Step 14: Build Verification

**Scope**:
- Verify production build works

**Actions**:
1. Run `npm run build`
2. Verify build succeeds
3. Preview production build locally
4. Test donate page in production mode

**Acceptance Criteria**:
- Build completes without errors
- No runtime errors in production mode
- Page loads and functions identically

**Manual Verification Checklist**:
- [ ] Run `npm run build` - succeeds
- [ ] No build warnings
- [ ] Preview build locally
- [ ] Test all interactions in production build
- [ ] Performance unchanged

---

### Step 15: Documentation & Commit

**Scope**:
- Update CLAUDE.md
- Create commit

**Actions**:
1. Update `/CLAUDE.md`:
   - Mark Donate page as "modular ✅" in project structure
   - Add note about Phase 1 completion
   - Update folder structure to show `donate/sections/` and `donate/data/`
2. Create git commit:
   ```bash
   git add client/src/pages/Donate.tsx client/src/pages/donate/
   git commit -m "refactor(donate): extract orchestrator pattern (Phase 1 - Parity)

   - Extract style block to DonateStyles component
   - Extract 10 section components from 977-line Donate.tsx
   - Move component-owned state down (heroMounted, openFaq, showBackToTop)
   - Keep cross-section refs/handlers in orchestrator
   - Reduce orchestrator to ~80-100 lines
   - Maintain 100% visual and behavioral parity
   - Zero changes to DOM structure, classes, or styles
   - All animations, refs, and interactions preserved

   Phase 1 (Parity) complete. Phase 2 (data extraction, cleanup) deferred.
   "
   ```

**Acceptance Criteria**:
- CLAUDE.md updated
- Clean commit with descriptive message
- All new files included

**Manual Verification Checklist**:
- [ ] CLAUDE.md shows Donate page as modular
- [ ] Git status shows only expected files changed
- [ ] Commit message clear and descriptive

---

## Out of Scope for Phase 1

The following improvements are **explicitly deferred** to future phases:

### Phase 2 (Data Extraction & Constants)
- Move `faqItems` to separate constants file (currently embedded in DonateFaqSection)
- Extract hardcoded support cards data
- Extract payment platform URLs to constants
- Create types file for FAQ, support cards, transparency items

### Phase 3 (Style Consolidation)
- Merge DonateStyles CSS with global styles or CSS module
- Consolidate duplicate gradient definitions
- Create shared animation keyframes file
- Deduplicate card styling patterns

### Phase 4 (Performance Optimization)
- Add `React.memo` to section components
- Implement `lazy` loading for below-fold sections
- Add intersection observer for animation triggers
- Optimize image loading (QR codes)

### Phase 5 (Accessibility & Polish)
- Add keyboard navigation for FAQ
- Improve screen reader announcements
- Add focus management for scroll actions
- Audit color contrast

---

## Success Metrics

Phase 1 is considered successful when:

1. ✅ `Donate.tsx` reduced from 977 lines to ~80-100 lines
2. ✅ Style block extracted to `DonateStyles` component
3. ✅ 10 section components extracted to `/donate/sections/`
4. ✅ Component-owned state moved down (heroMounted, openFaq, showBackToTop)
5. ✅ Cross-section dependencies remain in orchestrator (refs, scroll handlers)
6. ✅ Zero visual differences (pixel-perfect parity)
7. ✅ Zero behavioral differences (all interactions work)
8. ✅ Zero console errors or warnings
9. ✅ TypeScript compilation succeeds
10. ✅ Production build succeeds
11. ✅ All manual verification checklists completed

---

## Rollback Plan

If any step causes a regression:

1. **Revert the specific commit**: `git revert <commit-hash>`
2. **Identify the issue**: Compare DOM structure, classes, and styles
3. **Fix in isolation**: Create a branch to fix the specific section
4. **Re-test**: Complete manual verification checklist again
5. **Re-apply**: Cherry-pick the fixed commit

Each step is designed to be **independently reversible** without affecting other steps.

---

## End of Plan

This plan provides a **conservative, incremental, regression-proof** path to refactoring the Donate page with proper component encapsulation while maintaining 100% visual parity.

**Component ownership model**: State/effects live in the component that owns the behavior. Cross-section dependencies (refs, scroll handlers that target other sections) remain in the orchestrator.

**Next Action**: Execute Step 0 (folder setup).
