# Form.tsx Phase 1 Parity Refactor Plan

**Version**: 1.0
**Created**: 2026-01-01
**Target File**: `src/pages/Form.tsx`
**Objective**: Modularize Form.tsx while guaranteeing ZERO visual/behavioral change

---

## Overview

This document provides a step-by-step plan to refactor `src/pages/Form.tsx` following the "visual parity first" approach successfully used for Home.tsx and Selection.tsx. The refactor will extract presentational components, business logic, and styles into a modular structure while maintaining **pixel-perfect visual and behavioral parity** with the current implementation.

**Phase 1 Goal**: Create a clean, modular architecture with no user-facing changes whatsoever.

**Phase 2 Goal** (separate, do not execute): Optional enhancements like cleanup, optimization, and improved typing.

---

## Current Responsibilities in Form.tsx

The current `Form.tsx` component (153 lines) handles:

1. **Protected Page Registration**: Calls `useProtectedPage()` to register navigation protection
2. **Routing & Query Parsing**:
   - Extracts `tool` query parameter from URL via `useSearch()`
   - Parses parameter with fallback to "narrative" for invalid values
3. **Tool Configuration**:
   - Maintains `toolInfo` lookup object (narrative/responseLetter/both)
   - Derives title, description, and icon based on selected tool
4. **State Restoration**:
   - Loads persisted form data from sessionStorage on mount
   - Only restores if persisted tool matches current URL tool parameter
   - Manages `isRestoring` flag during restoration
   - Clears errors from persisted state before restoring
5. **Form Lifecycle**:
   - Handles form completion via `handleFormComplete`
   - Saves form data to sessionStorage with tool type
   - Scrolls to top of page
   - Navigates to `/loading?tool={tool}`
6. **UI Rendering**:
   - Inline `<style>` block with font families, animations, and delay classes
   - Section with dot-pattern background and decorative corner accents
   - Back to Selection button (Link + Button)
   - Tool header (icon bubble + title + description)
   - FormWizard component with conditional rendering based on `isRestoring`
7. **Accessibility**: Proper ARIA attributes (`aria-labelledby`, `aria-hidden`, `data-testid`)

---

## Target End State (Phase 1 Only)

After Phase 1 completion, `Form.tsx` will be transformed into a **composition-only orchestrator** (~40-50 lines):

```tsx
// Conceptual target structure (not final code)
import { useFormPageController } from "./form/hooks/useFormPageController";
import { BackToSelectionRow } from "./form/sections/BackToSelectionRow";
import { FormToolHeader } from "./form/sections/FormToolHeader";
import "./form/styles/form.css";

export default function Form() {
  const { tool, title, description, Icon, restoredState, isRestoring, handleFormComplete } =
    useFormPageController();

  return (
    <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden" aria-labelledby="form-heading">
      {/* Paper texture and decorative accents remain here */}
      <div className="max-w-2xl mx-auto relative z-10">
        <BackToSelectionRow />
        <FormToolHeader title={title} description={description} Icon={Icon} />
        {!isRestoring && (
          <div className="animate-fadeInUp delay-200 opacity-0">
            <FormWizard
              key={restoredState ? "restored" : "fresh"}
              tool={tool}
              onComplete={handleFormComplete}
              initialState={restoredState}
            />
          </div>
        )}
      </div>
    </section>
  );
}
```

**Key Characteristics**:
- Form.tsx becomes pure composition (imports + render)
- Controller hook owns all logic (restoration, handlers, tool selection)
- Page UI sections extracted into tiny, focused components
- Inline `<style>` block moved to dedicated CSS file
- `toolInfo` constant extracted to data file
- **Zero changes** to DOM structure, classes, styles, or behavior

---

## Proposed File/Folder Structure

Following the pattern established in Home/Selection refactors:

```
src/pages/form/
├── hooks/
│   └── useFormPageController.ts    # Business logic: restoration, handlers, tool selection
├── sections/
│   ├── BackToSelectionRow.tsx      # Back button + Link wrapper
│   └── FormToolHeader.tsx          # Icon bubble + title + description
├── styles/
│   └── form.css                    # Extracted inline styles (fonts, animations)
└── data/
    └── toolInfo.ts                 # Tool configuration lookup object

src/pages/
└── Form.tsx                        # Composition orchestrator (main page file)
```

**Naming Conventions**:
- Hooks: `use` prefix, camelCase filename
- Components: PascalCase, `.tsx` extension
- Data: camelCase, `.ts` extension
- CSS: lowercase, `.css` extension

**Import Paths** (from Form.tsx):
```typescript
import { useFormPageController } from "./form/hooks/useFormPageController";
import { BackToSelectionRow } from "./form/sections/BackToSelectionRow";
import { FormToolHeader } from "./form/sections/FormToolHeader";
import "./form/styles/form.css";
```

---

## Extraction Inventory (What to Extract)

### 1. **Data Constant: `toolInfo`**

**Current Location**: Lines 10-29
**Target File**: `src/pages/form/data/toolInfo.ts`
**Extract Boundary**: Entire `toolInfo` object including type definition

**Current Code**:
```typescript
const toolInfo: Record<
  ToolType,
  { title: string; description: string; icon: typeof FileText }
> = {
  narrative: { title: "Disclosure Narratives", description: "You're creating five personalized disclosure narratives.", icon: FileText },
  responseLetter: { title: "Response Letter", description: "You're creating a pre-adverse action response letter.", icon: Mail },
  both: { title: "Both Documents", description: "You're creating disclosure narratives and a response letter.", icon: Files }
};
```

**New Module Exports**:
```typescript
export const toolInfo: Record<ToolType, { title: string; description: string; icon: typeof FileText }>;
```

**Dependencies**:
- Import: `ToolType` from `@/lib/formState`
- Import: `FileText`, `Mail`, `Files` from `lucide-react`

---

### 2. **Controller Hook: `useFormPageController`**

**Current Location**: Lines 31-62 (logic only, not JSX)
**Target File**: `src/pages/form/hooks/useFormPageController.ts`
**Extract Boundary**: All hooks, state, handlers, and derived values

**Logic to Extract**:
- `useProtectedPage()` call
- `useLocation()` and `useSearch()` for routing
- URL parameter parsing logic
- Tool selection with fallback
- `restoredState` and `isRestoring` state management
- `useEffect` for restoration
- `handleFormComplete` handler

**Hook Signature**:
```typescript
export function useFormPageController() {
  // ... extracted logic ...

  return {
    tool: ToolType,           // Selected tool (with fallback)
    title: string,            // Tool display title
    description: string,      // Tool description text
    Icon: typeof FileText,    // Tool icon component
    restoredState: FormState | undefined,  // Restored form data
    isRestoring: boolean,     // Loading flag during restore
    handleFormComplete: (data: FormState) => void  // Completion handler
  };
}
```

**Dependencies**:
- Import: `useState`, `useEffect` from `react`
- Import: `useLocation`, `useSearch` from `wouter`
- Import: `FormState`, `ToolType` from `@/lib/formState`
- Import: `saveFormData`, `loadFormData` from `@/lib/formPersistence`
- Import: `useProtectedPage` from `@/hooks/useProtectedPage`
- Import: `toolInfo` from `../data/toolInfo`

**Behavior Preservation**:
- Must call `useProtectedPage()` in same position (top of hook)
- Restoration logic must execute identically (same conditions, same effect dependencies)
- `handleFormComplete` must preserve exact same behavior (save, scroll, navigate)

---

### 3. **Component: `BackToSelectionRow`**

**Current Location**: Lines 103-115
**Target File**: `src/pages/form/sections/BackToSelectionRow.tsx`
**Extract Boundary**: Entire `<div>` wrapper including all children

**Current JSX Block**:
```tsx
<div className="mb-6 animate-fadeInUp opacity-0">
  <Link href="/selection">
    <Button
      variant="outline"
      size="sm"
      className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 shadow-sm"
      data-testid="button-back-selection"
    >
      <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
      Back to Selection
    </Button>
  </Link>
</div>
```

**Component Signature**:
```typescript
export function BackToSelectionRow() {
  return (/* exact JSX above */);
}
```

**Props**: None (fully self-contained)

**Dependencies**:
- Import: `Link` from `wouter`
- Import: `Button` from `@/components/ui/button`
- Import: `ArrowLeft` from `lucide-react`

**Verbatim Requirements**:
- Copy entire `<div>` block exactly as-is
- Preserve all className strings (no reordering Tailwind classes)
- Preserve whitespace and text content ("Back to Selection")
- Preserve `data-testid="button-back-selection"`

---

### 4. **Component: `FormToolHeader`**

**Current Location**: Lines 117-136
**Target File**: `src/pages/form/sections/FormToolHeader.tsx`
**Extract Boundary**: Entire outer `<div>` wrapper with all nested children

**Current JSX Block**:
```tsx
<div className="text-center space-y-5 mb-10 animate-fadeInUp delay-100 opacity-0">
  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mx-auto shadow-lg border-2 border-primary/20">
    <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
  </div>

  <div className="space-y-3">
    <h1
      id="form-heading"
      className="text-3xl md:text-4xl font-bold leading-tight text-foreground font-fraunces"
    >
      {title}
    </h1>
    <p
      className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-manrope"
      data-testid="text-tool-description"
    >
      {description}
    </p>
  </div>
</div>
```

**Component Signature**:
```typescript
import { FileText } from "lucide-react";

interface FormToolHeaderProps {
  title: string;
  description: string;
  Icon: typeof FileText;
}

export function FormToolHeader({ title, description, Icon }: FormToolHeaderProps) {
  return (/* exact JSX above */);
}
```

**Props**:
- `title: string` - Tool display title (e.g., "Disclosure Narratives")
- `description: string` - Tool description text
- `Icon: typeof FileText` - Lucide icon component to render

**Dependencies**:
- Import: `FileText` from `lucide-react` (for type definition only)

**Verbatim Requirements**:
- Copy entire outer `<div>` block exactly
- Preserve all className strings (no reordering)
- Preserve text interpolation: `{title}`, `{description}`, `<Icon />`
- Preserve `id="form-heading"` (used for ARIA labeling)
- Preserve `data-testid="text-tool-description"`
- Preserve whitespace and empty lines between nested `<div>`s

---

### 5. **Styles: Inline `<style>` Block → CSS File**

**Current Location**: Lines 67-89
**Target File**: `src/pages/form/styles/form.css`
**Extract Boundary**: Entire content between `<style>{` and `}</style>`

**Current Style Block**:
```css
/* Typography */
.font-fraunces {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
}

.font-manrope {
  font-family: 'Manrope', sans-serif;
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
```

**Migration Steps**:
1. Create `src/pages/form/styles/form.css`
2. Copy the exact CSS content (lines 68-88, excluding the `<style>{` and `}</style>` wrappers)
3. Preserve all comments, whitespace, and formatting
4. Import in Form.tsx: `import "./form/styles/form.css";`
5. Remove the inline `<style>` block from Form.tsx (lines 66-89)

**Parity Safeguards**:
- CSS file must be imported **before** JSX return statement
- Verify CSS classes still apply correctly (check browser DevTools)
- Test that animations still trigger on page load
- **Critical**: Since this changes style loading order, verify that no style conflicts occur

**Note**: The inline style block is removed entirely, including the wrapping `<>` and `</>` fragment tags if they become unnecessary.

---

## Verbatim Copy Contract

### Rules for JSX Extraction

When extracting JSX blocks into components, you **MUST**:

1. **Copy/Paste Exactly**: Select the JSX block boundaries precisely and copy verbatim
2. **Preserve All ClassName Strings**:
   - Do NOT reorder Tailwind utility classes
   - Do NOT add/remove spaces within className strings
   - Do NOT "prettify" or "clean up" class names
3. **Preserve All Text Content**:
   - Including punctuation, capitalization, and whitespace
   - Do NOT rephrase or edit any user-facing strings
4. **Preserve All Attributes**:
   - `data-testid` values must remain unchanged
   - `id` attributes must remain unchanged
   - `aria-*` attributes must remain unchanged
   - Do NOT add new attributes unless required for prop passing
5. **Preserve Whitespace and Formatting**:
   - Keep empty lines between JSX elements
   - Preserve indentation structure (Prettier will handle this)
6. **Preserve Comments**: Copy any inline comments within JSX blocks

### What CAN Change

During extraction, these changes are **allowed**:

1. **Props Introduction**: Replace hardcoded values with `{propName}` when extracting
2. **Import Statements**: Add necessary imports to new component files
3. **Wrapper Function**: Wrap JSX in a component function signature
4. **File Structure**: Move code to new files as specified in plan
5. **Export Statements**: Add `export` keywords for new components/hooks

### What CANNOT Change

The following are **strictly forbidden** in Phase 1:

1. **DOM Structure**: No reordering, nesting changes, or element type changes
2. **CSS Classes**: No adding/removing/reordering Tailwind classes
3. **Inline Styles**: No changes to existing inline style objects (none present in Form.tsx)
4. **Text Content**: No rewording or reformatting of user-facing text
5. **Conditional Logic**: No changes to `if` statements or conditional rendering patterns
6. **Event Handlers**: No changes to handler names or behavior
7. **Route Paths**: No changes to `/selection` or `/loading?tool=...` URLs

### Special Rule: CSS File Migration

When moving inline `<style>` block to CSS file:

1. **Copy CSS Exactly**: Do NOT rename classes, change selectors, or modify keyframes
2. **Preserve Formatting**: Keep all comments, whitespace, and indentation
3. **No Optimizations**: Do NOT consolidate rules or "clean up" CSS in Phase 1
4. **Import Placement**: Import CSS file at top of Form.tsx (after other imports, before component)
5. **Verify Load Order**: Test that CSS applies correctly after extraction (animations, fonts)

### Verification After Each Extraction

After every extraction step, you **MUST**:

1. Run `npm run typecheck` - No new TypeScript errors
2. Run `npm run build` - Build succeeds without errors
3. Run `npm run dev` - Dev server starts without errors
4. **Visual Test**: Open `/form?tool=narrative` and verify:
   - Back button renders and navigates to `/selection`
   - Header shows correct icon, title, and description
   - FormWizard renders after restoration completes
   - Animation classes apply (fadeInUp, delays)
   - No layout shifts or visual differences
5. **Query Param Test**: Test with different tool parameters:
   - `/form?tool=narrative`
   - `/form?tool=responseLetter`
   - `/form?tool=both`
   - `/form?tool=invalid` (should fallback to "narrative")
6. **Restoration Test**:
   - Fill out some form fields
   - Navigate away (e.g., to `/selection`)
   - Return to `/form?tool=narrative`
   - Verify form state is restored correctly
7. **Browser Console**: No new warnings or errors

---

## Parity Verification Checklist

Use this checklist after **each step** in the playbook:

### Build & Type Safety
- [ ] `npm run typecheck` passes with no new errors
- [ ] `npm run build` completes successfully
- [ ] `npm run dev` starts without errors
- [ ] No new ESLint warnings in terminal

### Visual Rendering
- [ ] Back to Selection button renders in correct position
- [ ] Button has correct styles (outline, white bg, hover states)
- [ ] ArrowLeft icon appears with correct size/spacing
- [ ] Icon bubble renders (16x16, rounded corners, shadow, border)
- [ ] Tool icon displays centered in bubble
- [ ] Title renders with correct font (Fraunces), size, weight
- [ ] Description renders with correct font (Manrope), size, color
- [ ] FormWizard appears below header after restoration completes
- [ ] Page background has dot-pattern and paper texture overlay
- [ ] Decorative corner accents appear in top-left and bottom-right

### Animations & Transitions
- [ ] Back button fades in on page load (animate-fadeInUp)
- [ ] Header fades in with 100ms delay (animate-fadeInUp delay-100)
- [ ] FormWizard fades in with 200ms delay (animate-fadeInUp delay-200)
- [ ] All opacity transitions start from 0 and animate to visible
- [ ] No layout shift or "pop-in" during animations

### Behavior & Interaction
- [ ] Clicking "Back to Selection" navigates to `/selection`
- [ ] Tool parameter parsing works:
  - `/form?tool=narrative` → shows "Disclosure Narratives" + FileText icon
  - `/form?tool=responseLetter` → shows "Response Letter" + Mail icon
  - `/form?tool=both` → shows "Both Documents" + Files icon
  - `/form?tool=invalid` → fallbacks to "narrative"
- [ ] Form state restoration works:
  - When persisted tool matches URL tool, state restores
  - When persisted tool differs from URL tool, state does NOT restore
  - Errors are cleared from restored state (`errors: {}`)
- [ ] Form completion handler works:
  - Saves form data to sessionStorage with correct tool type
  - Scrolls to top of page (`window.scrollTo(0, 0)`)
  - Navigates to `/loading?tool={tool}`
- [ ] Protected page registration works (navigation guard active)

### Accessibility
- [ ] `id="form-heading"` present on `<h1>`
- [ ] Section has `aria-labelledby="form-heading"`
- [ ] Icon elements have `aria-hidden="true"`
- [ ] `data-testid="button-back-selection"` present on button
- [ ] `data-testid="text-tool-description"` present on description paragraph

### Browser Console
- [ ] No new console errors
- [ ] No new console warnings
- [ ] No missing import errors
- [ ] No "component not found" errors

### CSS & Styles (After CSS File Migration)
- [ ] `.font-fraunces` class applies to title (check DevTools)
- [ ] `.font-manrope` class applies to description (check DevTools)
- [ ] `.animate-fadeInUp` class triggers animation (check DevTools → Animations)
- [ ] `.delay-100`, `.delay-200`, `.delay-300` classes work correctly
- [ ] No CSS load order issues (styles apply immediately on page load)

### Edge Cases
- [ ] Test with no persisted data (fresh session)
- [ ] Test with persisted data for different tool (should not restore)
- [ ] Test with persisted data for same tool (should restore)
- [ ] Test navigation guard triggers when attempting to leave page
- [ ] Test on mobile viewport (responsive styles intact)
- [ ] Test dark mode toggle (dark: variants work correctly)

---

## Step-by-Step Playbook (Phase 1)

Execute these steps **sequentially**. After each step, run the verification checklist above.

---

### **Step 1: Extract `toolInfo` Constant to Data Module**

**Objective**: Move the `toolInfo` configuration object to a dedicated data file.

**Files to Create**:
- `src/pages/form/data/toolInfo.ts`

**Files to Edit**:
- `src/pages/Form.tsx`

**Actions**:

1. **Create directory structure**:
   ```bash
   mkdir -p src/pages/form/data
   ```

2. **Create `src/pages/form/data/toolInfo.ts`**:
   ```typescript
   import { FileText, Mail, Files } from "lucide-react";
   import { ToolType } from "@/lib/formState";

   export const toolInfo: Record<
     ToolType,
     { title: string; description: string; icon: typeof FileText }
   > = {
     narrative: {
       title: "Disclosure Narratives",
       description: "You're creating five personalized disclosure narratives.",
       icon: FileText,
     },
     responseLetter: {
       title: "Response Letter",
       description: "You're creating a pre-adverse action response letter.",
       icon: Mail,
     },
     both: {
       title: "Both Documents",
       description: "You're creating disclosure narratives and a response letter.",
       icon: Files,
     },
   };
   ```

3. **Edit `src/pages/Form.tsx`**:
   - **Remove** lines 10-29 (the entire `toolInfo` constant and its type)
   - **Add** import at top of file (after existing imports):
     ```typescript
     import { toolInfo } from "./form/data/toolInfo";
     ```
   - **Remove** unused icon imports from line 4:
     - Remove: `FileText`, `Mail`, `Files` from `lucide-react` import
     - Keep: `ArrowLeft` (still used in JSX)
     - Result: `import { ArrowLeft } from "lucide-react";`

**What Remains in Form.tsx**:
- All imports except icon imports (now imported via toolInfo)
- `Form()` component function (unchanged)
- All JSX rendering (unchanged)
- Inline `<style>` block (unchanged for now)

**Completion Criteria**:
- Parity confirmed when:
  - TypeScript compiles without errors
  - Form page renders identically
  - Tool selection logic works for all query params
  - Icon, title, and description display correctly

**Verification**:
- Run checklist items: Build & Type Safety, Visual Rendering, Behavior (tool parameter parsing)

**Recommended Commit Message**:
```
refactor(form): extract toolInfo constant to data module (Phase 1 Step 1)

- Create src/pages/form/data/toolInfo.ts
- Move toolInfo configuration object
- Update imports in Form.tsx
- No visual or behavioral changes
```

---

### **Step 2: Extract Controller Hook**

**Objective**: Move all business logic and state management into a dedicated controller hook.

**Files to Create**:
- `src/pages/form/hooks/useFormPageController.ts`

**Files to Edit**:
- `src/pages/Form.tsx`

**Actions**:

1. **Create directory structure**:
   ```bash
   mkdir -p src/pages/form/hooks
   ```

2. **Create `src/pages/form/hooks/useFormPageController.ts`**:
   ```typescript
   import { useState, useEffect } from "react";
   import { useSearch, useLocation } from "wouter";
   import { FormState, ToolType } from "@/lib/formState";
   import { saveFormData, loadFormData } from "@/lib/formPersistence";
   import { useProtectedPage } from "@/hooks/useProtectedPage";
   import { toolInfo } from "../data/toolInfo";
   import { FileText } from "lucide-react";

   export function useFormPageController() {
     // Register this page as protected from navigation
     useProtectedPage();

     const [, navigate] = useLocation();
     const searchString = useSearch();
     const params = new URLSearchParams(searchString);
     const toolParam = params.get("tool") as ToolType | null;

     const [restoredState, setRestoredState] = useState<FormState | undefined>(undefined);
     const [isRestoring, setIsRestoring] = useState(true);

     const tool = toolParam && toolInfo[toolParam] ? toolParam : "narrative";
     const { title, description, icon: Icon } = toolInfo[tool];

     useEffect(() => {
       const persisted = loadFormData();
       if (persisted && persisted.tool === tool) {
         const restoredFormState: FormState = {
           ...persisted.formState,
           errors: {},
         };
         setRestoredState(restoredFormState);
       }
       setIsRestoring(false);
     }, [tool]);

     const handleFormComplete = (data: FormState) => {
       saveFormData(data, tool);
       window.scrollTo(0, 0);
       navigate(`/loading?tool=${tool}`);
     };

     return {
       tool,
       title,
       description,
       Icon,
       restoredState,
       isRestoring,
       handleFormComplete,
     };
   }
   ```

3. **Edit `src/pages/Form.tsx`**:
   - **Add** import at top:
     ```typescript
     import { useFormPageController } from "./form/hooks/useFormPageController";
     ```
   - **Remove** these imports (now in hook):
     - `useState`, `useEffect` from `react`
     - `useSearch`, `useLocation` from `wouter`
     - `FormState`, `ToolType` from `@/lib/formState`
     - `saveFormData`, `loadFormData`, `clearFormData` from `@/lib/formPersistence`
     - `useProtectedPage` from `@/hooks/useProtectedPage`
   - **Keep** these imports (still used in Form.tsx JSX):
     - `Link` from `wouter`
     - `Button` from `@/components/ui/button`
     - `ArrowLeft` from `lucide-react`
     - `FormWizard` from `@/components/form`
   - **Replace** lines 31-62 (entire component body before `return`) with:
     ```typescript
     const { tool, title, description, Icon, restoredState, isRestoring, handleFormComplete } =
       useFormPageController();
     ```

**What Remains in Form.tsx**:
- Import statements (Link, Button, ArrowLeft, FormWizard, toolInfo, useFormPageController)
- Component function with single hook call
- Entire `return` statement with JSX (unchanged)
- Inline `<style>` block (unchanged)

**Completion Criteria**:
- Parity confirmed when:
  - All business logic executes identically
  - State restoration behaves the same
  - Form completion handler works (save, scroll, navigate)
  - Protected page registration still active
  - No visual changes

**Verification**:
- Run full checklist (all sections)
- Pay special attention to: Behavior & Interaction, Edge Cases

**Recommended Commit Message**:
```
refactor(form): extract controller hook (Phase 1 Step 2)

- Create src/pages/form/hooks/useFormPageController.ts
- Move all business logic to hook (routing, restoration, handlers)
- Form.tsx now calls hook and spreads returned values
- No visual or behavioral changes
```

---

### **Step 3: Extract BackToSelectionRow Component**

**Objective**: Extract the back button section into a standalone component.

**Files to Create**:
- `src/pages/form/sections/BackToSelectionRow.tsx`

**Files to Edit**:
- `src/pages/Form.tsx`

**Actions**:

1. **Create directory structure**:
   ```bash
   mkdir -p src/pages/form/sections
   ```

2. **Create `src/pages/form/sections/BackToSelectionRow.tsx`**:
   ```typescript
   import { Link } from "wouter";
   import { Button } from "@/components/ui/button";
   import { ArrowLeft } from "lucide-react";

   export function BackToSelectionRow() {
     return (
       <div className="mb-6 animate-fadeInUp opacity-0">
         <Link href="/selection">
           <Button
             variant="outline"
             size="sm"
             className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 shadow-sm"
             data-testid="button-back-selection"
           >
             <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
             Back to Selection
           </Button>
         </Link>
       </div>
     );
   }
   ```

3. **Edit `src/pages/Form.tsx`**:
   - **Add** import at top:
     ```typescript
     import { BackToSelectionRow } from "./form/sections/BackToSelectionRow";
     ```
   - **Remove** these imports (now in component):
     - `Link` from `wouter`
     - `Button` from `@/components/ui/button`
     - `ArrowLeft` from `lucide-react`
   - **Replace** lines 103-115 (the entire back button `<div>` block) with:
     ```tsx
     <BackToSelectionRow />
     ```

**What Remains in Form.tsx**:
- Hook call and imports
- Inline `<style>` block (unchanged)
- Section wrapper with background elements
- `<div className="max-w-2xl mx-auto relative z-10">` container
- `<BackToSelectionRow />` component call
- Header JSX (lines 117-136, unchanged)
- FormWizard JSX (lines 138-147, unchanged)

**Completion Criteria**:
- Parity confirmed when:
  - Back button renders in identical position
  - All styles apply correctly (outline, bg, hover, border, shadow)
  - Animation triggers on page load (fadeInUp)
  - Clicking button navigates to `/selection`
  - `data-testid="button-back-selection"` present

**Verification**:
- Run checklist items: Build & Type Safety, Visual Rendering (back button), Animations (fadeInUp), Behavior (back navigation)

**Recommended Commit Message**:
```
refactor(form): extract BackToSelectionRow component (Phase 1 Step 3)

- Create src/pages/form/sections/BackToSelectionRow.tsx
- Extract back button and Link wrapper
- Replace with component call in Form.tsx
- No visual or behavioral changes
```

---

### **Step 4: Extract FormToolHeader Component**

**Objective**: Extract the tool header section (icon bubble + title + description) into a standalone component.

**Files to Create**:
- `src/pages/form/sections/FormToolHeader.tsx`

**Files to Edit**:
- `src/pages/Form.tsx`

**Actions**:

1. **Create `src/pages/form/sections/FormToolHeader.tsx`**:
   ```typescript
   import { FileText } from "lucide-react";

   interface FormToolHeaderProps {
     title: string;
     description: string;
     Icon: typeof FileText;
   }

   export function FormToolHeader({ title, description, Icon }: FormToolHeaderProps) {
     return (
       <div className="text-center space-y-5 mb-10 animate-fadeInUp delay-100 opacity-0">
         <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mx-auto shadow-lg border-2 border-primary/20">
           <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
         </div>

         <div className="space-y-3">
           <h1
             id="form-heading"
             className="text-3xl md:text-4xl font-bold leading-tight text-foreground font-fraunces"
           >
             {title}
           </h1>
           <p
             className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-manrope"
             data-testid="text-tool-description"
           >
             {description}
           </p>
         </div>
       </div>
     );
   }
   ```

2. **Edit `src/pages/Form.tsx`**:
   - **Add** import at top:
     ```typescript
     import { FormToolHeader } from "./form/sections/FormToolHeader";
     ```
   - **Replace** lines 117-136 (the entire header `<div>` block) with:
     ```tsx
     <FormToolHeader title={title} description={description} Icon={Icon} />
     ```

**What Remains in Form.tsx**:
- Hook call and imports
- Inline `<style>` block (unchanged)
- Section wrapper with background elements
- `<div className="max-w-2xl mx-auto relative z-10">` container
- `<BackToSelectionRow />` component call
- `<FormToolHeader title={title} description={description} Icon={Icon} />` component call
- FormWizard JSX (lines 138-147, unchanged)

**Completion Criteria**:
- Parity confirmed when:
  - Icon bubble renders with correct size, border, shadow
  - Tool icon displays centered in bubble
  - Title renders with Fraunces font, correct size and weight
  - Description renders with Manrope font, correct color
  - Animation triggers with 100ms delay (delay-100)
  - `id="form-heading"` present (for ARIA labeling)
  - `data-testid="text-tool-description"` present
  - Dynamic content updates when tool param changes

**Verification**:
- Run checklist items: Build & Type Safety, Visual Rendering (header), Animations (delay-100), Behavior (tool parameter parsing), Accessibility

**Recommended Commit Message**:
```
refactor(form): extract FormToolHeader component (Phase 1 Step 4)

- Create src/pages/form/sections/FormToolHeader.tsx
- Extract icon bubble, title, and description section
- Pass title, description, and Icon as props
- Replace with component call in Form.tsx
- No visual or behavioral changes
```

---

### **Step 5: Migrate Inline Styles to CSS File**

**Objective**: Move the inline `<style>` block to a dedicated CSS file.

**Files to Create**:
- `src/pages/form/styles/form.css`

**Files to Edit**:
- `src/pages/Form.tsx`

**Actions**:

1. **Create directory structure**:
   ```bash
   mkdir -p src/pages/form/styles
   ```

2. **Create `src/pages/form/styles/form.css`**:
   ```css
   /* Typography */
   .font-fraunces {
     font-family: 'Fraunces', serif;
     font-optical-sizing: auto;
   }

   .font-manrope {
     font-family: 'Manrope', sans-serif;
   }

   .animate-fadeInUp {
     animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
   }

   .animate-shimmer {
     animation: shimmer 2s infinite;
   }

   .delay-100 { animation-delay: 100ms; }
   .delay-200 { animation-delay: 200ms; }
   .delay-300 { animation-delay: 300ms; }
   ```

3. **Edit `src/pages/Form.tsx`**:
   - **Add** import at top of file (after other imports):
     ```typescript
     import "./form/styles/form.css";
     ```
   - **Remove** lines 65-89 (the entire `<>`, `<style>`, and `</>` block)
   - **Update** return statement to remove fragment wrapper if unnecessary:
     - Change from:
       ```tsx
       return (
         <>
           <style>{...}</style>
           <section ...>
       ```
     - To:
       ```tsx
       return (
         <section ...>
       ```
     - Remove closing `</>` before final `);`

**What Remains in Form.tsx**:
- All imports (including new CSS import)
- Hook call
- `return` statement with `<section>` as root element (no fragment wrapper)
- All JSX unchanged (section, background elements, container, components)

**Completion Criteria**:
- Parity confirmed when:
  - `.font-fraunces` class applies to title (verify in DevTools)
  - `.font-manrope` class applies to description (verify in DevTools)
  - `.animate-fadeInUp` animation triggers on all elements
  - `.delay-100`, `.delay-200`, `.delay-300` work correctly
  - No CSS load order issues (styles apply immediately)
  - No visual differences or layout shifts
  - Animations appear smooth and identical to before

**Verification**:
- Run full checklist, especially: CSS & Styles section
- **Critical Test**: Open DevTools → Elements → Inspect title element → Verify computed font-family is "Fraunces"
- **Critical Test**: Open DevTools → Elements → Inspect description → Verify computed font-family is "Manrope"
- **Critical Test**: Reload page and watch animations (should fade in with delays)

**Recommended Commit Message**:
```
refactor(form): migrate inline styles to CSS file (Phase 1 Step 5)

- Create src/pages/form/styles/form.css
- Move all inline style rules to CSS file
- Import CSS file in Form.tsx
- Remove inline <style> block and fragment wrapper
- No visual or behavioral changes
```

---

### **Step 6: Final Verification & Code Review**

**Objective**: Perform comprehensive parity verification and ensure Form.tsx is now a clean orchestrator.

**Actions**:

1. **Review Final Form.tsx Structure**:
   - File should be ~40-50 lines
   - Imports only: hook, components, CSS
   - Single hook call destructuring values
   - Return statement with clean JSX composition

2. **Expected Final Form.tsx** (approximate):
   ```typescript
   import { FormWizard } from "@/components/form";
   import { useFormPageController } from "./form/hooks/useFormPageController";
   import { BackToSelectionRow } from "./form/sections/BackToSelectionRow";
   import { FormToolHeader } from "./form/sections/FormToolHeader";
   import "./form/styles/form.css";

   export default function Form() {
     const { tool, title, description, Icon, restoredState, isRestoring, handleFormComplete } =
       useFormPageController();

     return (
       <section
         className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden"
         aria-labelledby="form-heading"
       >
         {/* Paper texture overlay */}
         <div className="paper-texture absolute inset-0 pointer-events-none" />

         {/* Subtle decorative corner accents */}
         <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
         <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

         <div className="max-w-2xl mx-auto relative z-10">
           <BackToSelectionRow />
           <FormToolHeader title={title} description={description} Icon={Icon} />
           {!isRestoring && (
             <div className="animate-fadeInUp delay-200 opacity-0">
               <FormWizard
                 key={restoredState ? "restored" : "fresh"}
                 tool={tool}
                 onComplete={handleFormComplete}
                 initialState={restoredState}
               />
             </div>
           )}
         </div>
       </section>
     );
   }
   ```

3. **Run Full Verification Checklist**:
   - Go through every item in "Parity Verification Checklist" section
   - Test all query parameters (`narrative`, `responseLetter`, `both`, `invalid`)
   - Test restoration flow (fill form → navigate away → return)
   - Test form completion flow (fill form → submit → navigate to loading)
   - Test responsive design (mobile, tablet, desktop viewports)
   - Test dark mode toggle

4. **Manual Visual Comparison**:
   - Take screenshot of form page before refactor (if available)
   - Compare with current page pixel-by-pixel
   - Verify no differences in spacing, fonts, colors, sizes, shadows

5. **Performance Check**:
   - Verify page load time is unchanged
   - Verify no new network requests
   - Verify animations are smooth (60fps)

**Completion Criteria**:
- All verification checklist items pass ✅
- Form.tsx is now a clean composition orchestrator
- No visual or behavioral differences detected
- No new TypeScript errors or warnings
- Build and dev server run without issues

**Recommended Commit Message**:
```
refactor(form): Phase 1 complete - modular architecture with visual parity

- Form.tsx reduced from 153 lines to ~45 lines
- Extracted: controller hook, 2 components, data constant, CSS file
- Created folder structure: form/{hooks,sections,data,styles}
- Verified pixel-perfect visual parity
- Verified identical behavior (routing, restoration, completion)
- All tests passing, no regressions
```

---

## Phase 2 (Do Not Execute Yet)

Phase 2 represents **optional enhancements** that can be applied after Phase 1 is complete, verified, and committed. These changes are NOT part of the current refactor plan and should be discussed with the team before implementation.

### Potential Phase 2 Improvements

1. **Unused Import Cleanup**:
   - Remove any imports that became unused during extraction
   - Verify with TypeScript and ESLint

2. **CSS Consolidation**:
   - Consider moving `.font-fraunces` and `.font-manrope` to global CSS if used elsewhere
   - Consider moving animation classes to global CSS if reusable
   - Evaluate if `@keyframes fadeInUp` needs to be defined (may already exist globally)

3. **Type Safety Enhancements**:
   - Add explicit return type to `useFormPageController`
   - Add JSDoc comments to exported functions/components
   - Strengthen prop types with branded types if needed

4. **Component Reusability**:
   - Evaluate if `FormToolHeader` pattern can be generalized for other pages
   - Consider extracting icon bubble to shared component if used elsewhere
   - Evaluate if animation classes can be composed into a shared hook

5. **Performance Optimizations**:
   - Consider memoizing `handleFormComplete` with `useCallback`
   - Evaluate if `restoredState` needs `useMemo` optimization
   - Profile render performance and optimize if needed

6. **Accessibility Enhancements**:
   - Add focus management for back button
   - Consider adding skip link for keyboard navigation
   - Evaluate if loading state needs accessible announcements

7. **Testing**:
   - Add unit tests for `useFormPageController` hook
   - Add component tests for `BackToSelectionRow` and `FormToolHeader`
   - Add integration tests for restoration flow
   - Add E2E tests for form completion flow

8. **Documentation**:
   - Add README to `src/pages/form/` explaining folder structure
   - Document props and return values with JSDoc
   - Create architecture diagram for form page flow

### Phase 2 Execution Plan

When ready to proceed with Phase 2:
1. Create a new planning document: `form-phase-2-enhancements-plan.md`
2. Prioritize improvements based on impact and effort
3. Get team approval for proposed changes
4. Execute improvements incrementally with separate commits
5. Each improvement should have its own verification checklist

**DO NOT execute Phase 2 changes until**:
- Phase 1 is fully complete and committed
- Team has reviewed and approved Phase 2 plan
- Phase 2 planning document has been created
- Explicit approval given to proceed

---

## Appendix: Folder Structure After Phase 1

```
src/pages/
├── form/
│   ├── hooks/
│   │   └── useFormPageController.ts     # Business logic controller
│   ├── sections/
│   │   ├── BackToSelectionRow.tsx       # Back button component
│   │   └── FormToolHeader.tsx           # Header with icon/title/description
│   ├── styles/
│   │   └── form.css                     # Typography and animation classes
│   └── data/
│       └── toolInfo.ts                  # Tool configuration lookup
└── Form.tsx                              # Main page orchestrator (~45 lines)
```

**File Sizes (Approximate)**:
- `Form.tsx`: 45 lines (down from 153)
- `useFormPageController.ts`: 50 lines
- `BackToSelectionRow.tsx`: 20 lines
- `FormToolHeader.tsx`: 30 lines
- `toolInfo.ts`: 25 lines
- `form.css`: 20 lines

**Total Lines**: ~190 lines (up from 153, but now modular and testable)

---

## Success Criteria

Phase 1 is considered **complete and successful** when:

✅ All 6 steps in the playbook are executed sequentially
✅ Each step passes the parity verification checklist
✅ Form.tsx is reduced to ~40-50 lines (composition only)
✅ Folder structure matches proposed architecture
✅ Zero visual differences from original implementation
✅ Zero behavioral differences from original implementation
✅ All TypeScript types compile without errors
✅ Build and dev server run without errors or warnings
✅ All manual tests pass (tool params, restoration, completion)
✅ All accessibility attributes preserved
✅ All animations and transitions work identically
✅ Code is committed with clear commit messages

---

**END OF PLAN**

Ready for execution! Await instruction: "Proceed with Step X" to begin implementation.
