# FAQ Page Orchestrator Refactor Plan (Phase 1: Parity-First)

**Status**: Planning
**Target File**: `/client/src/pages/Faq.tsx`
**Current Size**: 479 lines
**Target Size**: ~80–100 lines (orchestrator only)
**Primary Success Criterion**: 100% visual and behavioral parity (DOM-identical, pixel-perfect, animation-identical)

---

## 1. Goal & Success Criteria

### Primary Goal
Extract orchestrator pattern from 479-line `Faq.tsx` with **100% visual and behavioral parity**.

### Success Criteria
- ✅ DOM structure remains byte-for-byte identical (no new wrappers, no reordering)
- ✅ All classNames preserved verbatim (no refactoring, no cleanup)
- ✅ All inline styles and style objects unchanged
- ✅ All animation timing and nth-child selectors work identically
- ✅ FAQ open/close behavior identical (single-open accordion)
- ✅ Scroll-to-top on mount works identically
- ✅ All aria attributes and data-testid values preserved
- ✅ Visual regression test passes at 375px, 768px, 1440px breakpoints
- ✅ Animation sequence plays identically (0.05s stagger per card)

---

## 2. Current Page Inventory

### Top-Level Structure (Render Order)
```tsx
<>
  <style>{`...`}</style>              // Lines 244-271: Inline CSS with nth-child delays
  <section>                            // Lines 273-475: Main container
    {/* Decorative elements */}        // Lines 277-282: Corner accents
    <div className="max-w-4xl">       // Line 284: Content wrapper
      {/* Hero section */}             // Lines 286-303
      {/* Important notice */}         // Lines 306-331
      {/* FAQs - card list */}         // Lines 334-425
      {/* Bottom disclaimer */}        // Lines 428-432
      {/* CTA section */}              // Lines 435-473
    </div>
  </section>
</>
```

### State & Effects
| Name | Type | Line | Scope | Purpose |
|------|------|------|-------|---------|
| `openItem` | `string` | 236 | FAQ list only | Controls which FAQ is expanded |
| `useEffect` | Effect | 238-240 | Page-level | Scrolls to top on mount |

### Handlers
| Name | Line | Scope | Purpose |
|------|------|-------|---------|
| `setOpenItem` inline | 352 | FAQ list | Toggles FAQ open/closed (single-open behavior) |

### Data Dependencies
| Name | Type | Lines | Content |
|------|------|-------|---------|
| `faqs` | Array | 12-233 | 11 FAQ objects with `id`, `question`, `icon`, `category`, `answer` (JSX) |

### Section Boundaries (Safe Extraction Points)

1. **Style Block** (lines 244-271)
   - Inline `<style>` tag
   - Contains `.faq-question`, `.faq-card`, `.faq-card:nth-child(1-10)`, `.category-badge`
   - **Risk**: nth-child selectors depend on exact `.faq-card` position in parent

2. **Hero Section** (lines 286-303)
   - Knowledge Base badge
   - Heading with gradient
   - Description paragraph
   - **Dependencies**: None
   - **Safe to extract**: Yes

3. **Important Disclaimer Notice** (lines 306-331)
   - Orange gradient background box
   - AlertCircle icon decorative overlay
   - Two paragraphs of disclaimer text
   - **Dependencies**: None
   - **Safe to extract**: Yes

4. **FAQ List** (lines 334-425)
   - `<div className="space-y-4 mb-16">` parent container
   - Maps over `faqs` array
   - Each item is a `<div className="faq-card">` (lines 340-422)
   - Uses `openItem` state and `setOpenItem` handler
   - **Risk**: `.faq-card` is the direct child of parent; nth-child(N) counts these
   - **Dependencies**: `faqs` data, `openItem` state
   - **Safe to extract**: Yes, if we preserve exact parent-child hierarchy

5. **Bottom Disclaimer** (lines 428-432)
   - Gray box with legal reminder text
   - **Dependencies**: None
   - **Safe to extract**: Yes

6. **CTA Section** (lines 435-473)
   - Teal gradient box
   - "Ready to Get Started?" heading
   - Link to `/selection`
   - Button with orange gradient
   - **Dependencies**: None
   - **Safe to extract**: Yes

---

## 3. CSS/Parity Risk Register

### Critical Risk: nth-child Animation Delays

**Location**: Lines 256-265

```css
.faq-card:nth-child(1) { animation-delay: 0.05s; }
.faq-card:nth-child(2) { animation-delay: 0.1s; }
.faq-card:nth-child(3) { animation-delay: 0.15s; }
.faq-card:nth-child(4) { animation-delay: 0.2s; }
.faq-card:nth-child(5) { animation-delay: 0.25s; }
.faq-card:nth-child(6) { animation-delay: 0.3s; }
.faq-card:nth-child(7) { animation-delay: 0.35s; }
.faq-card:nth-child(8) { animation-delay: 0.4s; }
.faq-card:nth-child(9) { animation-delay: 0.45s; }
.faq-card:nth-child(10) { animation-delay: 0.5s; }
```

**Dependency**: These selectors target `.faq-card` elements that are **direct children** of the parent container `<div className="space-y-4 mb-16">` (line 334).

**Risk Mitigation**:
- ✅ DO NOT introduce wrapper elements inside the FAQ list parent
- ✅ DO NOT reorder FAQ items
- ✅ DO NOT change the className from `faq-card` to anything else
- ✅ The extracted `FaqList` component MUST render the parent `<div className="space-y-4 mb-16">` with the same structure
- ✅ Each FAQ item MUST remain a direct child `<div className="faq-card">`

### Other Style Dependencies

| Class/Selector | Location | Risk Level | Notes |
|----------------|----------|------------|-------|
| `.faq-question` | Line 246-249 | Low | Font styling only, no layout impact |
| `.faq-card` | Line 251-254 | **HIGH** | Animation target + nth-child parent |
| `.category-badge` | Line 267-270 | Low | Backdrop filter, cosmetic only |

### Style Cascade Dependencies
- The `<style>` tag appears **before** the main section (line 244)
- This ensures styles are loaded before DOM elements render
- **Risk**: Moving the style tag to a different position could cause FOUC
- **Mitigation**: Extract to `FaqStyles` component, render at the **same position** (before section)

---

## 4. Target Architecture (Phase 1)

### File Structure
```
client/src/pages/
  Faq.tsx                           # Orchestrator (~80-100 lines)
  faq/
    sections/
      FaqStyles.tsx                 # Style tag extraction
      FaqHeroSection.tsx            # Hero section
      FaqImportantDisclaimer.tsx    # Important notice
      FaqList.tsx                   # FAQ accordion (owns openItem state)
      FaqBottomDisclaimer.tsx       # Bottom legal reminder
      FaqCtaSection.tsx             # CTA section
    data/
      faq.constants.tsx             # faqs array (TSX for JSX answers)
```

### Component Ownership Model

#### Orchestrator (Faq.tsx)
**Responsibilities**:
- Page-level container (`<section>`)
- Decorative corner accents
- Max-width content wrapper
- Scroll-to-top effect
- Section composition (imports + renders sections in order)

**Retains**:
- `useEffect(() => window.scrollTo(0, 0), [])`

**Does NOT retain**:
- `openItem` state (moves to `FaqList`)
- `faqs` data (moves to `faq.constants.tsx`)
- Inline `<style>` tag (moves to `FaqStyles`)

**Renders (in order)**:
```tsx
<>
  <FaqStyles />
  <section className="...">
    {/* Decorative accents */}
    <div className="max-w-4xl mx-auto relative z-10">
      <FaqHeroSection />
      <FaqImportantDisclaimer />
      <FaqList />
      <FaqBottomDisclaimer />
      <FaqCtaSection />
    </div>
  </section>
</>
```

#### FaqStyles Component
**File**: `/client/src/pages/faq/sections/FaqStyles.tsx`
**Responsibilities**: Render inline `<style>` tag with page-specific CSS
**State**: None
**Props**: None
**Returns**: `<style>{`...`}</style>` (exact copy from lines 244-271)

#### FaqHeroSection Component
**File**: `/client/src/pages/faq/sections/FaqHeroSection.tsx`
**Responsibilities**: Render hero section with badge, heading, description
**State**: None
**Props**: None
**Renders**: Lines 286-303 (exact copy)

#### FaqImportantDisclaimer Component
**File**: `/client/src/pages/faq/sections/FaqImportantDisclaimer.tsx`
**Responsibilities**: Render orange disclaimer notice box
**State**: None
**Props**: None
**Renders**: Lines 306-331 (exact copy)

#### FaqList Component
**File**: `/client/src/pages/faq/sections/FaqList.tsx`
**Responsibilities**: Render FAQ accordion list with open/close behavior
**State**: `openItem: string` (moved from page)
**Props**: None (imports `faqs` from data file)
**Renders**: Lines 334-425 (exact copy)
**Critical**: Preserves parent `<div className="space-y-4 mb-16">` and child `.faq-card` hierarchy

#### FaqBottomDisclaimer Component
**File**: `/client/src/pages/faq/sections/FaqBottomDisclaimer.tsx`
**Responsibilities**: Render bottom legal reminder box
**State**: None
**Props**: None
**Renders**: Lines 428-432 (exact copy)

#### FaqCtaSection Component
**File**: `/client/src/pages/faq/sections/FaqCtaSection.tsx`
**Responsibilities**: Render CTA section with button to /selection
**State**: None
**Props**: None
**Renders**: Lines 435-473 (exact copy)

#### Data File (faq.constants.tsx)
**File**: `/client/src/pages/faq/data/faq.constants.tsx`
**Purpose**: Export `faqs` array
**Format**: TSX (required for JSX in `answer` fields)
**Exports**: `export const faqs = [...]` (lines 12-233, exact copy)

---

## 5. Step-by-Step Execution Plan

### Step 0: Folder Setup
**Scope**: Create directory structure only (no code changes)

**Actions**:
```bash
mkdir -p client/src/pages/faq/sections
mkdir -p client/src/pages/faq/data
```

**Acceptance Criteria**:
- ✅ Folders exist
- ✅ No files created yet
- ✅ Application still runs (no changes to source)

**Verification**:
```bash
ls -la client/src/pages/faq/sections
ls -la client/src/pages/faq/data
npm run dev  # Should start without errors
```

---

### Step 1: Extract FaqStyles Component
**Scope**: Move inline `<style>` tag to dedicated component

**File Created**: `/client/src/pages/faq/sections/FaqStyles.tsx`

**Content** (exact copy of lines 244-271):
```tsx
export function FaqStyles() {
  return (
    <style>{`
      /* Page-specific FAQ styles */
      .faq-question {
        font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        letter-spacing: -0.02em;
      }

      .faq-card {
        animation: float-in 0.6s ease-out;
        animation-fill-mode: backwards;
      }

      .faq-card:nth-child(1) { animation-delay: 0.05s; }
      .faq-card:nth-child(2) { animation-delay: 0.1s; }
      .faq-card:nth-child(3) { animation-delay: 0.15s; }
      .faq-card:nth-child(4) { animation-delay: 0.2s; }
      .faq-card:nth-child(5) { animation-delay: 0.25s; }
      .faq-card:nth-child(6) { animation-delay: 0.3s; }
      .faq-card:nth-child(7) { animation-delay: 0.35s; }
      .faq-card:nth-child(8) { animation-delay: 0.4s; }
      .faq-card:nth-child(9) { animation-delay: 0.45s; }
      .faq-card:nth-child(10) { animation-delay: 0.5s; }

      .category-badge {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
    `}</style>
  );
}
```

**File Modified**: `/client/src/pages/Faq.tsx`

**Changes**:
1. Add import at top:
   ```tsx
   import { FaqStyles } from "./faq/sections/FaqStyles";
   ```

2. Replace lines 244-271 with:
   ```tsx
   <FaqStyles />
   ```

**Acceptance Criteria**:
- ✅ `FaqStyles.tsx` created with exact CSS copy
- ✅ Component imported and rendered in `Faq.tsx`
- ✅ Inline `<style>` tag removed from `Faq.tsx`
- ✅ CSS still applies (no visual changes)
- ✅ nth-child animations still work

**Verification**:
1. Start dev server: `npm run dev`
2. Navigate to `/faq`
3. Check animation sequence plays correctly (cards animate in with 0.05s stagger)
4. Inspect DOM: `<style>` tag appears in same position
5. Test all breakpoints (375px, 768px, 1440px)

---

### Step 2: Extract Data to faq.constants.tsx
**Scope**: Move `faqs` array out of page component

**File Created**: `/client/src/pages/faq/data/faq.constants.tsx`

**Content** (exact copy of lines 1-3 imports + lines 12-233):
```tsx
import { MessageSquare, FileText, Scale, Shield, Lightbulb, Users, AlertCircle, BookOpen, RefreshCw } from "lucide-react";

export const faqs = [
  {
    id: "why-different-versions",
    question: "Why might I want different ways to talk about my record?",
    icon: MessageSquare,
    category: "Your Story",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          Different situations often call for different versions of your story. A quick form might only need a sentence, while a longer interview might give you space to share more context. The job, the person you're talking to, and what feels safe for you can all shape how much detail makes sense.
        </p>
        {/* ... rest of answer ... */}
      </div>
    ),
  },
  // ... rest of faqs array (exact copy) ...
];
```

**File Modified**: `/client/src/pages/Faq.tsx`

**Changes**:
1. Add import at top:
   ```tsx
   import { faqs } from "./faq/data/faq.constants";
   ```

2. Remove lines 12-233 (entire `faqs` array declaration)

3. Remove icon imports that are no longer used in `Faq.tsx`:
   ```tsx
   // REMOVE: MessageSquare, FileText, Scale, Shield, Lightbulb, Users, BookOpen, RefreshCw
   // KEEP: ArrowRight, AlertCircle (used in sections)
   ```

**Acceptance Criteria**:
- ✅ `faq.constants.tsx` created with exact faqs array
- ✅ Imported in `Faq.tsx`
- ✅ Original `faqs` declaration removed
- ✅ No TypeScript errors
- ✅ FAQs render identically

**Verification**:
1. `npm run dev`
2. Navigate to `/faq`
3. Verify all 11 FAQs render
4. Click each FAQ to verify open/close works
5. Check that icons, categories, and answers display correctly

---

### Step 3: Extract FaqHeroSection Component
**Scope**: Move hero section to dedicated component

**File Created**: `/client/src/pages/faq/sections/FaqHeroSection.tsx`

**Content** (exact copy of lines 286-303):
```tsx
import { BookOpen } from "lucide-react";

export function FaqHeroSection() {
  return (
    <div className="text-center space-y-6 mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100">
        <BookOpen className="w-4 h-4 text-teal-600" />
        <span className="text-sm font-medium text-teal-700 tracking-wide">Knowledge Base</span>
      </div>

      <h1
        id="faq-heading"
        className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-br from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent pb-2"
        style={{ fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.03em' }}
      >
        Everything You Need to Know
      </h1>

      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Clear answers about background checks, disclosure, and your rights during the hiring process.
      </p>
    </div>
  );
}
```

**File Modified**: `/client/src/pages/Faq.tsx`

**Changes**:
1. Add import:
   ```tsx
   import { FaqHeroSection } from "./faq/sections/FaqHeroSection";
   ```

2. Replace lines 286-303 with:
   ```tsx
   <FaqHeroSection />
   ```

**Acceptance Criteria**:
- ✅ Component created with exact hero markup
- ✅ Imported and rendered in same position
- ✅ Visual output identical
- ✅ Heading gradient renders correctly
- ✅ Badge displays correctly

**Verification**:
1. Visual check: hero section looks identical
2. Inspect DOM: classNames and structure unchanged
3. Test responsive: 375px, 768px, 1440px
4. Check gradient rendering on heading

---

### Step 4: Extract FaqImportantDisclaimer Component
**Scope**: Move important disclaimer notice to dedicated component

**File Created**: `/client/src/pages/faq/sections/FaqImportantDisclaimer.tsx`

**Content** (exact copy of lines 306-331):
```tsx
import { AlertCircle } from "lucide-react";

export function FaqImportantDisclaimer() {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 mb-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(249, 115, 22, 0.12) 100%)',
        border: '2px solid rgba(249, 115, 22, 0.2)'
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <AlertCircle className="w-full h-full text-orange-500" />
      </div>

      <div className="relative space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-orange-900">Important Disclaimer</h3>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          Reframe.me is not a law firm and does not provide legal advice. The information here is for educational purposes only. We cannot guarantee hiring outcomes—every situation is unique, and employment laws vary by location and industry.
        </p>

        <p className="text-sm text-gray-700 leading-relaxed">
          When possible, consult with a qualified attorney or legal aid organization about your specific circumstances.
        </p>
      </div>
    </div>
  );
}
```

**File Modified**: `/client/src/pages/Faq.tsx`

**Changes**:
1. Add import:
   ```tsx
   import { FaqImportantDisclaimer } from "./faq/sections/FaqImportantDisclaimer";
   ```

2. Replace lines 306-331 with:
   ```tsx
   <FaqImportantDisclaimer />
   ```

**Acceptance Criteria**:
- ✅ Component created with exact disclaimer markup
- ✅ Imported and rendered in same position
- ✅ Orange gradient background renders identically
- ✅ AlertCircle decorative overlay positioned correctly
- ✅ Text content unchanged

**Verification**:
1. Visual check: orange box looks identical
2. Check gradient and border rendering
3. Verify decorative icon in top-right corner
4. Test responsive layout

---

### Step 5: Extract FaqList Component (with openItem state)
**Scope**: Move FAQ accordion list to dedicated component, including state ownership

**File Created**: `/client/src/pages/faq/sections/FaqList.tsx`

**Content** (exact copy of lines 334-425 + state from line 236):
```tsx
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { faqs } from "../data/faq.constants";

export function FaqList() {
  const [openItem, setOpenItem] = useState<string>("");

  return (
    <div className="space-y-4 mb-16">
      {faqs.map((faq, index) => {
        const Icon = faq.icon;
        const isOpen = openItem === faq.id;

        return (
          <div
            key={faq.id}
            className="faq-card group"
            data-testid={`faq-item-${faq.id}`}
          >
            <div
              className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-teal-200"
              style={{
                boxShadow: isOpen ? '0 10px 40px rgba(20, 184, 166, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <button
                onClick={() => setOpenItem(isOpen ? "" : faq.id)}
                className="w-full text-left p-6 md:p-8 transition-colors duration-200"
                data-testid={`faq-trigger-${faq.id}`}
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isOpen
                        ? 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)'
                        : 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)'
                    }}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isOpen ? 'text-white' : 'text-teal-600'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className="faq-question text-lg md:text-xl font-semibold text-gray-900 leading-tight pr-4"
                      >
                        {faq.question}
                      </h3>

                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen ? 'bg-teal-100 rotate-180' : 'bg-gray-100'
                        }`}
                      >
                        <ArrowRight
                          className={`w-4 h-4 transition-colors duration-300 ${
                            isOpen ? 'text-teal-700 rotate-90' : 'text-gray-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="category-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100/80 border border-gray-200/50">
                      <span className="text-xs font-medium text-gray-600">{faq.category}</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Answer - accordion content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div
                  className="px-6 md:px-8 pb-6 md:pb-8 pt-2"
                  style={{
                    background: 'linear-gradient(180deg, rgba(240, 253, 250, 0.3) 0%, transparent 100%)'
                  }}
                  data-testid={`faq-content-${faq.id}`}
                >
                  <div className="pl-16 prose prose-sm max-w-none">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

**File Modified**: `/client/src/pages/Faq.tsx`

**Changes**:
1. Add import:
   ```tsx
   import { FaqList } from "./faq/sections/FaqList";
   ```

2. Remove `openItem` state (line 236)

3. Remove `faqs.map(...)` section (lines 334-425) and replace with:
   ```tsx
   <FaqList />
   ```

**Acceptance Criteria**:
- ✅ `FaqList.tsx` created with exact FAQ list markup
- ✅ `openItem` state moved into component
- ✅ Imported and rendered in same position
- ✅ Parent `<div className="space-y-4 mb-16">` preserved
- ✅ Each child still has `className="faq-card"` (critical for nth-child)
- ✅ Open/close behavior identical (single-open accordion)
- ✅ Animation stagger still works (nth-child delays)

**Verification** (CRITICAL):
1. Start dev server
2. Navigate to `/faq`
3. **Animation Test**: Watch cards animate in with 0.05s stagger (should see sequential wave effect)
4. **Interaction Test**: Click each FAQ to open
5. **Single-Open Test**: Opening one FAQ should close the previously open one
6. **Inspect DOM**: `.faq-card` elements are direct children of `.space-y-4` parent
7. **nth-child Test**: Check computed styles on each `.faq-card` - should have correct animation-delay
8. Test at all breakpoints

---

### Step 6: Extract FaqBottomDisclaimer Component
**Scope**: Move bottom legal reminder to dedicated component

**File Created**: `/client/src/pages/faq/sections/FaqBottomDisclaimer.tsx`

**Content** (exact copy of lines 428-432):
```tsx
export function FaqBottomDisclaimer() {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 md:p-6 mb-12">
      <p className="text-xs text-gray-600 leading-relaxed text-center">
        <span className="font-semibold">Legal Reminder:</span> Nothing on this site constitutes legal advice. We are not responsible for hiring decisions. Results vary, and we make no guarantees. If you have legal questions, seek help from a qualified attorney.
      </p>
    </div>
  );
}
```

**File Modified**: `/client/src/pages/Faq.tsx`

**Changes**:
1. Add import:
   ```tsx
   import { FaqBottomDisclaimer } from "./faq/sections/FaqBottomDisclaimer";
   ```

2. Replace lines 428-432 with:
   ```tsx
   <FaqBottomDisclaimer />
   ```

**Acceptance Criteria**:
- ✅ Component created with exact disclaimer markup
- ✅ Imported and rendered in same position
- ✅ Visual output identical

**Verification**:
1. Visual check: gray box looks identical
2. Text content unchanged
3. Spacing before/after preserved

---

### Step 7: Extract FaqCtaSection Component
**Scope**: Move CTA section to dedicated component

**File Created**: `/client/src/pages/faq/sections/FaqCtaSection.tsx`

**Content** (exact copy of lines 435-473):
```tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FaqCtaSection() {
  return (
    <div
      className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0891b2 100%)',
        boxShadow: '0 20px 60px rgba(20, 184, 166, 0.3)'
      }}
    >
      <div className="absolute inset-0 gradient-shimmer opacity-30" />

      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
            Ready to Get Started?
          </h2>
          <p className="text-teal-50 text-lg max-w-2xl mx-auto">
            Create your personalized narratives and response letters in minutes. Free, private, and designed for your success.
          </p>
        </div>

        <Link href="/selection">
          <Button
            size="lg"
            className="group min-h-[56px] mt-5 px-10 text-lg font-semibold shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
              color: 'white'
            }}
            data-testid="button-get-started-faq"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Button>
        </Link>

        <p className="text-sm text-teal-100 font-medium">
          No account required • Completely free • Takes 10-15 minutes
        </p>
      </div>
    </div>
  );
}
```

**File Modified**: `/client/src/pages/Faq.tsx`

**Changes**:
1. Add import:
   ```tsx
   import { FaqCtaSection } from "./faq/sections/FaqCtaSection";
   ```

2. Replace lines 435-473 with:
   ```tsx
   <FaqCtaSection />
   ```

**Acceptance Criteria**:
- ✅ Component created with exact CTA markup
- ✅ Imported and rendered in same position
- ✅ Gradient background renders identically
- ✅ Button navigation to `/selection` works
- ✅ Hover effects work correctly

**Verification**:
1. Visual check: teal gradient box looks identical
2. Button hover effect works
3. Click button → navigates to `/selection`
4. Check gradient-shimmer animation

---

### Step 8: Final Orchestrator Cleanup
**Scope**: Review final orchestrator state and clean up unused imports

**File**: `/client/src/pages/Faq.tsx`

**Expected Final State** (~80-100 lines):
```tsx
import { useEffect } from "react";
import { FaqStyles } from "./faq/sections/FaqStyles";
import { FaqHeroSection } from "./faq/sections/FaqHeroSection";
import { FaqImportantDisclaimer } from "./faq/sections/FaqImportantDisclaimer";
import { FaqList } from "./faq/sections/FaqList";
import { FaqBottomDisclaimer } from "./faq/sections/FaqBottomDisclaimer";
import { FaqCtaSection } from "./faq/sections/FaqCtaSection";

export default function Faq() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <FaqStyles />

      <section
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="faq-heading"
      >
        {/* Paper texture overlay */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Subtle decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <FaqHeroSection />
          <FaqImportantDisclaimer />
          <FaqList />
          <FaqBottomDisclaimer />
          <FaqCtaSection />
        </div>
      </section>
    </>
  );
}
```

**Changes**:
1. Remove all unused imports:
   - `Link`, `Button` (moved to `FaqCtaSection`)
   - `ArrowRight`, `BookOpen`, `AlertCircle` icons (moved to section components)
   - `useState` (moved to `FaqList`)
   - `Accordion` components (not actually used in original file)
   - `faqs` data (moved to data file)

2. Keep only:
   - `useEffect` from `react`
   - Section component imports

**Acceptance Criteria**:
- ✅ Orchestrator is ~80-100 lines
- ✅ No unused imports
- ✅ Only contains: imports, scroll effect, section composition
- ✅ All functionality works identically
- ✅ No TypeScript errors
- ✅ No lint warnings

**Verification**:
1. Run TypeScript: `npm run typecheck`
2. Run build: `npm run build`
3. Visual regression test at all breakpoints
4. Full interaction test (open/close all FAQs)
5. Animation test (watch stagger on page load)
6. Navigation test (CTA button → /selection)

---

## 6. Out of Scope (Phase 1)

The following changes are **explicitly forbidden** in Phase 1:

### DOM/Markup Changes
- ❌ Adding/removing wrapper elements
- ❌ Changing element nesting or hierarchy
- ❌ Reordering sections or FAQ items
- ❌ Changing any className strings
- ❌ Modifying inline styles or style objects
- ❌ Altering text content (including whitespace/punctuation)
- ❌ Adding/removing/modifying aria attributes or data-testid values

### Component/Code Changes
- ❌ Introducing React.memo, lazy, or Suspense
- ❌ Adding conditional rendering or feature flags
- ❌ Changing animation timing, keyframes, or transitions
- ❌ Refactoring CSS or extracting to separate .css files
- ❌ Creating shared components or abstractions
- ❌ Adding PropTypes, Zod schemas, or runtime validation
- ❌ Adding comments, docstrings, or JSDoc

### Data/Type Changes
- ❌ Renaming FAQ object properties
- ❌ Extracting FAQ categories to constants
- ❌ Creating TypeScript interfaces for FAQ shape
- ❌ Deduplicating repeated disclaimer text
- ❌ Converting JSX answers to string templates or markdown

### Behavior Changes
- ❌ Changing open/close logic (must remain single-open)
- ❌ Adding multi-select accordion mode
- ❌ Adding URL hash navigation for FAQs
- ❌ Adding keyboard shortcuts or focus management improvements
- ❌ Modifying scroll-to-top behavior

---

## 7. Phase 2 Scope (Future Work)

After Phase 1 is complete and verified, Phase 2 will address:

### Data Cleanup & Organization
- Extract repeated disclaimer text to constants
- Create TypeScript interfaces for FAQ shape (`FaqItem` type)
- Extract category labels to constants with type-safe enum
- Consider converting JSX answers to markdown + renderer (if beneficial)

### Component Improvements
- Add PropTypes or TypeScript interfaces for all section components
- Extract icon-to-component mapping logic
- Create shared `DisclaimerBox` component for repeated patterns
- Consider extracting category badge to reusable component

### Accessibility & UX Enhancements
- Add keyboard navigation (arrow keys to move between FAQs)
- Add URL hash support (e.g., `/faq#privacy-data` opens that FAQ)
- Add focus management (opening FAQ focuses content for screen readers)
- Consider adding "Expand All / Collapse All" button

### CSS Refactoring
- Extract inline styles to CSS modules or Tailwind config
- Consolidate gradient definitions to design tokens
- Consider replacing nth-child animation delays with JS-based stagger
- Extract font-family declarations to design system

### Performance Optimizations
- Add React.memo to section components if re-render issues detected
- Consider lazy-loading FAQ answers (unlikely to be needed)
- Add Intersection Observer for animation trigger instead of immediate mount

### Testing
- Add unit tests for FAQ open/close logic
- Add visual regression tests (Playwright/Chromatic)
- Add accessibility tests (axe-core)

---

## 8. Visual Regression Checklist

Before marking Phase 1 complete, verify the following at **each breakpoint** (375px, 768px, 1440px):

### Page Load & Animations
- ✅ Page scrolls to top on mount
- ✅ FAQ cards animate in sequentially with 0.05s stagger
- ✅ Animation starts from top card and cascades down
- ✅ All 11 cards animate (check nth-child(10) has 0.5s delay)

### Layout & Spacing
- ✅ Hero section centered with correct margins
- ✅ Important disclaimer box has orange gradient border
- ✅ FAQ cards have correct vertical spacing (space-y-4)
- ✅ Bottom disclaimer has correct margins
- ✅ CTA section has teal gradient background

### Interaction & State
- ✅ Clicking closed FAQ opens it
- ✅ Clicking open FAQ closes it
- ✅ Opening FAQ #2 closes FAQ #1 (single-open behavior)
- ✅ Open FAQ shows teal gradient icon background
- ✅ Open FAQ shows rotated arrow icon
- ✅ FAQ answer content slides down smoothly
- ✅ Category badge displays correctly

### Visual Details
- ✅ `.faq-question` uses DM Sans font
- ✅ Category badges have backdrop-filter blur
- ✅ Gradient shimmer animates on CTA section
- ✅ Paper texture overlay visible
- ✅ Corner accent borders visible
- ✅ Hover effects work on FAQ cards
- ✅ Button hover effect works on CTA

### Navigation & Links
- ✅ CTA button navigates to `/selection`
- ✅ Button has orange gradient background
- ✅ ArrowRight icon animates on button hover

### Accessibility
- ✅ `aria-labelledby="faq-heading"` on section
- ✅ `aria-expanded` on FAQ triggers reflects open/close state
- ✅ All `data-testid` attributes present
- ✅ Screen reader can navigate FAQ list

### Cross-Browser Testing
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (backdrop-filter support critical)

---

## 9. Rollback Plan

Each step is independently reversible. If issues arise:

### Step-Specific Rollback

**Step 1 (FaqStyles)**: Delete `FaqStyles.tsx`, restore inline `<style>` tag to `Faq.tsx`, remove import

**Step 2 (Data)**: Delete `faq.constants.tsx`, restore `faqs` array to `Faq.tsx`, restore icon imports, remove data import

**Step 3-7 (Sections)**: Delete section component file, restore original JSX to `Faq.tsx`, remove import

**Step 8 (Cleanup)**: Restore any accidentally removed imports

### Full Rollback
```bash
git checkout HEAD -- client/src/pages/Faq.tsx
rm -rf client/src/pages/faq/
```

---

## 10. Success Metrics

Phase 1 is complete when:

1. ✅ All 8 steps executed successfully
2. ✅ Visual regression checklist 100% passed
3. ✅ Build succeeds with no errors: `npm run build`
4. ✅ TypeScript check passes: `npm run typecheck`
5. ✅ Orchestrator is ~80-100 lines (currently 479 lines)
6. ✅ 6 section components created
7. ✅ 1 data file created
8. ✅ No visual changes detected (pixel-perfect parity)
9. ✅ No behavioral changes detected (interaction-identical)
10. ✅ No animation timing changes detected (sequence-identical)

---

## 11. References

### Similar Refactors
- Donate page refactor plan: `/docs/donate-orchestrator-refactor-plan.md` (15-step plan)
- Results page refactor plan: `/docs/results-refactor-plan.md` (14-step plan, completed)

### Related Files
- Current FAQ page: `/client/src/pages/Faq.tsx`
- Design guidelines: `/design_guidelines.md`
- Backend architecture: `/docs/backend-express-architecture.md`

### Testing Resources
- Browser DevTools: Inspect computed styles for nth-child selectors
- React DevTools: Verify component hierarchy matches expected structure
- Lighthouse: Verify accessibility scores remain unchanged

---

**Document Version**: 1.0
**Created**: 2026-01-02
**Status**: Ready for execution
