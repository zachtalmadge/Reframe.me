# Loading.tsx - Phase 1 Parity Refactor Plan

**Status**: Planning Complete, Awaiting Approval
**Target File**: `src/pages/Loading.tsx` (803 lines)
**Goal**: Improve maintainability, fix timer/dependency bugs, extract components and styles — with **ZERO visual/behavioral changes**

---

## 1. Executive Summary

### What Will Change (Structure)
- **Component Extraction**: Break down Loading.tsx into focused section components
- **Hook Extraction**: Extract stateful logic into custom hooks with proper cleanup
- **Style Organization**: Move two large `<style>` blocks into dedicated CSS modules
- **Bug Fixes**: Fix timer cleanup issues and dependency array problems WITHOUT changing behavior
- **File Organization**: Create folder-based structure similar to Home/Selection refactors

### What Will NOT Change (Parity Contract)
- ✅ DOM structure, classNames, and HTML hierarchy
- ✅ All inline `style={{...}}` objects preserved exactly
- ✅ Animation timing, keyframe names, and durations
- ✅ Text content (messages, quotes, error copy)
- ✅ API request behavior (retry logic, timeouts, mobile delays)
- ✅ Silent retry mechanism (maxAttempts=2)
- ✅ Data-uri SVG backgrounds
- ✅ ARIA attributes and accessibility
- ✅ User-facing behavior and visual appearance

---

## 2. File/Folder Structure Proposal

```
src/pages/loading/
├── index.tsx                    # Main Loading page (orchestration only)
├── sections/
│   ├── LoadingView.tsx         # Main loading UI (orb + messages + quotes)
│   ├── ErrorView.tsx           # Error state UI
│   ├── LoadingOrb.tsx          # Animated orb visualization
│   ├── StatusMessageCard.tsx   # Loading message display
│   └── MotivationalQuoteCard.tsx # Quote display with transitions
├── hooks/
│   ├── useDocumentGeneration.ts  # Main generation logic with retry
│   ├── useMessageCycle.ts        # Loading message rotation logic
│   └── useQuoteCycle.ts          # Quote rotation logic
├── utils/
│   └── generateDocuments.ts      # API call helper (extracted from inline)
├── data/
│   └── loadingContent.ts         # Messages and quotes data
└── styles/
    ├── loading.css               # Loading view styles + keyframes
    └── error.css                 # Error view styles + keyframes
```

**Note**: Keep structure minimal and consistent with repo conventions. No utils/api.ts or over-engineering.

---

## 3. Section Inventory (Component Mapping)

### 3.1 Loading View (lines 449-802)
**Extraction**: `LoadingView.tsx`

**Boundaries**:
- **Start**: Line 449 (`return (`)
- **End**: Line 802 (closing `</>`)
- **Excludes**: Error view, DisclaimerModal (stays in parent)

**Props Needed**:
```tsx
interface LoadingViewProps {
  messageIndex: number;
  isMessageVisible: boolean;
  quoteIndex: number;
  isQuoteVisible: boolean;
  showQuotes: boolean;
}
```

**State/Handlers**:
- Parent keeps: all state, disclaimer modal
- Child receives: display state as props (read-only)

**Parity Notes**:
- Copy entire JSX from line 449-795 verbatim
- Keep all inline styles unchanged
- Preserve className strings exactly
- Maintain aria-labelledby, aria-live, data-testid

---

### 3.2 Error View (lines 283-446)
**Extraction**: `ErrorView.tsx`

**Boundaries**:
- **Start**: Line 316 (`<section`)
- **End**: Line 444 (closing `</section>`)
- **Excludes**: `<style>` block (moves to CSS file)

**Props Needed**:
```tsx
interface ErrorViewProps {
  errorMessage: string | undefined;
  retryCount: number;
  onRetry: () => void;
  onGoBack: () => void;
}
```

**State/Handlers**:
- Parent keeps: generationState, handlers
- Child receives: error details + callbacks

**Parity Notes**:
- Move lines 316-444 (section element only, not style block)
- Keep all inline styles, gradients, animations
- Preserve data-testid attributes
- Maintain conditional render for retryCount > 2

---

### 3.3 Animated Orb Visualization (lines 589-643)
**Extraction**: `LoadingOrb.tsx`

**Boundaries**:
- **Start**: Line 589 (`<div className="flex items-center justify-center mb-16 md:mb-20 pt-8">`)
- **End**: Line 643 (closing `</div>`)

**Props**: None (pure visual component)

**Parity Notes**:
- Self-contained visual element
- No props, no state
- All animations defined in CSS (breathing-circle, ripple-ring)
- Preserve exact structure of nested divs for animation layering

---

### 3.4 Status Message Card (lines 687-716)
**Extraction**: `StatusMessageCard.tsx`

**Boundaries**:
- **Start**: Line 688 (`<div className="relative rounded-3xl overflow-hidden"`)
- **End**: Line 716 (closing `</div>`)

**Props Needed**:
```tsx
interface StatusMessageCardProps {
  message: string;
  isVisible: boolean;
}
```

**Parity Notes**:
- Receives current message and visibility state
- Preserve transition classes exactly
- Keep aria-live="polite" for accessibility
- Maintain data-testid="text-loading-message"

---

### 3.5 Motivational Quote Card (lines 718-780)
**Extraction**: `MotivationalQuoteCard.tsx`

**Boundaries**:
- **Start**: Line 719 (`<div className={...}`)
- **End**: Line 780 (closing `</div>`)

**Props Needed**:
```tsx
interface MotivationalQuoteCardProps {
  quote: { text: string; author: string };
  isVisible: boolean;
  showQuotes: boolean;
}
```

**Parity Notes**:
- Receives quote object, visibility, and show state
- Preserve transition logic for max-h-96/opacity-100
- Keep minHeight: '140px' on blockquote for layout stability
- Maintain aria-hidden="true"
- Keep all data-testid attributes

---

### 3.6 DisclaimerModal
**Location**: Stays in parent (index.tsx)

**Rationale**: Already a separate component, rendered conditionally after generation success

---

## 4. Parity Contract (Verbatim Rules)

### DOM & Styling
- [ ] DOM structure unchanged (same element hierarchy)
- [ ] className strings unchanged (exact class lists)
- [ ] Inline `style={{...}}` objects unchanged unless moved to CSS with identical computed styles
- [ ] All data-uri SVG backgrounds preserved exactly
- [ ] Gradient definitions preserved (linear-gradient, radial-gradient)

### Animations & Keyframes
- [ ] Keyframe names unchanged: `breathe-in-out`, `ink-spread`, `ripple-soft`, `float-gentle`, `page-turn`, `error-float`, `error-pulse-glow`
- [ ] Animation durations unchanged: 2000ms, 300ms, 3000ms, etc.
- [ ] Animation delays unchanged: 0s, 1.7s, 3.4s, etc.
- [ ] Transition classes unchanged: `transition-all duration-700`, etc.

### Content & Accessibility
- [ ] Text content unchanged (messages, quotes, error copy)
- [ ] ARIA attributes unchanged: `aria-labelledby`, `aria-live`, `aria-hidden`
- [ ] data-testid unchanged: `text-loading-message`, `text-error-message`, `button-retry`, `button-go-back`, `text-motivational-quote`, `text-quote-author`
- [ ] Icon components unchanged: AlertCircle, ArrowLeft, RefreshCw with same props

### Behavior & Logic
- [ ] API request behavior identical (timeout, retry, abort controller)
- [ ] Silent retry mechanism preserved (maxAttempts=2)
- [ ] Mobile detection and timeouts unchanged (90s mobile, 60s desktop)
- [ ] Loading message timing unchanged (2000ms display, 300ms fade)
- [ ] Quote timing unchanged (3000ms interval, 300ms fade)
- [ ] Storage verification logic unchanged (mobile 150ms delay + retry)
- [ ] Navigation flow unchanged (form → loading → results)

### Type Safety
- [ ] All TypeScript types preserved
- [ ] No `any` types introduced
- [ ] Import paths correct and verified with typecheck

---

## 5. Known Risks + Guardrails

### Risk 1: Timer Cleanup Issues
**Current Problem**:
- Line 102: Nested `setTimeout` inside outer `setTimeout` not tracked
- Line 114: Nested `setTimeout` inside `setInterval` not tracked
- Both create memory leaks if component unmounts during transitions

**Guardrails**:
- Extract to custom hooks that track ALL timeout IDs
- Return cleanup function that clears outer AND inner timers
- DO NOT change timing (still 2000ms outer, 300ms inner)
- Test unmounting during transitions

**Example Pattern**:
```tsx
useEffect(() => {
  const outerTimer = setTimeout(() => {
    // fade out
    const innerTimer = setTimeout(() => {
      // fade in
    }, 300);
    return () => clearTimeout(innerTimer); // ❌ WRONG - can't access from outer cleanup
  }, 2000);
  return () => clearTimeout(outerTimer); // ❌ Only clears outer
}, []);

// CORRECT APPROACH:
useEffect(() => {
  let outerTimer: NodeJS.Timeout | null = null;
  let innerTimer: NodeJS.Timeout | null = null;

  outerTimer = setTimeout(() => {
    // fade out
    innerTimer = setTimeout(() => {
      // fade in
    }, 300);
  }, 2000);

  return () => {
    if (outerTimer) clearTimeout(outerTimer);
    if (innerTimer) clearTimeout(innerTimer);
  };
}, []);
```

---

### Risk 2: Strict Mode Double-Invoke
**Current Problem**:
- React 18 strict mode calls useEffect twice in development
- `startGeneration()` called on mount (line 264) might fire twice
- Empty dependency array doesn't include `startGeneration`

**Guardrails**:
- Add ref to track if generation already started
- Fix dependency array to include `startGeneration` (it's stable via useCallback)
- OR: Use `useEffect` with proper deps: `[startGeneration]` since it's memoized
- Test in strict mode explicitly

**Note**: This is acceptable Phase 1 fix since we're correcting a bug, not changing intended behavior

---

### Risk 3: startGeneration Dependency Handling
**Current Problem**:
- Line 264: `useEffect(() => { startGeneration(); }, []);`
- Missing `startGeneration` in deps array
- `startGeneration` depends on `navigate` and `tool` (line 260)

**Guardrails**:
- `startGeneration` is memoized via `useCallback` with deps `[navigate, tool]`
- Safe to add to useEffect deps array: `[startGeneration]`
- This fixes React warning without changing behavior
- `startGeneration` reference only changes if navigate/tool change

---

### Risk 4: Tool Param Validation
**Current Problem**:
- Line 78: `const tool = (params.get("tool") as ToolType) || "narrative";`
- Type assertion could allow invalid values
- No explicit validation against ToolType union

**Guardrails**:
- Extract to utility: `validateToolParam(param: string | null): ToolType`
- Validate against known ToolType values
- Fallback to "narrative" if invalid
- Keep behavior identical (still defaults to "narrative")

---

### Risk 5: CSS Migration
**Current Problem**:
- Moving `<style>` blocks to CSS files could break if selectors don't match
- Keyframe names must be globally unique

**Guardrails**:
- Copy keyframes verbatim to CSS files
- Verify compiled CSS output matches original
- Test all animations visually
- Keep utility classes (`.loading-serif`, `.error-sans`, etc.) in CSS
- Do NOT convert inline styles to classes in Phase 1 (too risky)

---

### Risk 6: aria-live Behavior
**Current Problem**:
- Line 711: `aria-live="polite"` announces message changes
- Extracting to component could break if prop flow changes

**Guardrails**:
- Preserve `aria-live="polite"` on message element
- Pass exact message string as prop (not object/array)
- Test with screen reader to verify announcements still work
- Do NOT change prop update frequency

---

## 6. Step-by-Step Implementation Playbook

Each step is atomic, reversible, and independently verifiable.

---

### Step 1: Create folder structure and data file
**Files Created**:
- `src/pages/loading/data/loadingContent.ts`

**Files Modified**: None

**What to Move**:
```tsx
// Extract from Loading.tsx lines 18-30
export const loadingMessages = [
  "Analyzing your information...",
  "Preparing your documents...",
  "Almost there...",
];

export const motivationalQuotes = [
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "I can be changed by what happens to me. But I refuse to be reduced by it.", author: "Maya Angelou" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Challenges are what make life interesting; overcoming them is what makes life meaningful.", author: "Joshua J. Marine" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
];
```

**Create Folders**:
```bash
mkdir -p src/pages/loading/data
mkdir -p src/pages/loading/hooks
mkdir -p src/pages/loading/sections
mkdir -p src/pages/loading/utils
mkdir -p src/pages/loading/styles
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] File exports loadingMessages and motivationalQuotes
- [ ] Arrays are identical to original

**Git Commit**:
```
refactor(loading): extract data and create folder structure (Phase 1 Step 1)
```

---

### Step 2: Extract generateDocuments utility
**Files Created**:
- `src/pages/loading/utils/generateDocuments.ts`

**Files Modified**:
- `src/pages/Loading.tsx` (update import)

**What to Move**:
```tsx
// Extract lines 32-69 from Loading.tsx
import { ToolType, FormState } from "@/lib/formState";
import { GenerationResult } from "@/lib/resultsPersistence";

export async function generateDocuments(
  selection: ToolType,
  formData: FormState,
  timeoutMs: number = 60000 // 60 seconds
): Promise<GenerationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("/api/generate-documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selection,
        formData,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.detail || `Server error: ${response.status}`);
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw err;
  }
}
```

**Update in Loading.tsx**:
```tsx
// Remove lines 32-69
// Add import:
import { generateDocuments } from "./utils/generateDocuments";
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] Function signature unchanged
- [ ] Types imported correctly

**Git Commit**:
```
refactor(loading): extract generateDocuments utility (Phase 1 Step 2)
```

---

### Step 3: Create CSS files and move style blocks
**Files Created**:
- `src/pages/loading/styles/loading.css`
- `src/pages/loading/styles/error.css`

**Files Modified**:
- `src/pages/Loading.tsx` (remove `<style>` blocks, add imports)

**loading.css Content** (lines 452-565):
```css
/* Loading page typography */
.loading-serif {
  font-family: 'Libre Baskerville', Georgia, serif;
  letter-spacing: -0.01em;
}

.loading-sans {
  font-family: 'Nunito', system-ui, sans-serif;
}

/* Loading animations */
@keyframes breathe-in-out {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.85;
  }
}

@keyframes ink-spread {
  0% {
    transform: scale(0.3);
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes ripple-soft {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  30% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

@keyframes float-gentle {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, -10px) rotate(5deg);
  }
  50% {
    transform: translate(-5px, -20px) rotate(-3deg);
  }
  75% {
    transform: translate(-10px, -10px) rotate(2deg);
  }
}

@keyframes page-turn {
  0% {
    transform: perspective(1000px) rotateY(-5deg);
  }
  100% {
    transform: perspective(1000px) rotateY(5deg);
  }
}

/* Ink blob elements */
.ink-blob {
  position: absolute;
  border-radius: 50%;
  animation: ink-spread 8s ease-out infinite;
}

.ink-blob:nth-child(1) {
  top: 20%;
  left: 15%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(13, 148, 136, 0.12) 0%, transparent 70%);
  animation-delay: 0s;
}

.ink-blob:nth-child(2) {
  bottom: 30%;
  right: 20%;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%);
  animation-delay: 3s;
}

.ink-blob:nth-child(3) {
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
  animation-delay: 6s;
}

/* Loading orb effects */
.breathing-circle {
  animation: breathe-in-out 7s ease-in-out infinite;
}

.ripple-ring {
  animation: ripple-soft 5s ease-out infinite;
}
```

**error.css Content** (lines 287-314):
```css
/* Error page typography */
.error-serif {
  font-family: 'Libre Baskerville', Georgia, serif;
  letter-spacing: -0.01em;
}

.error-sans {
  font-family: 'Nunito', system-ui, sans-serif;
}

/* Error animations */
@keyframes error-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes error-pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(220, 38, 38, 0.5);
  }
}
```

**Update Loading.tsx**:
```tsx
// Add at top of file:
import "./styles/loading.css";
import "./styles/error.css";

// Remove lines 287-314 (<style> block for error)
// Remove lines 452-565 (<style> block for loading)
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] `npm run dev` - check both loading and error views render
- [ ] Animations still work (orb breathing, ink blobs, error float)
- [ ] Typography classes apply correctly

**Visual Parity Checks**:
- [ ] Loading orb breathes at same rate
- [ ] Ink blobs animate with same timing
- [ ] Error icon pulses with same glow
- [ ] Font families match (serif/sans)

**Git Commit**:
```
refactor(loading): move style blocks to CSS files (Phase 1 Step 3)
```

---

### Step 4: Extract useMessageCycle hook (with proper timer cleanup)
**Files Created**:
- `src/pages/loading/hooks/useMessageCycle.ts`

**Files Modified**:
- `src/pages/Loading.tsx` (replace effect with hook)

**Hook Implementation**:
```tsx
import { useState, useEffect } from "react";

interface MessageCycleState {
  messageIndex: number;
  isMessageVisible: boolean;
  showQuotes: boolean;
}

export function useMessageCycle(
  isLoading: boolean,
  messages: string[]
): MessageCycleState {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [showQuotes, setShowQuotes] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    if (messageIndex >= messages.length - 1) {
      setShowQuotes(true);
      return;
    }

    // Track both timers for proper cleanup
    let outerTimer: NodeJS.Timeout | null = null;
    let innerTimer: NodeJS.Timeout | null = null;

    outerTimer = setTimeout(() => {
      setIsMessageVisible(false);

      innerTimer = setTimeout(() => {
        setMessageIndex((prev) => prev + 1);
        setIsMessageVisible(true);
      }, 300);
    }, 2000);

    return () => {
      if (outerTimer) clearTimeout(outerTimer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [isLoading, messageIndex, messages.length]);

  return { messageIndex, isMessageVisible, showQuotes };
}
```

**Update Loading.tsx**:
```tsx
// Add import:
import { useMessageCycle } from "./hooks/useMessageCycle";
import { loadingMessages } from "./data/loadingContent";

// Replace lines 81-106:
// OLD:
// const [messageIndex, setMessageIndex] = useState(0);
// const [isMessageVisible, setIsMessageVisible] = useState(true);
// const [showQuotes, setShowQuotes] = useState(false);
// ... effect code ...

// NEW:
const { messageIndex, isMessageVisible, showQuotes } = useMessageCycle(
  generationState.status === "loading",
  loadingMessages
);

// Remove:
// - Lines 81-83 (state declarations)
// - Lines 88-106 (useEffect)
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] Messages still cycle every 2s
- [ ] Fade transitions still 300ms
- [ ] After last message, quotes appear
- [ ] Console: no timer warnings on unmount
- [ ] Test: navigate away during loading - no errors

**Parity Checks**:
- [ ] "Analyzing your information..." shows first
- [ ] After 2s, fades out for 300ms then shows next
- [ ] After "Almost there...", quotes section appears
- [ ] Timing unchanged (2000ms + 300ms)

**Git Commit**:
```
refactor(loading): extract useMessageCycle hook with timer cleanup (Phase 1 Step 4)
```

---

### Step 5: Extract useQuoteCycle hook (with proper timer cleanup)
**Files Created**:
- `src/pages/loading/hooks/useQuoteCycle.ts`

**Files Modified**:
- `src/pages/Loading.tsx` (replace effect with hook)

**Hook Implementation**:
```tsx
import { useState, useEffect } from "react";

interface QuoteCycleState {
  quoteIndex: number;
  isQuoteVisible: boolean;
}

export function useQuoteCycle(
  showQuotes: boolean,
  isLoading: boolean,
  quotesCount: number
): QuoteCycleState {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);

  useEffect(() => {
    if (!showQuotes || !isLoading) return;

    // Track both timer IDs for proper cleanup
    let intervalTimer: NodeJS.Timeout | null = null;
    let innerTimer: NodeJS.Timeout | null = null;

    intervalTimer = setInterval(() => {
      setIsQuoteVisible(false);

      innerTimer = setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotesCount);
        setIsQuoteVisible(true);
      }, 300);
    }, 3000);

    return () => {
      if (intervalTimer) clearInterval(intervalTimer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [showQuotes, isLoading, quotesCount]);

  return { quoteIndex, isQuoteVisible };
}
```

**Update Loading.tsx**:
```tsx
// Add import:
import { useQuoteCycle } from "./hooks/useQuoteCycle";
import { motivationalQuotes } from "./data/loadingContent";

// Replace lines 85-121:
// OLD:
// const [quoteIndex, setQuoteIndex] = useState(0);
// const [isQuoteVisible, setIsQuoteVisible] = useState(true);
// ... effect code ...

// NEW:
const { quoteIndex, isQuoteVisible } = useQuoteCycle(
  showQuotes,
  generationState.status === "loading",
  motivationalQuotes.length
);

// Remove:
// - Lines 85-86 (state declarations)
// - Lines 108-121 (useEffect)
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] Quotes cycle every 3s after appearing
- [ ] Fade transitions still 300ms
- [ ] Quote index wraps around to 0 after last quote
- [ ] Console: no timer warnings on unmount
- [ ] Test: navigate away during quote display - no errors

**Parity Checks**:
- [ ] First quote appears when showQuotes becomes true
- [ ] After 3s, fades out for 300ms then shows next quote
- [ ] After last quote, cycles back to first
- [ ] Timing unchanged (3000ms interval + 300ms fade)

**Git Commit**:
```
refactor(loading): extract useQuoteCycle hook with timer cleanup (Phase 1 Step 5)
```

---

### Step 6: Extract LoadingOrb component
**Files Created**:
- `src/pages/loading/sections/LoadingOrb.tsx`

**Files Modified**:
- `src/pages/Loading.tsx` (replace JSX with component)

**Component Implementation**:
```tsx
export function LoadingOrb() {
  return (
    <div className="flex items-center justify-center mb-16 md:mb-20 pt-8">
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        {/* Outer ripple rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="ripple-ring w-full h-full rounded-full border-2"
            style={{
              borderColor: 'rgba(13, 148, 136, 0.2)',
              animationDelay: '0s'
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="ripple-ring w-full h-full rounded-full border-2"
            style={{
              borderColor: 'rgba(13, 148, 136, 0.2)',
              animationDelay: '1.7s'
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="ripple-ring w-full h-full rounded-full border-2"
            style={{
              borderColor: 'rgba(249, 115, 22, 0.15)',
              animationDelay: '3.4s'
            }}
          />
        </div>

        {/* Central breathing orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="breathing-circle w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, rgba(13, 148, 136, 0.08) 60%, transparent 100%)',
              boxShadow: '0 0 60px rgba(13, 148, 136, 0.15), inset 0 0 30px rgba(255, 255, 255, 0.5)'
            }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(13, 148, 136, 0.25) 100%)',
                backdropFilter: 'blur(8px)',
                boxShadow: 'inset 0 2px 8px rgba(255, 255, 255, 0.6)'
              }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #14b8a6 0%, #0d9488 100%)',
                  boxShadow: '0 4px 16px rgba(13, 148, 136, 0.4)',
                  animation: 'breathe-in-out 4s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Update Loading.tsx**:
```tsx
// Add import:
import { LoadingOrb } from "./sections/LoadingOrb";

// Replace lines 589-643:
// OLD:
// <div className="flex items-center justify-center mb-16 md:mb-20 pt-8">
//   ... full orb JSX ...
// </div>

// NEW:
<LoadingOrb />
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `npm run dev` - orb appears and animates
- [ ] Breathing animation works
- [ ] Ripple rings animate with delays
- [ ] Responsive sizing (48/56 on md+)

**Visual Parity Checks**:
- [ ] Orb centered with same margins
- [ ] Size matches original (w-48 h-48 md:w-56 md:h-56)
- [ ] Ripples have 0s, 1.7s, 3.4s delays
- [ ] Colors match (teal gradient, orange accent)
- [ ] Inner orb has 4s breathe animation

**Git Commit**:
```
refactor(loading): extract LoadingOrb component (Phase 1 Step 6)
```

---

### Step 7: Extract StatusMessageCard component
**Files Created**:
- `src/pages/loading/sections/StatusMessageCard.tsx`

**Files Modified**:
- `src/pages/Loading.tsx` (replace JSX with component)

**Component Implementation**:
```tsx
interface StatusMessageCardProps {
  message: string;
  isVisible: boolean;
}

export function StatusMessageCard({ message, isVisible }: StatusMessageCardProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(254,252,232,0.6) 100%)',
        border: '1.5px solid rgba(13, 148, 136, 0.15)',
        boxShadow: '0 8px 32px rgba(13, 148, 136, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
      }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230d9488' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 p-10 md:p-12">
        <p
          className={`loading-sans text-xl md:text-2xl font-bold text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            color: '#115e59'
          }}
          data-testid="text-loading-message"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </div>
  );
}
```

**Update Loading.tsx**:
```tsx
// Add import:
import { StatusMessageCard } from "./sections/StatusMessageCard";

// Replace lines 687-716:
// OLD:
// <div className="relative rounded-3xl overflow-hidden"...>
//   ... full card JSX ...
// </div>

// NEW:
<StatusMessageCard
  message={loadingMessages[messageIndex]}
  isVisible={isMessageVisible}
/>
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `npm run dev` - message card appears
- [ ] Messages cycle with fade effect
- [ ] aria-live="polite" still present
- [ ] data-testid unchanged

**Parity Checks**:
- [ ] Card styling matches (gradient, border, shadow)
- [ ] Pattern overlay visible (very subtle)
- [ ] Transition classes work (duration-700)
- [ ] Message color matches (#115e59)
- [ ] Padding matches (p-10 md:p-12)

**Git Commit**:
```
refactor(loading): extract StatusMessageCard component (Phase 1 Step 7)
```

---

### Step 8: Extract MotivationalQuoteCard component
**Files Created**:
- `src/pages/loading/sections/MotivationalQuoteCard.tsx`

**Files Modified**:
- `src/pages/Loading.tsx` (replace JSX with component)

**Component Implementation**:
```tsx
interface MotivationalQuoteCardProps {
  quote: { text: string; author: string };
  isVisible: boolean;
  showQuotes: boolean;
}

export function MotivationalQuoteCard({ quote, isVisible, showQuotes }: MotivationalQuoteCardProps) {
  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        showQuotes ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}
      aria-hidden="true"
    >
      <div className="relative rounded-3xl overflow-hidden p-10 md:p-14"
        style={{
          background: 'linear-gradient(135deg, rgba(254,252,232,0.5) 0%, rgba(255,255,255,0.8) 50%, rgba(254,243,199,0.4) 100%)',
          border: '1.5px solid rgba(249, 115, 22, 0.12)',
          boxShadow: '0 12px 40px rgba(249, 115, 22, 0.08)'
        }}
      >
        {/* Quote marks decoration */}
        <div className="absolute top-6 left-6 text-6xl md:text-7xl opacity-10 loading-serif"
          style={{ color: '#ea580c' }}
        >
          "
        </div>

        <div className="relative space-y-8">
          <div className="w-20 h-0.5 mx-auto rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%)'
            }}
          />

          <blockquote
            className={`loading-serif italic text-xl md:text-2xl lg:text-3xl leading-relaxed text-center transition-all duration-700 flex items-center justify-center ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              color: '#78350f',
              lineHeight: '1.6',
              minHeight: '140px'
            }}
            data-testid="text-motivational-quote"
          >
            <span>{quote.text}</span>
          </blockquote>

          <p
            className={`loading-sans text-base md:text-lg font-bold text-center transition-all duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              color: '#92400e',
              letterSpacing: '0.05em'
            }}
            data-testid="text-quote-author"
          >
            — {quote.author}
          </p>

          <div className="w-20 h-0.5 mx-auto rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

**Update Loading.tsx**:
```tsx
// Add import:
import { MotivationalQuoteCard } from "./sections/MotivationalQuoteCard";

// Replace lines 718-780:
// OLD:
// <div className={`transition-all duration-700...
//   ... full quote card JSX ...
// </div>

// NEW:
<MotivationalQuoteCard
  quote={motivationalQuotes[quoteIndex]}
  isVisible={isQuoteVisible}
  showQuotes={showQuotes}
/>
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `npm run dev` - quotes appear after messages
- [ ] Quotes cycle every 3s
- [ ] Fade transitions work
- [ ] minHeight maintains layout stability

**Parity Checks**:
- [ ] Card slides in when showQuotes=true (max-h-0 → max-h-96)
- [ ] Opening quote mark positioned top-6 left-6
- [ ] Quote text fades with translate-y-6
- [ ] Author name fades without translation
- [ ] Decorative dividers match (w-20 gradient)
- [ ] aria-hidden="true" preserved

**Git Commit**:
```
refactor(loading): extract MotivationalQuoteCard component (Phase 1 Step 8)
```

---

### Step 9: Extract ErrorView component
**Files Created**:
- `src/pages/loading/sections/ErrorView.tsx`

**Files Modified**:
- `src/pages/Loading.tsx` (replace error JSX with component)

**Component Implementation**:
```tsx
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorViewProps {
  errorMessage: string | undefined;
  retryCount: number;
  onRetry: () => void;
  onGoBack: () => void;
}

export function ErrorView({ errorMessage, retryCount, onRetry, onGoBack }: ErrorViewProps) {
  return (
    <section
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fef3f2 0%, #fefaf8 50%, #fef2f2 100%)'
      }}
      aria-labelledby="error-heading"
    >
      {/* Organic background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Floating accent shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-10" style={{
        background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)',
        animation: 'error-float 6s ease-in-out infinite'
      }} />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-10" style={{
        background: 'radial-gradient(circle, #ea580c 0%, transparent 70%)',
        animation: 'error-float 8s ease-in-out infinite',
        animationDelay: '1s'
      }} />

      <div className="max-w-2xl mx-auto text-center space-y-10 relative z-10">
        {/* Error icon with organic treatment */}
        <div className="relative inline-block" style={{ animation: 'error-pulse-glow 3s ease-in-out infinite' }}>
          <div className="relative">
            {/* Layered backgrounds for depth */}
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-60" />
            <div className="absolute inset-0 bg-red-200 rounded-full blur-lg opacity-40" style={{ transform: 'scale(0.85)' }} />

            {/* Main icon container */}
            <div className="relative w-28 h-28 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #fca5a5 0%, #dc2626 100%)',
              boxShadow: '0 10px 40px rgba(220, 38, 38, 0.25), inset 0 -2px 10px rgba(0,0,0,0.1)'
            }}>
              <AlertCircle className="w-16 h-16 text-white" strokeWidth={2.5} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Heading with editorial styling */}
        <div className="space-y-5">
          <h1
            id="error-heading"
            className="error-serif text-3xl md:text-5xl font-bold"
            style={{
              color: '#7c2d12',
              lineHeight: '1.15'
            }}
          >
            Something didn't work
          </h1>
          <div className="w-16 h-1 mx-auto rounded-full" style={{
            background: 'linear-gradient(90deg, transparent 0%, #dc2626 50%, transparent 100%)'
          }} />
          <p
            className="error-sans text-lg md:text-xl font-semibold"
            style={{ color: '#9a3412' }}
            data-testid="text-error-message"
          >
            {errorMessage}
          </p>
        </div>

        {/* Reassurance card with texture */}
        <div className="relative rounded-3xl overflow-hidden p-8" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,243,199,0.8) 100%)',
          border: '2px solid rgba(217, 119, 6, 0.15)',
          boxShadow: '0 8px 32px rgba(217, 119, 6, 0.08)'
        }}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 2.5a17.5 17.5 0 1 0 0 35 17.5 17.5 0 0 0 0-35z' fill='%23d97706' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }} />

          <p className="error-sans text-base md:text-lg font-bold relative z-10" style={{ color: '#78350f' }}>
            Your information is safe
          </p>
          <p className="error-sans text-sm md:text-base mt-2 relative z-10" style={{ color: '#92400e' }}>
            Nothing you entered was lost. Everything is saved.
          </p>
        </div>

        {/* Action buttons with warmth */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={onRetry}
            size="lg"
            className="group error-sans font-bold text-base px-8 py-6 rounded-2xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)',
              border: 'none'
            }}
            data-testid="button-retry"
          >
            <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-700" aria-hidden="true" />
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onGoBack}
            className="group error-sans font-bold text-base px-8 py-6 rounded-2xl transition-all duration-300"
            style={{
              borderWidth: '2px',
              borderColor: '#dc2626',
              color: '#dc2626',
              background: 'transparent'
            }}
            data-testid="button-go-back"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            Back to Form
          </Button>
        </div>

        {retryCount > 2 && (
          <div className="rounded-2xl p-6 mt-6" style={{
            background: 'rgba(254, 243, 199, 0.4)',
            border: '1.5px solid rgba(217, 119, 6, 0.3)'
          }}>
            <p className="error-sans text-sm font-semibold" style={{ color: '#92400e' }}>
              Still having trouble? Please try again later or contact support if the issue persists.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
```

**Update Loading.tsx**:
```tsx
// Add import:
import { ErrorView } from "./sections/ErrorView";

// Replace lines 283-446:
// OLD:
// if (generationState.status === "error") {
//   return (
//     <>
//       <style>...</style>
//       <section>...</section>
//     </>
//   );
// }

// NEW:
if (generationState.status === "error") {
  return (
    <ErrorView
      errorMessage={generationState.error?.message}
      retryCount={generationState.retryCount}
      onRetry={handleRetry}
      onGoBack={handleGoBack}
    />
  );
}
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `npm run dev` - trigger error to test
- [ ] Error view renders correctly
- [ ] Retry/GoBack buttons work
- [ ] Conditional message for retryCount > 2

**Parity Checks**:
- [ ] Background gradient matches
- [ ] Icon animation (pulse-glow) works
- [ ] Floating shapes animate (error-float)
- [ ] Button hover effects work
- [ ] RefreshCw rotates on hover
- [ ] ArrowLeft translates on hover
- [ ] All data-testid preserved

**Git Commit**:
```
refactor(loading): extract ErrorView component (Phase 1 Step 9)
```

---

### Step 10: Extract LoadingView component
**Files Created**:
- `src/pages/loading/sections/LoadingView.tsx`

**Files Modified**:
- `src/pages/Loading.tsx` (replace loading JSX with component)

**Component Implementation**:
```tsx
import { LoadingOrb } from "./LoadingOrb";
import { StatusMessageCard } from "./StatusMessageCard";
import { MotivationalQuoteCard } from "./MotivationalQuoteCard";
import { loadingMessages, motivationalQuotes } from "../data/loadingContent";

interface LoadingViewProps {
  messageIndex: number;
  isMessageVisible: boolean;
  quoteIndex: number;
  isQuoteVisible: boolean;
  showQuotes: boolean;
}

export function LoadingView({
  messageIndex,
  isMessageVisible,
  quoteIndex,
  isQuoteVisible,
  showQuotes
}: LoadingViewProps) {
  return (
    <section
      className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, #fdfcfb 0%, #fef9f3 30%, #fef6ee 60%, #fefaf8 100%)'
      }}
      aria-labelledby="loading-heading"
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }} />

      {/* Animated ink blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="ink-blob" />
        <div className="ink-blob" />
        <div className="ink-blob" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Main loading visualization - organic breathing orbs */}
        <LoadingOrb />

        {/* Content area with editorial spacing */}
        <div className="space-y-12 md:space-y-14">
          {/* Main heading */}
          <div className="text-center space-y-6">
            <h1
              id="loading-heading"
              className="loading-serif text-3xl md:text-5xl lg:text-6xl font-bold"
              style={{
                color: '#0f766e',
                lineHeight: '1.1',
                textShadow: '0 2px 4px rgba(13, 148, 136, 0.1)'
              }}
            >
              Crafting your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                story
              </span>
            </h1>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #0d9488 100%)'
                }}
              />
              <div className="w-2 h-2 rounded-full"
                style={{ background: '#f97316' }}
              />
              <div className="w-12 h-px"
                style={{
                  background: 'linear-gradient(90deg, #0d9488 0%, transparent 100%)'
                }}
              />
            </div>
          </div>

          {/* Status message card */}
          <StatusMessageCard
            message={loadingMessages[messageIndex]}
            isVisible={isMessageVisible}
          />

          {/* Motivational quotes section */}
          <MotivationalQuoteCard
            quote={motivationalQuotes[quoteIndex]}
            isVisible={isQuoteVisible}
            showQuotes={showQuotes}
          />

          {/* Subtle timing note */}
          <div className="text-center pt-4">
            <p className="loading-sans text-sm font-semibold tracking-wide"
              style={{
                color: '#64748b',
                opacity: 0.7
              }}
            >
              This usually takes just a few moments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Update Loading.tsx**:
```tsx
// Add import:
import { LoadingView } from "./sections/LoadingView";

// Replace lines 449-795:
// OLD:
// return (
//   <>
//     <style>...</style>
//     <section>...</section>
//     <DisclaimerModal ... />
//   </>
// );

// NEW:
return (
  <>
    <LoadingView
      messageIndex={messageIndex}
      isMessageVisible={isMessageVisible}
      quoteIndex={quoteIndex}
      isQuoteVisible={isQuoteVisible}
      showQuotes={showQuotes}
    />
    <DisclaimerModal
      open={showDisclaimer}
      onContinue={handleDisclaimerContinue}
    />
  </>
);
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `npm run dev` - full loading flow works
- [ ] Orb animates
- [ ] Messages cycle
- [ ] Quotes appear and cycle
- [ ] Disclaimer appears after success

**Parity Checks**:
- [ ] Background gradient matches
- [ ] Paper texture overlay present
- [ ] Ink blobs animate
- [ ] Heading with gradient "story" text
- [ ] Decorative divider under heading
- [ ] Timing note at bottom
- [ ] All spacing matches (space-y-12 md:space-y-14)

**Git Commit**:
```
refactor(loading): extract LoadingView component (Phase 1 Step 10)
```

---

### Step 11: Extract useDocumentGeneration hook
**Files Created**:
- `src/pages/loading/hooks/useDocumentGeneration.ts`

**Files Modified**:
- `src/pages/Loading.tsx` (replace generation logic with hook)

**Hook Implementation**:
```tsx
import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  ToolType,
  GenerationState,
  initialGenerationState,
  getErrorMessage,
  GenerationErrorType,
} from "@/lib/formState";
import { loadFormData } from "@/lib/formPersistence";
import { saveResults, loadResults } from "@/lib/resultsPersistence";
import { generateDocuments } from "../utils/generateDocuments";

interface DocumentGenerationResult {
  generationState: GenerationState;
  showDisclaimer: boolean;
  startGeneration: () => Promise<void>;
  handleRetry: () => void;
}

export function useDocumentGeneration(tool: ToolType): DocumentGenerationResult {
  const [, navigate] = useLocation();
  const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const startGeneration = useCallback(async () => {
    // Detect mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    console.log('[Loading] Starting generation', { tool, isMobile });

    const persistedData = loadFormData();
    if (!persistedData) {
      console.error('[Loading] No persisted form data found, redirecting to form');
      navigate(`/form?tool=${tool}`);
      return;
    }

    console.log('[Loading] Form data loaded successfully');

    setGenerationState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
    }));

    /**
     * WORKAROUND: Automatic silent retry on all devices
     *
     * Problem: Document generation fails on first attempt but succeeds on second attempt.
     * This happens on:
     * - Mobile browsers (especially iOS Safari) - sessionStorage writes or network/API initialization timing
     * - Desktop on first load after deployment - serverless cold start / OpenAI client initialization
     *
     * Solution: Automatically retry once without showing error to user. This makes the failure
     * invisible - user sees continuous loading animation while we retry in background.
     *
     * Root causes:
     * - Server side: OpenAI client lazy initialization on cold start (first request after deploy)
     * - Client side: sessionStorage timing issues on mobile Safari
     *
     * TODO: Fix root causes:
     * - Server: Pre-warm OpenAI client on server startup instead of lazy loading
     * - Client: Investigate sessionStorage write delays and consider alternative storage
     * - Review AppInitializer timing and route protection logic
     *
     * To test if still needed: Set maxAttempts to 1 and test on fresh deployment
     */
    const maxAttempts = 2; // Apply retry to all devices for cold-start resilience
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`[Loading] WORKAROUND: Silent retry attempt ${attempt}/${maxAttempts} (cold-start protection)`);
          // Small delay before retry to let any timing issues resolve
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        const timeout = isMobile ? 90000 : 60000; // 90s mobile, 60s desktop
        console.log('[Loading] Calling generateDocuments with timeout:', timeout);

        const result = await generateDocuments(tool, persistedData.formState, timeout);
        console.log('[Loading] Generation result:', result.status);

        if (result.status === "total_fail") {
          throw new Error(result.errors[0]?.detail || "Failed to generate documents");
        }

        console.log('[Loading] Saving results to sessionStorage');
        const saveResult = saveResults(result, tool);
        if (!saveResult.success) {
          console.error('[Loading] Failed to save results:', saveResult.error);
          // Still continue to show disclaimer - data is in memory
        } else {
          console.log('[Loading] Results saved successfully');
        }

        // On mobile, add delay and verify save completed before proceeding
        if (isMobile) {
          console.log('[Loading] Mobile detected, waiting 150ms for storage stabilization');
          await new Promise(resolve => setTimeout(resolve, 150));

          // Verify the save actually worked
          const verification = loadResults();
          if (!verification) {
            console.error('[Loading] Save verification FAILED on mobile, retrying save...');
            saveResults(result, tool);
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify again
            const secondVerification = loadResults();
            if (!secondVerification) {
              console.error('[Loading] Second save verification FAILED! Data may be lost.');
            } else {
              console.log('[Loading] Second save successful');
            }
          } else {
            console.log('[Loading] Save verification successful');
          }
        }

        console.log('[Loading] Setting success state and showing disclaimer');
        setGenerationState((prev) => ({
          ...prev,
          status: "success",
        }));
        setShowDisclaimer(true);

        // SUCCESS - break out of retry loop
        return;

      } catch (err) {
        console.error(`[Loading] Generation error on attempt ${attempt}/${maxAttempts}:`, err);
        lastError = err as Error;

        // If this was our last attempt, show the error
        if (attempt === maxAttempts) {
          let errorType: GenerationErrorType = "unknown";

          if (err instanceof Error) {
            if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Failed to fetch")) {
              errorType = "network";
            } else if (err.message.includes("timeout")) {
              errorType = "timeout";
            } else if (err.message.includes("500") || err.message.includes("server") || err.message.includes("Server error")) {
              errorType = "server";
            }
          }

          setGenerationState((prev) => ({
            status: "error",
            error: {
              type: errorType,
              message: getErrorMessage(errorType),
            },
            retryCount: prev.retryCount + 1,
          }));
        }
        // If not last attempt, continue loop for silent retry
      }
    }
  }, [navigate, tool]);

  const handleRetry = useCallback(() => {
    // Reset states handled in parent (message/quote indices)
    // Just restart generation
    startGeneration();
  }, [startGeneration]);

  return {
    generationState,
    showDisclaimer,
    startGeneration,
    handleRetry,
  };
}
```

**Update Loading.tsx**:
```tsx
// Add import:
import { useDocumentGeneration } from "./hooks/useDocumentGeneration";

// Replace lines 80, 82, 123-260, 266-273:
// OLD:
// const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);
// const [showDisclaimer, setShowDisclaimer] = useState(false);
// const startGeneration = useCallback(async () => { ... }, [navigate, tool]);
// const handleRetry = useCallback(() => { ... }, [startGeneration]);

// NEW:
const { generationState, showDisclaimer, startGeneration, handleRetry } = useDocumentGeneration(tool);

// Keep handleRetry wrapper for resetting UI state:
const handleRetryWithReset = useCallback(() => {
  // Reset message/quote UI state
  // (This will need to be handled differently - see note below)
  handleRetry();
}, [handleRetry]);
```

**IMPORTANT NOTE**: `handleRetry` in the hook only calls `startGeneration()`. The parent component's `handleRetry` also resets message/quote indices. We need to expose a way to reset these, OR move that state into the hooks themselves.

**Recommended approach**: Keep the wrapper in parent that resets the cycle hooks:
```tsx
const handleRetryClick = useCallback(() => {
  // These will need to be exposed from hooks or handled differently
  // For now, we'll need to add reset functions to the cycle hooks
  handleRetry();
}, [handleRetry]);
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `npm run dev` - generation still works
- [ ] Silent retry behavior preserved
- [ ] Mobile timeout (90s) vs desktop (60s)
- [ ] Storage verification on mobile
- [ ] Error handling works

**Parity Checks**:
- [ ] Console logs unchanged
- [ ] Retry logic identical (maxAttempts=2)
- [ ] Mobile detection identical
- [ ] Error type detection identical
- [ ] Navigation on missing form data

**Git Commit**:
```
refactor(loading): extract useDocumentGeneration hook (Phase 1 Step 11)
```

---

### Step 12: Add reset functions to cycle hooks and fix retry handler
**Files Modified**:
- `src/pages/loading/hooks/useMessageCycle.ts`
- `src/pages/loading/hooks/useQuoteCycle.ts`
- `src/pages/loading/hooks/useDocumentGeneration.ts`
- `src/pages/Loading.tsx`

**Update useMessageCycle.ts**:
```tsx
// Add to return type:
interface MessageCycleState {
  messageIndex: number;
  isMessageVisible: boolean;
  showQuotes: boolean;
  reset: () => void; // NEW
}

// Add inside hook:
const reset = useCallback(() => {
  setMessageIndex(0);
  setIsMessageVisible(true);
  setShowQuotes(false);
}, []);

// Update return:
return { messageIndex, isMessageVisible, showQuotes, reset };
```

**Update useQuoteCycle.ts**:
```tsx
// Add to return type:
interface QuoteCycleState {
  quoteIndex: number;
  isQuoteVisible: boolean;
  reset: () => void; // NEW
}

// Add inside hook:
const reset = useCallback(() => {
  setQuoteIndex(0);
  setIsQuoteVisible(true);
}, []);

// Update return:
return { quoteIndex, isQuoteVisible, reset };
```

**Update useDocumentGeneration.ts**:
```tsx
// Accept reset callbacks as params:
export function useDocumentGeneration(
  tool: ToolType,
  onRetryReset?: () => void // NEW
): DocumentGenerationResult {
  // ...

  const handleRetry = useCallback(() => {
    // Call reset callback if provided
    if (onRetryReset) {
      onRetryReset();
    }
    startGeneration();
  }, [startGeneration, onRetryReset]);

  // ...
}
```

**Update Loading.tsx**:
```tsx
// Destructure reset functions:
const { messageIndex, isMessageVisible, showQuotes, reset: resetMessages } = useMessageCycle(
  generationState.status === "loading",
  loadingMessages
);

const { quoteIndex, isQuoteVisible, reset: resetQuotes } = useQuoteCycle(
  showQuotes,
  generationState.status === "loading",
  motivationalQuotes.length
);

// Create combined reset:
const handleCycleReset = useCallback(() => {
  resetMessages();
  resetQuotes();
}, [resetMessages, resetQuotes]);

// Pass to generation hook:
const { generationState, showDisclaimer, startGeneration, handleRetry } = useDocumentGeneration(
  tool,
  handleCycleReset
);

// Use handleRetry directly (it now calls the reset):
// Change all handleRetry references to just use the hook's version
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] Retry button resets messages to index 0
- [ ] Retry button resets quotes to index 0
- [ ] Retry button hides quotes
- [ ] Retry button starts generation

**Git Commit**:
```
refactor(loading): add reset functions to cycle hooks and wire up retry (Phase 1 Step 12)
```

---

### Step 13: Fix initial generation trigger and dependency array
**Files Modified**:
- `src/pages/Loading.tsx`

**Update**:
```tsx
// OLD (line 262-264):
// useEffect(() => {
//   startGeneration();
// }, []);

// NEW (with proper deps):
useEffect(() => {
  startGeneration();
}, [startGeneration]);
```

**Add strict mode protection** (optional but recommended):
```tsx
// Alternative with ref to prevent double-call:
const hasStartedRef = useRef(false);

useEffect(() => {
  if (hasStartedRef.current) return;
  hasStartedRef.current = true;
  startGeneration();
}, [startGeneration]);
```

**Verification**:
- [ ] `npm run typecheck` passes (no React warnings)
- [ ] Generation starts on mount
- [ ] In strict mode dev, doesn't fire twice (if using ref)
- [ ] No infinite loop

**Git Commit**:
```
fix(loading): add startGeneration to useEffect deps array (Phase 1 Step 13)
```

---

### Step 14: Add tool param validation utility
**Files Created**:
- `src/pages/loading/utils/validateToolParam.ts`

**Files Modified**:
- `src/pages/Loading.tsx`

**Utility Implementation**:
```tsx
import { ToolType } from "@/lib/formState";

const VALID_TOOL_TYPES: ToolType[] = ["narrative", "response-letter"];

export function validateToolParam(param: string | null): ToolType {
  if (param && VALID_TOOL_TYPES.includes(param as ToolType)) {
    return param as ToolType;
  }
  return "narrative";
}
```

**Update Loading.tsx**:
```tsx
// Add import:
import { validateToolParam } from "./utils/validateToolParam";

// OLD (line 78):
// const tool = (params.get("tool") as ToolType) || "narrative";

// NEW:
const tool = validateToolParam(params.get("tool"));
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `/loading?tool=narrative` works
- [ ] `/loading?tool=response-letter` works
- [ ] `/loading?tool=invalid` defaults to "narrative"
- [ ] `/loading` defaults to "narrative"

**Git Commit**:
```
refactor(loading): add tool param validation utility (Phase 1 Step 14)
```

---

### Step 15: Create index.tsx and finalize structure
**Files Created**:
- `src/pages/loading/index.tsx`

**Files Modified**:
- `src/pages/Loading.tsx` → Move to `src/pages/loading/index.tsx`
- Update any imports in app routing (if needed)

**Final index.tsx**:
```tsx
import { useSearch, useLocation } from "wouter";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { DisclaimerModal } from "@/components/disclaimer/DisclaimerModal";
import { useMessageCycle } from "./hooks/useMessageCycle";
import { useQuoteCycle } from "./hooks/useQuoteCycle";
import { useDocumentGeneration } from "./hooks/useDocumentGeneration";
import { LoadingView } from "./sections/LoadingView";
import { ErrorView } from "./sections/ErrorView";
import { validateToolParam } from "./utils/validateToolParam";
import { loadingMessages, motivationalQuotes } from "./data/loadingContent";
import "./styles/loading.css";
import "./styles/error.css";
import { useEffect, useCallback } from "react";

export default function Loading() {
  // Register this page as protected from navigation
  useProtectedPage();

  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = validateToolParam(params.get("tool"));

  // Message cycle hook
  const { messageIndex, isMessageVisible, showQuotes, reset: resetMessages } = useMessageCycle(
    generationState.status === "loading",
    loadingMessages
  );

  // Quote cycle hook
  const { quoteIndex, isQuoteVisible, reset: resetQuotes } = useQuoteCycle(
    showQuotes,
    generationState.status === "loading",
    motivationalQuotes.length
  );

  // Combined reset for retry
  const handleCycleReset = useCallback(() => {
    resetMessages();
    resetQuotes();
  }, [resetMessages, resetQuotes]);

  // Document generation hook
  const { generationState, showDisclaimer, startGeneration, handleRetry } = useDocumentGeneration(
    tool,
    handleCycleReset
  );

  // Start generation on mount
  useEffect(() => {
    startGeneration();
  }, [startGeneration]);

  // Handlers
  const handleGoBack = useCallback(() => {
    navigate(`/form?tool=${tool}`);
  }, [navigate, tool]);

  const handleDisclaimerContinue = () => {
    navigate(`/results?tool=${tool}`);
  };

  // Render error view
  if (generationState.status === "error") {
    return (
      <ErrorView
        errorMessage={generationState.error?.message}
        retryCount={generationState.retryCount}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    );
  }

  // Render loading view
  return (
    <>
      <LoadingView
        messageIndex={messageIndex}
        isMessageVisible={isMessageVisible}
        quoteIndex={quoteIndex}
        isQuoteVisible={isQuoteVisible}
        showQuotes={showQuotes}
      />
      <DisclaimerModal
        open={showDisclaimer}
        onContinue={handleDisclaimerContinue}
      />
    </>
  );
}
```

**Move file**:
```bash
# Create new index.tsx with final content
# Delete old Loading.tsx
rm src/pages/Loading.tsx
```

**Update routing if needed** (check wouter config):
```tsx
// Should auto-resolve:
// /loading → src/pages/loading/index.tsx
```

**Verification**:
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] `npm run dev` - full loading flow works
- [ ] All imports resolve correctly
- [ ] Routing still works

**Git Commit**:
```
refactor(loading): finalize modular structure with index.tsx (Phase 1 Step 15)
```

---

### Step 16: Clean up unused imports and verify parity
**Files Modified**:
- All refactored files

**Tasks**:
1. Remove unused imports from all files
2. Verify no `any` types introduced
3. Run full typecheck
4. Run full build
5. Manual parity testing

**Verification Checklist**:
- [ ] `npm run typecheck` passes with no warnings
- [ ] `npm run build` succeeds
- [ ] No console errors in dev mode
- [ ] No unused imports (check with linter)

**Manual Parity Testing**:
- [ ] Loading page renders
- [ ] Orb breathes at correct rate
- [ ] Ink blobs animate
- [ ] Messages cycle: 2s display, 300ms fade
- [ ] Quotes appear after last message
- [ ] Quotes cycle: 3s interval, 300ms fade
- [ ] Disclaimer appears after success
- [ ] Click continue → navigates to results
- [ ] Error state: trigger and verify UI
- [ ] Error state: retry button works
- [ ] Error state: go back button works
- [ ] Error state: retryCount > 2 shows extra message
- [ ] Mobile: test on iOS Safari if possible
- [ ] Silent retry: check console logs

**Visual Checks**:
- [ ] Loading background gradient matches
- [ ] Error background gradient matches
- [ ] All colors identical
- [ ] All spacing identical
- [ ] All animations identical
- [ ] Font families match (serif/sans)

**Git Commit**:
```
refactor(loading): remove unused imports and verify parity (Phase 1 Step 16)
```

---

## 7. Verification Checklist (Post-Implementation)

### Build & Type Safety
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] `npm run dev` runs without errors
- [ ] No console warnings or errors

### Loading View Parity
- [ ] Loading message timing: 2000ms display, 300ms fade
- [ ] Message sequence: "Analyzing..." → "Preparing..." → "Almost there..."
- [ ] Quotes appear after last message
- [ ] Quote timing: 3000ms interval, 300ms fade
- [ ] Quote wraps back to first after last
- [ ] Orb breathing animation rate unchanged
- [ ] Ink blobs animate with correct delays (0s, 3s, 6s)
- [ ] Ripple rings animate with correct delays (0s, 1.7s, 3.4s)
- [ ] Background gradient matches original
- [ ] All colors identical
- [ ] All spacing identical
- [ ] Heading gradient text "story" renders correctly
- [ ] Decorative divider under heading
- [ ] "This usually takes just a few moments" text at bottom

### Error View Parity
- [ ] Error view renders when generation fails
- [ ] Error icon pulses (error-pulse-glow animation)
- [ ] Floating shapes animate (error-float)
- [ ] Error message displays correctly
- [ ] Reassurance card shows
- [ ] Retry button works and spins icon on hover
- [ ] Go Back button works and translates arrow on hover
- [ ] Conditional message appears when retryCount > 2
- [ ] Background gradient matches original
- [ ] All colors identical
- [ ] All spacing identical

### Generation Logic Parity
- [ ] Silent retry behavior works (maxAttempts=2)
- [ ] Mobile detection works (90s timeout)
- [ ] Desktop timeout (60s)
- [ ] Storage verification on mobile (150ms delay)
- [ ] Error type detection (network/timeout/server/unknown)
- [ ] Navigation to form if no persisted data
- [ ] Navigation to results after success
- [ ] Disclaimer modal appears after success
- [ ] Console logs unchanged

### Accessibility Parity
- [ ] aria-labelledby on loading section
- [ ] aria-labelledby on error section
- [ ] aria-live="polite" on loading message
- [ ] aria-hidden="true" on quotes section
- [ ] aria-hidden="true" on icons
- [ ] All data-testid preserved:
  - [ ] text-loading-message
  - [ ] text-motivational-quote
  - [ ] text-quote-author
  - [ ] text-error-message
  - [ ] button-retry
  - [ ] button-go-back

### Bug Fixes Verification
- [ ] No timer warnings on unmount
- [ ] Message cycle cleanup works
- [ ] Quote cycle cleanup works
- [ ] Dependency array correct (no React warnings)
- [ ] Strict mode doesn't cause double-generation

### Browser/Device Testing
- [ ] Desktop Chrome: loading + error flows work
- [ ] Desktop Firefox: loading + error flows work
- [ ] Desktop Safari: loading + error flows work
- [ ] Mobile Safari (if available): test storage verification
- [ ] Mobile Chrome (if available): test timeouts

---

## 8. Success Criteria

Phase 1 is complete when:

1. **All 16 steps implemented and committed**
2. **Zero visual changes** - pixel-perfect match to original
3. **Zero behavioral changes** - timing, logic, flow identical
4. **All bugs fixed** - timer cleanup, dependency arrays
5. **All verification checks pass**
6. **No TypeScript errors or warnings**
7. **Build succeeds**
8. **Manual testing confirms parity**

---

## 9. What Comes Next (Phase 2 - Out of Scope)

Phase 2 will address:
- Converting inline styles to CSS classes where safe
- Simplifying API structure if needed
- Performance optimizations
- Removing workaround code (silent retry) if root causes fixed
- Additional DRY improvements

**Phase 1 does NOT include these changes.**

---

## 10. Final Notes

- Each step is atomic and can be tested independently
- Git commits allow reverting any step if issues arise
- Parity checks are mandatory at each step
- If any step fails parity, revert and investigate
- Do not proceed to next step until current step passes all checks
- If you discover new complexity, update this plan before proceeding

---

**Awaiting Approval**: Say "Proceed with Step 1" to begin implementation.
