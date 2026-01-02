# Results Page Refactor - Planning Document

**Created**: 2026-01-01
**Status**: Planning Phase
**Target**: Refactor `src/pages/Results.tsx` to be cleaner, more modular, and maintainable

---

## 1. Current State Assessment

### What Results.tsx Currently Does

The Results page (`client/src/pages/Results.tsx`, **720 lines**) is responsible for:

1. **Loading persisted results with retry logic** (lines 208-261)
   - Attempts to load results from sessionStorage up to 5 times with exponential backoff
   - Redirects to home if all retries exhausted
   - Sets initial active tab based on tool type and what was generated

2. **Managing complex state** (lines 174-198)
   - Narratives and response letter data
   - Generation status and errors
   - Active tab selection
   - Regeneration state (per narrative type + letter)
   - Regeneration counts and errors
   - Loading state with attempt counter
   - Exit modal state and destination

3. **Handling regeneration** (lines 311-408)
   - Loading form data for regeneration requests
   - Cleaning form data (removing currentStep/errors)
   - Calling regeneration APIs
   - Updating local state and persisted results
   - Managing regeneration counts per sessionId
   - Displaying toast notifications
   - Tracking per-narrative and per-letter errors

4. **Exit/navigation flow** (lines 269-296)
   - Modal confirmation before leaving page
   - Clearing all storage (form, results, regeneration counts)
   - Supporting multiple exit destinations (home, FAQ)

5. **Rendering multiple UI sections**
   - Disclaimer card (lines 437-497) - ~60 lines
   - Hero section (lines 507-525)
   - Document switcher + content panels (lines 527-586)
   - Actions panel (download all, start over, learn more) (lines 588-625)
   - Two-column footer with guidance + donate CTA (lines 628-704)
   - ResultsGuidanceSection component (lines 28-163) - **135 lines**

6. **Document actions**
   - Copy/download individual narratives and letters
   - Download all documents as combined PDF
   - Delegated to `useDocumentActions` hook

### Main Pain Points

1. **File length**: 720 lines is difficult to navigate and maintain
2. **Mixed concerns**: Loading logic, regeneration logic, UI rendering, and exit flow all in one file
3. **Large state surface area**: 14+ state variables at the top level
4. **Duplicated patterns**: Similar error handling and toast patterns repeated
5. **Large handlers**: `handleRegenerateNarrative` and `handleRegenerateLetter` are nearly identical
6. **Embedded JSX blocks**: The disclaimer card, hero, and guidance sections are large inline blocks
7. **Testing difficulty**: Hard to test individual concerns in isolation

---

## 2. Target Architecture (Proposed End State)

### File Structure

Following the existing repo patterns (`home/`, `loading/`, `selection/`), we'll create a modular structure:

```
client/src/pages/
├── Results.tsx                           # Lightweight main page (KEEP HERE for routing)
└── results/
    ├── hooks/
    │   ├── useResultsLoader.ts           # Load-with-retry logic + initial tab selection
    │   ├── useResultsRegeneration.ts     # Regeneration for narratives + letter
    │   └── useResultsExitActions.ts      # Exit modal + navigation + storage clearing
    ├── sections/
    │   ├── ResultsDisclaimerCard.tsx     # Disclaimer UI (lines 437-497)
    │   ├── ResultsHero.tsx               # Hero section (lines 507-525)
    │   ├── ResultsDocumentsSection.tsx   # Switcher + panels + empty states (lines 527-586)
    │   ├── ResultsActionsPanel.tsx       # Download all + start over + learn more (lines 588-625)
    │   ├── ResultsGuidanceSection.tsx    # How to use guidance (currently lines 28-163)
    │   └── ResultsDonateCTA.tsx          # Donation card (lines 637-702)
    └── utils/                            # (Optional, if needed)
        └── formDataCleaner.ts            # Extract { currentStep, errors, ...rest } logic
```

### Hook Responsibilities

#### 1. `useResultsLoader.ts`

**Purpose**: Encapsulate the load-with-retry logic and initial state setup.

**Returns**:
```typescript
{
  isLoading: boolean;
  loadAttempts: number;
  narratives: NarrativeItem[];
  responseLetter: ResponseLetter | null;
  status: GenerationResult["status"];
  errors: DocumentError[];
  sessionId: string;
  regenCounts: RegenerationCounts | null;
  activeTab: DocumentTab;
  setActiveTab: (tab: DocumentTab) => void;
  setNarratives: (narratives: NarrativeItem[]) => void;
  setResponseLetter: (letter: ResponseLetter | null) => void;
  setStatus: (status: GenerationResult["status"]) => void;
  setErrors: (errors: DocumentError[]) => void;
  setRegenCounts: (counts: RegenerationCounts | null) => void;
}
```

**Implementation Details**:
- Runs load-with-retry logic in `useEffect` (from current lines 208-261)
- Manages `isLoading` and `loadAttempts` state
- Loads results and regeneration counts
- Determines initial `activeTab` based on tool param and what was generated
- Redirects to home if all retries exhausted
- Exposes state setters for regeneration hook to update results

**Edge Cases**:
- React 18 strict mode double-invoke (already handled by retry logic)
- Results missing after max retries → redirect home
- Tool param mismatch with persisted results → respect persisted tool type

---

#### 2. `useResultsRegeneration.ts`

**Purpose**: Encapsulate all regeneration logic for both narratives and letters.

**Returns**:
```typescript
{
  // Narrative regeneration
  handleRegenerateNarrative: (type: NarrativeType) => Promise<void>;
  regeneratingType: NarrativeType | null;
  narrativeErrors: Record<NarrativeType, string | null>;

  // Letter regeneration
  handleRegenerateLetter: () => Promise<void>;
  isLetterRegenerating: boolean;
  letterError: string | null;
}
```

**Implementation Details**:
- Accepts result state + setters from `useResultsLoader`
- Loads and cleans form data (strip `currentStep`, `errors`)
- Calls `regenerateNarrative` or `regenerateLetter` APIs
- Updates local state (narratives/letter)
- Persists updated results via `updateResults()`
- Updates regeneration counts via `incrementNarrativeCount`/`incrementLetterCount`
- Saves counts via `saveRegenerationCounts()`
- Shows identical toast messages as current implementation
- Handles errors identically to current implementation

**Edge Cases**:
- Form data missing → show toast "Form data is no longer available. Please start over."
- API errors → store in `narrativeErrors` or `letterError`, don't show toast
- Success → show success toast with same wording

---

#### 3. `useResultsExitActions.ts`

**Purpose**: Encapsulate exit modal flow and storage clearing.

**Returns**:
```typescript
{
  exitModalOpen: boolean;
  exitDestination: "home" | "faq" | null;
  handleStartOver: () => void;
  handleLearnMoreClick: () => void;
  handleConfirmExit: () => void;
  handleCancelExit: () => void;
}
```

**Implementation Details**:
- Manages `exitModalOpen` and `exitDestination` state
- `handleStartOver` → clears storage + navigates to "/"
- `handleLearnMoreClick` → sets destination "faq" + opens modal
- `handleConfirmExit` → clears storage + navigates to destination
- `handleCancelExit` → closes modal + resets destination
- Uses `clearFormData()`, `clearResults()`, `clearRegenerationCounts()`

---

### Section Component Responsibilities

#### 1. `ResultsDisclaimerCard.tsx`

**Props**: None (pure UI)

**Content**: The disclaimer card (lines 437-497)

**Notes**:
- Preserve all classNames, `data-testid`, inline styles verbatim
- Self-contained section component

---

#### 2. `ResultsHero.tsx`

**Props**: None (pure UI)

**Content**: Hero section (lines 507-525)

**Notes**:
- Preserve `id="results-heading"` for accessibility
- Preserve all animation classes

---

#### 3. `ResultsDocumentsSection.tsx`

**Props**:
```typescript
{
  tool: ToolType;
  narratives: NarrativeItem[];
  responseLetter: ResponseLetter | null;
  activeTab: DocumentTab;
  onTabChange: (tab: DocumentTab) => void;
  onCopyNarrative: (narrative: NarrativeItem) => void;
  onDownloadNarrative: (narrative: NarrativeItem) => void;
  onCopyLetter: (letter: ResponseLetter) => void;
  onDownloadLetter: (letter: ResponseLetter) => void;
  onRegenerateNarrative: (type: NarrativeType) => Promise<void>;
  onRegenerateLetter: () => Promise<void>;
  regeneratingType: NarrativeType | null;
  isLetterRegenerating: boolean;
  regenCounts: RegenerationCounts | null;
  narrativeErrors: Record<NarrativeType, string | null>;
  letterError: string | null;
}
```

**Content**:
- DocumentSwitcher (if hasBoth)
- NarrativeCarousel (if showing narratives)
- ResponseLetterPanel (if showing letter)
- Empty state cards (if no content)

**Notes**:
- Preserve `data-testid` attributes
- Encapsulates lines 527-586 logic

---

#### 4. `ResultsActionsPanel.tsx`

**Props**:
```typescript
{
  hasNarratives: boolean;
  hasLetter: boolean;
  onDownloadAll: () => void;
  onStartOver: () => void;
  onLearnMore: () => void;
}
```

**Content**: Lines 588-625 (download all button + start over/learn more panel)

**Notes**:
- Preserve `data-testid` attributes

---

#### 5. `ResultsGuidanceSection.tsx`

**Props**:
```typescript
{
  hasNarratives: boolean;
  hasLetter: boolean;
  activeResultType: "narratives" | "letter";
}
```

**Content**: Currently lines 28-163 (already a separate component, just move to sections/)

**Notes**:
- Already well-structured, just relocate
- Preserve all `data-testid` attributes

---

#### 6. `ResultsDonateCTA.tsx`

**Props**: None (pure UI)

**Content**: Donation card section (lines 637-702)

**Notes**:
- Preserve all animation classes and styles

---

### Utility Functions (Optional)

#### `utils/formDataCleaner.ts`

**Purpose**: Extract the repeated pattern of cleaning form data.

```typescript
export function cleanFormDataForRegeneration(
  formData: PersistedFormData | null
): FormState | null {
  if (!formData) return null;
  const { currentStep, errors, ...cleanData } = formData.formState;
  return cleanData as FormState;
}
```

**Usage**: Both narrative and letter regeneration handlers use this

**Note**: Only create if it reduces duplication meaningfully

---

## 3. Detailed Step-by-Step Plan

### Phase 1: Setup and Infrastructure

#### **Step 1: Create folder structure**

**Action**:
```bash
mkdir -p client/src/pages/results/hooks
mkdir -p client/src/pages/results/sections
mkdir -p client/src/pages/results/utils
```

**Files created**: Folders only

**Verify**: Folders exist in file system

---

#### **Step 2: Extract ResultsGuidanceSection to sections/**

**Action**:
- Copy lines 28-163 from `Results.tsx` into new file `client/src/pages/results/sections/ResultsGuidanceSection.tsx`
- Add proper imports (React, icons, Card components)
- Export as default
- Update `Results.tsx` to import from `./results/sections/ResultsGuidanceSection`
- Remove original lines 28-163

**Files modified**:
- `client/src/pages/Results.tsx`

**Files created**:
- `client/src/pages/results/sections/ResultsGuidanceSection.tsx`

**Verify**:
- Build passes (`npm run build` or typecheck)
- Results page still renders guidance section correctly
- No visual regressions

---

### Phase 2: Extract Custom Hooks

#### **Step 3: Create useResultsLoader hook**

**Action**:
- Create `client/src/pages/results/hooks/useResultsLoader.ts`
- Move load-with-retry logic (lines 208-261) into this hook
- Move related state: `isLoading`, `loadAttempts`, `narratives`, `responseLetter`, `status`, `errors`, `sessionId`, `regenCounts`, `activeTab`
- Import and use in `Results.tsx`
- Remove duplicated state and logic from `Results.tsx`

**Files created**:
- `client/src/pages/results/hooks/useResultsLoader.ts`

**Files modified**:
- `client/src/pages/Results.tsx`

**Verify**:
- Build passes
- Results page still loads correctly after generation
- Retry logic still works (test by clearing sessionStorage manually)
- Redirects to home if no results after max retries
- Active tab selection still works correctly based on tool param

---

#### **Step 4: Create useResultsExitActions hook**

**Action**:
- Create `client/src/pages/results/hooks/useResultsExitActions.ts`
- Move exit modal state and handlers (lines 269-296, 197-198)
- Import and use in `Results.tsx`
- Remove duplicated state and logic from `Results.tsx`

**Files created**:
- `client/src/pages/results/hooks/useResultsExitActions.ts`

**Files modified**:
- `client/src/pages/Results.tsx`

**Verify**:
- Build passes
- "Start Over" button works
- "Learn More" button triggers modal
- Modal confirm clears storage and navigates
- Modal cancel closes modal without action

---

#### **Step 5: Create useResultsRegeneration hook**

**Action**:
- Create `client/src/pages/results/hooks/useResultsRegeneration.ts`
- Move regeneration logic (lines 311-408)
- Move related state: `regeneratingType`, `isLetterRegenerating`, `narrativeErrors`, `letterError`
- Accept result state + setters from `useResultsLoader` as parameters
- Import and use in `Results.tsx`
- Remove duplicated state and logic from `Results.tsx`

**Files created**:
- `client/src/pages/results/hooks/useResultsRegeneration.ts`

**Files modified**:
- `client/src/pages/Results.tsx`

**Verify**:
- Build passes
- Narrative regeneration works (test with each type)
- Letter regeneration works
- Success toasts appear with correct messaging
- Regeneration counts persist correctly
- Errors display correctly in UI
- "Form data is no longer available" toast appears if form data missing

---

### Phase 3: Extract UI Section Components

#### **Step 6: Extract ResultsDisclaimerCard**

**Action**:
- Create `client/src/pages/results/sections/ResultsDisclaimerCard.tsx`
- Move disclaimer card JSX (lines 437-497)
- Import in `Results.tsx` and replace inline JSX
- Remove original lines

**Files created**:
- `client/src/pages/results/sections/ResultsDisclaimerCard.tsx`

**Files modified**:
- `client/src/pages/Results.tsx`

**Verify**:
- Build passes
- Disclaimer card renders identically
- No CSS regressions

---

#### **Step 7: Extract ResultsHero**

**Action**:
- Create `client/src/pages/results/sections/ResultsHero.tsx`
- Move hero section JSX (lines 507-525)
- Import in `Results.tsx` and replace inline JSX

**Files created**:
- `client/src/pages/results/sections/ResultsHero.tsx`

**Files modified**:
- `client/src/pages/Results.tsx`

**Verify**:
- Build passes
- Hero section renders identically
- Animation timing preserved

---

#### **Step 8: Extract ResultsDocumentsSection**

**Action**:
- Create `client/src/pages/results/sections/ResultsDocumentsSection.tsx`
- Move document switcher + panels logic (lines 527-586)
- Accept all necessary props (see Target Architecture)
- Import in `Results.tsx` and replace inline JSX

**Files created**:
- `client/src/pages/results/sections/ResultsDocumentsSection.tsx`

**Files modified**:
- `client/src/pages/Results.tsx`

**Verify**:
- Build passes
- Tab switcher works
- Narratives display correctly
- Letter displays correctly
- Empty states display when appropriate
- Copy/download/regenerate actions work
- `data-testid` attributes preserved

---

#### **Step 9: Extract ResultsActionsPanel**

**Action**:
- Create `client/src/pages/results/sections/ResultsActionsPanel.tsx`
- Move actions panel JSX (lines 588-625)
- Accept props for handlers and visibility
- Import in `Results.tsx` and replace inline JSX

**Files created**:
- `client/src/pages/results/sections/ResultsActionsPanel.tsx`

**Files modified**:
- `client/src/pages/Results.tsx`

**Verify**:
- Build passes
- "Download All Documents" button works
- "Start Over" button works
- "Learn More" button works
- `data-testid` attributes preserved

---

#### **Step 10: Extract ResultsDonateCTA**

**Action**:
- Create `client/src/pages/results/sections/ResultsDonateCTA.tsx`
- Move donation card JSX (lines 637-702)
- Import in `Results.tsx` and replace inline JSX

**Files created**:
- `client/src/pages/results/sections/ResultsDonateCTA.tsx`

**Files modified**:
- `client/src/pages/Results.tsx`

**Verify**:
- Build passes
- Donation card renders identically
- Link to /donate works
- Animation preserved

---

### Phase 4: Final Cleanup

#### **Step 11: Verify Results.tsx is clean and minimal**

**Action**:
- Review `Results.tsx` to ensure it's now just:
  - Hook calls
  - Conditional rendering (loading state)
  - Section component composition
- Verify no duplicated logic remains
- Verify all imports are used
- Remove any dead code

**Files modified**:
- `client/src/pages/Results.tsx`

**Verify**:
- Build passes
- File is significantly smaller (target: <200 lines)
- Easy to read and understand at a glance

---

#### **Step 12: Create index.ts barrel export (optional)**

**Action**:
- Create `client/src/pages/results/index.ts` to re-export hooks and sections if desired
- This is optional and only for convenience

**Files created** (optional):
- `client/src/pages/results/index.ts`

**Verify**:
- Build passes
- Imports can be simplified if barrel export used

---

#### **Step 13: Full regression testing**

**Action**:
- Manually test the entire Results page flow:
  1. Generate narratives → verify Results page loads
  2. Generate letter → verify Results page loads
  3. Generate both → verify Results page loads, tab switcher appears
  4. Test retry loading (clear sessionStorage mid-load)
  5. Test all copy actions
  6. Test all download actions
  7. Test all regeneration actions (narratives + letter)
  8. Test regeneration errors
  9. Test regeneration count limits
  10. Test "Start Over" flow
  11. Test "Learn More" flow + modal
  12. Test exit confirmation modal
  13. Verify all `data-testid` attributes present

**Files modified**: None

**Verify**: All features work identically to before refactor

---

#### **Step 14: Update documentation**

**Action**:
- Update `CLAUDE.md` to reflect new Results page structure
- Add entry to frontend refactoring section

**Files modified**:
- `CLAUDE.md`

**Verify**:
- Documentation is accurate

---

## 4. Validation Checklist

After completing all steps, verify:

### Functionality
- [ ] Results page loads properly after generation
- [ ] Retry loading logic works and redirects home if exhausted
- [ ] Tool routing (query param) selects correct initial tab
- [ ] Tab switcher works when both narratives and letter present
- [ ] Download/copy actions work for narratives
- [ ] Download/copy actions work for letter
- [ ] Download all documents works
- [ ] Regeneration works for each narrative type
- [ ] Regeneration works for letter
- [ ] Regeneration counts persist per sessionId
- [ ] Regeneration success toasts appear with correct messaging
- [ ] Regeneration errors display correctly
- [ ] "Form data is no longer available" toast appears if form data missing
- [ ] LeaveConfirmationModal blocks navigation
- [ ] Modal confirm clears storage (form, results, regen counts)
- [ ] Modal cancel keeps user on page
- [ ] "Start Over" button works
- [ ] "Learn More" button triggers modal and navigates to FAQ

### Code Quality
- [ ] `Results.tsx` is substantially smaller (target: <200 lines)
- [ ] All hooks are in dedicated files
- [ ] All section components are in dedicated files
- [ ] No duplicated logic
- [ ] TypeScript builds without errors
- [ ] All imports are used
- [ ] No dead code remains

### UI/UX
- [ ] No visual regressions
- [ ] All animations preserved
- [ ] All `data-testid` attributes preserved
- [ ] All classNames preserved
- [ ] Responsive design still works

### Testing
- [ ] Can test hooks in isolation
- [ ] Can test section components in isolation
- [ ] Clear separation of concerns

---

## 5. Notes on Risk / Edge Cases

### 1. Query tool param vs persisted tool mismatch

**Risk**: User navigates to `/results?tool=narrative` but persisted results have `tool: "both"`

**Mitigation**: `useResultsLoader` should respect the persisted tool type from results, not the query param. The query param is only used for initial navigation context. The tab selection logic (lines 232-237) already handles this correctly.

---

### 2. Results missing on first load (timing issue)

**Risk**: Results not yet persisted when Results page loads

**Mitigation**: The retry logic with exponential backoff (current implementation) handles this. Preserve the exact retry logic in `useResultsLoader`.

---

### 3. Stale form data during regeneration

**Risk**: User refreshes page, form data is cleared from localStorage but results remain in sessionStorage

**Mitigation**: Already handled by existing code (lines 312-320) - shows toast "Form data is no longer available. Please start over." Preserve this exact behavior in `useResultsRegeneration`.

---

### 4. Keeping toast behavior identical

**Risk**: Regeneration toasts might differ in wording or timing

**Mitigation**:
- Copy exact toast call signatures from current implementation
- Current success messages:
  - Narrative: `"Narrative regenerated"` / `"Your narrative has been updated with a fresh version."`
  - Letter: `"Letter regenerated"` / `"Your response letter has been updated with a fresh version."`
- Current error messages:
  - Form data missing: `"Unable to regenerate"` / `"Form data is no longer available. Please start over."`
  - API errors are stored in state, not toasted

---

### 5. React 18 strict mode double-invoke

**Risk**: `useEffect` in `useResultsLoader` runs twice in development

**Mitigation**: The retry logic already handles this naturally - if results load on first attempt, subsequent attempts bail early. The current implementation doesn't use a `hasStartedRef` guard (unlike Loading page), so we should preserve that approach for consistency.

---

### 6. Regeneration counts not syncing

**Risk**: Multiple regenerations in quick succession might cause race conditions with counts

**Mitigation**: Current implementation uses synchronous sessionStorage writes, which don't have race conditions. Each regeneration:
1. Loads current counts (or uses in-memory `regenCounts`)
2. Increments
3. Saves
4. Updates state

Preserve this exact flow in `useResultsRegeneration`.

---

### 7. Exit modal destination state

**Risk**: User clicks "Learn More", then closes modal - destination state might be stale

**Mitigation**: `handleCancelExit` already resets `exitDestination` to null (line 295). Preserve this behavior in `useResultsExitActions`.

---

### 8. PartialFailureAlert timing

**Risk**: The `isRetrying` state for partial failures might not clear properly

**Mitigation**: Current implementation uses `setTimeout(() => setIsRetrying(false), 1000)` (line 308). This is a placeholder (actual retry not implemented). Preserve this exact behavior for now - leave as-is unless explicitly changed.

---

## 6. Expected Final State

After all steps are complete:

### `Results.tsx` (target: ~150-200 lines)

```typescript
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { useDocumentActions } from "@/hooks/useDocumentActions";
import { useResultsLoader } from "./results/hooks/useResultsLoader";
import { useResultsRegeneration } from "./results/hooks/useResultsRegeneration";
import { useResultsExitActions } from "./results/hooks/useResultsExitActions";
import { ResultsDisclaimerCard } from "./results/sections/ResultsDisclaimerCard";
import { ResultsHero } from "./results/sections/ResultsHero";
import { ResultsDocumentsSection } from "./results/sections/ResultsDocumentsSection";
import { ResultsActionsPanel } from "./results/sections/ResultsActionsPanel";
import { ResultsGuidanceSection } from "./results/sections/ResultsGuidanceSection";
import { ResultsDonateCTA } from "./results/sections/ResultsDonateCTA";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";
import { PartialFailureAlert } from "@/components/results/PartialFailureAlert";
import { Loader2 } from "lucide-react";

export default function Results() {
  useProtectedPage();

  // Load results with retry
  const {
    isLoading,
    loadAttempts,
    narratives,
    responseLetter,
    status,
    errors,
    sessionId,
    regenCounts,
    activeTab,
    setActiveTab,
    setNarratives,
    setResponseLetter,
    setStatus,
    setErrors,
    setRegenCounts,
  } = useResultsLoader();

  // Regeneration logic
  const {
    handleRegenerateNarrative,
    regeneratingType,
    narrativeErrors,
    handleRegenerateLetter,
    isLetterRegenerating,
    letterError,
  } = useResultsRegeneration({
    sessionId,
    narratives,
    setNarratives,
    responseLetter,
    setResponseLetter,
    status,
    errors,
    regenCounts,
    setRegenCounts,
  });

  // Exit actions
  const {
    exitModalOpen,
    handleStartOver,
    handleLearnMoreClick,
    handleConfirmExit,
    handleCancelExit,
  } = useResultsExitActions();

  // Document actions
  const {
    handleCopyNarrative,
    handleCopyLetter,
    handleDownloadNarrative,
    handleDownloadLetter,
    handleDownloadAll,
  } = useDocumentActions();

  // Derived state
  const hasNarratives = narratives.length > 0;
  const hasLetter = responseLetter !== null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            Loading your results{loadAttempts > 0 ? ` (attempt ${loadAttempts + 1})` : ''}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden">
        {/* Paper texture + decorative corners */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <ResultsDisclaimerCard />

          {status === "partial_fail" && errors.length > 0 && (
            <PartialFailureAlert errors={errors} onRetry={() => {}} isRetrying={false} />
          )}

          <ResultsHero />

          <ResultsDocumentsSection
            narratives={narratives}
            responseLetter={responseLetter}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasNarratives={hasNarratives}
            hasLetter={hasLetter}
            onCopyNarrative={handleCopyNarrative}
            onDownloadNarrative={handleDownloadNarrative}
            onCopyLetter={handleCopyLetter}
            onDownloadLetter={handleDownloadLetter}
            onRegenerateNarrative={handleRegenerateNarrative}
            onRegenerateLetter={handleRegenerateLetter}
            regeneratingType={regeneratingType}
            isLetterRegenerating={isLetterRegenerating}
            regenCounts={regenCounts}
            narrativeErrors={narrativeErrors}
            letterError={letterError}
          />

          <ResultsActionsPanel
            hasNarratives={hasNarratives}
            hasLetter={hasLetter}
            onDownloadAll={() => handleDownloadAll(narratives, responseLetter)}
            onStartOver={handleStartOver}
            onLearnMore={handleLearnMoreClick}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12 mb-8">
            <ResultsGuidanceSection
              hasNarratives={hasNarratives}
              hasLetter={hasLetter}
              activeResultType={activeTab}
            />
            <ResultsDonateCTA />
          </div>
        </div>
      </section>

      <LeaveConfirmationModal
        open={exitModalOpen}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        title="Before you leave this page"
        description="Don't forget to copy or download your results before you leave..."
        warning="⚠️ Make sure you've saved your documents before leaving."
        confirmText="Leave anyway"
        cancelText="Stay on this page"
      />
    </>
  );
}
```

### File Count
- **Before**: 1 file (720 lines)
- **After**: 10 files (~80-100 lines each on average)

### Benefits
- ✅ Easier to read and understand
- ✅ Easier to test individual concerns
- ✅ Easier to modify without breaking other parts
- ✅ Follows established repo patterns
- ✅ Maintains all existing functionality
- ✅ No breaking changes to routes or external APIs

---

## End of Planning Document

**Next step**: Await user approval to proceed with Step 1.
