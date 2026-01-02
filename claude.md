# Reframe.me - Development Status

**Last Updated**: 2026-01-02

## 📊 Current State

### Application Overview
Reframe.me is a web application that helps justice-involved individuals prepare for employment opportunities by generating:
- 5 different disclosure narrative approaches
- Pre-adverse action response letters

### Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Wouter (routing)
- **Backend**: Express.js + TypeScript
- **AI**: OpenAI API (GPT-5.2)
- **Build**: Vite + esbuild
- **Deployment**: Vercel

### Current Status

📋 **Planning phase** - Multiple page refactor plans created (Donate, FAQ)

---

## 📋 Active Development

### Donate Page Refactor - Phase 1 Planning

**Status**: Plan revised and finalized, ready for execution
**Plan Document**: `docs/donate-orchestrator-refactor-plan.md` (15-step plan, revised)
**Goal**: Extract orchestrator pattern from 977-line Donate.tsx with 100% visual parity
**Architecture**:
- Style block → DonateStyles component
- 10 section components extracted (Hero, Payment, Support Matters, Transparency, Testimonial, Privacy, FAQ, Other Ways, Closing CTA, Back to Top)
- Component-owned state moved down (heroMounted → Hero, openFaq → FAQ, showBackToTop → Back to Top)
- Orchestrator retains only cross-section refs + handlers (~80-100 lines)
**Next Step**: Execute Step 0 (folder setup) - `mkdir -p client/src/pages/donate/sections client/src/pages/donate/data`

### FAQ Page Refactor - Phase 1 Planning

**Status**: Plan created, ready for execution
**Plan Document**: `docs/faq-page-orchestrator-refactor-plan.md` (8-step plan)
**Goal**: Extract orchestrator pattern from 479-line Faq.tsx with 100% visual parity
**Architecture**:
- Style block → FaqStyles component
- Data extraction → faq.constants.tsx (11 FAQs with JSX answers)
- 6 section components extracted (Hero, Important Disclaimer, FAQ List, Bottom Disclaimer, CTA, Styles)
- Component-owned state moved down (openItem → FaqList)
- Orchestrator retains only page-level scroll effect (~80-100 lines)
**Critical Risk**: nth-child animation delays require exact DOM hierarchy preservation
**Next Step**: Execute Step 0 (folder setup) - `mkdir -p client/src/pages/faq/sections client/src/pages/faq/data`

---

## 📁 Project Structure

```
reframe.me/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── form/          # Multi-step form components
│   │   │   │   ├── steps/     # Step components (Step1-Step9)
│   │   │   │   ├── CharacterCountTextarea.tsx
│   │   │   │   ├── ChipInput.tsx
│   │   │   │   ├── FormWizard.tsx
│   │   │   │   ├── OilFrameworkInfo.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── StepImportanceAlert.tsx
│   │   │   │   └── TypeChips.tsx
│   │   │   ├── results/       # Results display components
│   │   │   │   ├── DocumentSwitcher.tsx
│   │   │   │   ├── NarrativeCard.tsx
│   │   │   │   ├── NarrativeCarousel.tsx
│   │   │   │   ├── PartialFailureAlert.tsx
│   │   │   │   └── ResponseLetterPanel.tsx
│   │   │   ├── disclaimer/    # Disclaimer components
│   │   │   │   └── DisclaimerModal.tsx
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── AppShell.tsx   # Main app shell
│   │   │   └── LeaveConfirmationModal.tsx
│   │   ├── pages/             # Route pages
│   │   │   ├── home/          # Home page (modular ✅)
│   │   │   │   ├── sections/  # HeroSection, HowItWorksSection, etc.
│   │   │   │   ├── data/      # home.constants.ts
│   │   │   │   └── types/     # home.types.ts
│   │   │   ├── selection/     # Selection page (modular ✅)
│   │   │   │   ├── sections/  # SelectionHero, OptionsGrid, etc.
│   │   │   │   ├── data/      # selection.constants.ts
│   │   │   │   └── types/     # selection.types.ts
│   │   │   ├── form/          # Form page (modular ✅)
│   │   │   │   ├── sections/  # BackToSelectionRow, FormToolHeader
│   │   │   │   ├── hooks/     # useFormPageController.ts
│   │   │   │   ├── data/      # toolInfo.ts
│   │   │   │   └── styles/    # form.css
│   │   │   ├── loading/       # Loading page (modular ✅)
│   │   │   │   ├── sections/  # LoadingView, ErrorView, etc.
│   │   │   │   ├── hooks/     # useDocumentGeneration, useMessageCycle, etc.
│   │   │   │   ├── utils/     # generateDocuments, validateToolParam
│   │   │   │   ├── data/      # loadingContent.ts
│   │   │   │   ├── styles/    # loading.css, error.css
│   │   │   │   └── index.tsx  # Main loading page
│   │   │   ├── results/       # Results page (modular ✅)
│   │   │   │   ├── hooks/     # useResultsPage, useResultsLoader, etc.
│   │   │   │   └── sections/  # ResultsHero, ResultsDocumentsSection, etc.
│   │   │   ├── Home.tsx       # Landing page
│   │   │   ├── Selection.tsx  # Tool selection page
│   │   │   ├── Form.tsx       # Multi-step form page
│   │   │   ├── Results.tsx    # Generated content display (refactored ✅)
│   │   │   ├── Donate.tsx     # Donation page
│   │   │   ├── Faq.tsx        # FAQ page
│   │   │   ├── TermsPrivacy.tsx # Terms and privacy page
│   │   │   └── not-found.tsx  # 404 page
│   │   ├── lib/               # Utilities
│   │   │   ├── api.ts         # API client
│   │   │   ├── formState.ts   # Form state management
│   │   │   ├── formPersistence.ts
│   │   │   ├── resultsPersistence.ts
│   │   │   ├── regenerationPersistence.ts
│   │   │   ├── pdfUtils.ts    # PDF generation
│   │   │   ├── disclaimerContent.ts
│   │   │   ├── queryClient.ts # React Query config
│   │   │   ├── chipMicrocopy.ts
│   │   │   ├── suggestionData.js
│   │   │   └── utils.ts       # General utilities
│   │   └── hooks/             # Custom React hooks
│   │       ├── useProtectedPage.ts
│   │       ├── useDocumentActions.ts
│   │       ├── useNavigationGuard.ts
│   │       ├── useInView.ts
│   │       ├── use-mobile.tsx
│   │       └── use-toast.ts
├── server/                     # Express backend (REFACTORED ✅)
│   ├── index.ts               # Server entry point
│   ├── config/                # Configuration
│   │   └── openaiClient.ts    # OpenAI client singleton
│   ├── types/                 # TypeScript types
│   │   └── documents.ts       # Document domain types
│   ├── services/              # Business logic
│   │   └── documentGeneration.service.ts  # AI generation
│   ├── routes/                # API routes
│   │   ├── index.ts           # Route registration
│   │   └── documents.routes.ts # Document endpoints
│   ├── middleware/            # Express middleware
│   │   ├── requestLogger.ts   # Request logging
│   │   └── errorHandler.ts    # Error handling
│   ├── static/                # Static file serving
│   │   └── index.ts           # SPA static file handler
│   └── vite.ts                # Vite dev server setup
├── docs/                       # Documentation
│   ├── backend-express-architecture.md
│   ├── results-refactor-plan.md  # 14-step refactor plan (completed)
│   ├── donate-orchestrator-refactor-plan.md  # 15-step refactor plan (pending)
│   └── faq-page-orchestrator-refactor-plan.md  # 8-step refactor plan (pending)
├── script/                     # Build scripts
│   └── build.ts               # Production build script
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment template
├── vercel.json                # Vercel deployment config
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

---

## 🔑 Key Files

### Backend Architecture (Modular Structure ✅)

**Configuration:**
- `server/config/openaiClient.ts` - Lazy-loaded OpenAI client singleton

**Types:**
- `server/types/documents.ts` - TypeScript domain types for document generation

**Business Logic:**
- `server/services/documentGeneration.service.ts` - AI generation functions:
  - `generateNarratives()` - Creates 5 disclosure narratives
  - `generateSingleNarrative()` - Creates 1 specific narrative
  - `generateResponseLetter()` - Creates pre-adverse action response letter

**API Routes:**
- `server/routes/index.ts` - Route registration orchestration
- `server/routes/documents.routes.ts` - Document generation endpoints:
  - **POST /api/generate-documents** - Generate narratives and/or response letter
  - **POST /api/regenerate-narrative** - Regenerate a specific narrative type
  - **POST /api/regenerate-letter** - Regenerate the response letter

**Documentation:**
- `docs/backend-express-architecture.md` - Detailed backend architecture and refactoring documentation

### Frontend Architecture (Modular Pattern)

**Modular Page Pattern** (used by all major pages: `home/`, `selection/`, `form/`, `loading/`, `results/`):
- Main page file at top level (e.g., `Results.tsx`)
- Supporting code in subfolder (e.g., `results/`)
- Structure: `hooks/`, `sections/`, `utils/`, `data/`, `styles/` as needed

**Results Page Refactor** (completed ✅):
- **Hooks**: Complex logic extracted (loading, regeneration, exit actions, page orchestration)
  - `useResultsPage.ts` - Main page orchestrator
  - `useResultsLoader.ts` - Data loading logic
  - `useResultsRegeneration.ts` - Regeneration logic
  - `useResultsExitActions.ts` - Exit/navigation logic
- **Sections**: Large JSX blocks extracted into dedicated components
  - `ResultsHero.tsx` - Header section
  - `ResultsDocumentsSection.tsx` - Main documents display
  - `ResultsGuidanceSection.tsx` - Guidance content
  - `ResultsActionsPanel.tsx` - Action buttons
  - `ResultsDonateCTA.tsx` - Donation call-to-action
  - `ResultsDisclaimerCard.tsx` - Disclaimer display
- **Result**: Reduced from 538 lines to 280 lines (~48% reduction)

### Application Flow
1. Home page → Selection page
2. 9-step form collecting:
   - Background/offenses
   - Programs and skills
   - Additional context
   - Job details
   - Ownership statement
   - Impact statement
   - Lessons learned
   - Clarifying relevance
   - Qualifications
3. Loading page with AI generation
4. Results page with generated content

---

## 🌐 Live Application

The application is deployed and accessible at **[reframeme.app](https://reframeme.app)**.

For deployment configuration details, see `VERCEL_DEPLOYMENT.md`.

---

## 💻 Development

**Local Setup:** See [QUICKSTART.md](./QUICKSTART.md) or [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for detailed setup instructions.

**Quick Start:**
```bash
npm install
npm run dev  # Starts on http://localhost:5000
```

**Environment:** Requires OpenAI API key in `.env` (see `.env.example` template).

**Privacy Model:**
- Form data stored in browser localStorage only
- Results NOT persisted server-side (by design)
- No database required for local development

---

## 📝 Notes

- Form data is stored in **browser localStorage** only
- Results are **not persisted** server-side
- This is by design for privacy - no user data is stored on the backend

---

## 🎨 Design System

See `design_guidelines.md` for:
- Color palette (Teal primary, Orange secondary)
- Typography system
- Component specifications
- Accessibility requirements

The app uses a calming, dignified design to reduce anxiety for users.

---

**Live Application**: [reframeme.app](https://reframeme.app)
**Local Development**: Follow setup steps above to run locally for development and testing.
