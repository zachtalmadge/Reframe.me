# Reframe.me - Development Status

**Last Updated**: 2026-01-01

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
✅ Project migrated from Replit to local development
✅ Vercel deployment configuration created
✅ Documentation completed (README, QUICKSTART, deployment guides)
✅ `.env.example` template created
✅ `.gitignore` updated for security
✅ iOS 26 design system implemented (glass navbar, modern buttons)
✅ Home page backgrounds and styling updated
✅ Donate CTAs added
✅ Mobile retry functionality with silent error handling
✅ **Application deployed at [reframeme.app](https://reframeme.app)**
✅ Backend fully refactored (modular structure)
🚧 **Frontend refactoring in progress** - Results page modularization

---

## 📋 Active Development

### Frontend Refactoring - Results Page (IN PROGRESS 🚧)

**Goal**: Refactor Results.tsx from 720 lines to ~150-200 lines
**Plan**: `/docs/results-refactor-plan.md`
**Progress**: Steps 1-3 of 14 completed

#### Completed ✅
- [x] **Step 1**: Created folder structure (`results/hooks/`, `results/sections/`, `results/utils/`)
- [x] **Step 2**: Extracted `ResultsGuidanceSection` to sections/ (584 lines, -136 from original)
- [x] **Step 3**: Created `useResultsLoader` hook (538 lines, -182 from original, -25% total)

#### In Progress 🚧
- [ ] **Step 4**: Create `useResultsExitActions` hook
- [ ] **Step 5**: Create `useResultsRegeneration` hook
- [ ] **Step 6**: Extract `ResultsDisclaimerCard` component
- [ ] **Step 7**: Extract `ResultsHero` component
- [ ] **Step 8**: Extract `ResultsDocumentsSection` component
- [ ] **Step 9**: Extract `ResultsActionsPanel` component
- [ ] **Step 10**: Extract `ResultsDonateCTA` component
- [ ] **Step 11**: Verify Results.tsx is clean and minimal
- [ ] **Step 12**: Full regression testing
- [ ] **Step 13**: Update documentation

#### Next Steps
After Results page refactor is complete:
- Form.tsx refactoring (similar modular approach)
- Other large component refactors as needed

---

## 📁 Project Structure

```
reframe.me/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── form/          # Multi-step form components
│   │   │   ├── results/       # Results display components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   └── Layout.tsx     # Main layout wrapper
│   │   ├── pages/             # Route pages
│   │   │   ├── home/          # Home page sections
│   │   │   │   └── sections/
│   │   │   ├── loading/       # Loading page (modular)
│   │   │   │   ├── hooks/
│   │   │   │   ├── sections/
│   │   │   │   ├── utils/
│   │   │   │   └── data/
│   │   │   ├── results/       # Results page (REFACTORING 🚧)
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useResultsLoader.ts
│   │   │   │   ├── sections/
│   │   │   │   │   └── ResultsGuidanceSection.tsx
│   │   │   │   └── utils/
│   │   │   ├── selection/     # Selection page
│   │   │   │   └── sections/
│   │   │   ├── form/          # Form page sections
│   │   │   │   └── steps/
│   │   │   ├── Home.tsx       # Landing page
│   │   │   ├── Form.tsx       # Multi-step form
│   │   │   ├── Results.tsx    # Generated content display (538 lines, target: ~150-200)
│   │   │   └── Selection.tsx  # Tool selection
│   │   ├── lib/               # Utilities
│   │   │   ├── formState.ts
│   │   │   ├── formPersistence.ts
│   │   │   ├── resultsPersistence.ts
│   │   │   ├── regenerationPersistence.ts
│   │   │   └── api.ts
│   │   └── hooks/             # Custom React hooks
│   │       ├── useProtectedPage.ts
│   │       └── useDocumentActions.ts
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
│   └── results-refactor-plan.md  # 14-step refactor plan
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

**Modular Page Pattern** (used by `home/`, `loading/`, `selection/`, and in-progress `results/`):
- Main page file at top level (e.g., `Results.tsx`)
- Supporting code in subfolder (e.g., `results/`)
- Structure: `hooks/`, `sections/`, `utils/`, `data/` as needed

**Results Page Refactor** (in progress):
- **Hooks**: Extract complex logic (loading, regeneration, exit actions)
- **Sections**: Extract large JSX blocks into dedicated components
- **Target**: Reduce from 720 lines to ~150-200 lines

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

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- OpenAI API key

### Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in (create account if needed)
3. Click "Create new secret key"
4. Name it "Reframe.me Development"
5. Copy the key (starts with `sk-proj-...` or `sk-...`)
6. **Important**: Save it somewhere safe - you can only see it once!

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# OpenAI API Configuration - Replace with your actual API key
AI_INTEGRATIONS_OPENAI_API_KEY=sk-proj-your-actual-key-here
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1

# Session Configuration - Generate with: openssl rand -base64 32
SESSION_SECRET=your_generated_secret_here

# Server Configuration
NODE_ENV=development
PORT=5000
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Development Server

```bash
npm run dev
```

Visit http://localhost:5000

### Step 5: Verify Everything Works

1. Click "Get Started"
2. Fill out the form
3. Generate narratives/letter
4. Verify content is generated successfully

**Note:** The app does not require a database for local development. All form data is stored in browser localStorage, and results are not persisted server-side (by design for privacy).

---

## 🐛 Troubleshooting

### OpenAI API Errors
- Verify API key is correct in `.env`
- Check you have credits: https://platform.openai.com/usage
- Ensure no extra spaces in the API key
- Make sure the key starts with `sk-proj-` or `sk-`

### Port 5000 already in use
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process or change PORT in .env to another port like 5001
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist .vite
```

---

## 📝 Notes

- Form data is stored in **browser localStorage** only
- Results are **not persisted** server-side
- This is by design for privacy - no user data is stored on the backend
- The `users` table in the schema is unused legacy code from the Replit template

---

## 🎨 Design System

See `design_guidelines.md` for:
- Color palette (Teal primary, Orange secondary)
- Typography system
- Component specifications
- Accessibility requirements

The app uses a calming, dignified design to reduce anxiety for users.

---

## ✅ Completed Work

### Codebase & Configuration
- [x] Project structure reviewed and organized
- [x] Dependencies installed and up to date
- [x] `.env.example` template created
- [x] `.gitignore` updated for security
- [x] Documentation created (README, QUICKSTART, CLAUDE.md)
- [x] Vercel deployment configuration ready

### UI/UX Improvements
- [x] iOS 26 design system (glass navbar, modern buttons)
- [x] Home page backgrounds and visual design
- [x] Donate CTAs and section reordering
- [x] Mobile-optimized styling
- [x] Silent retry functionality for improved UX

### Backend Refactoring (Completed 2025-12-20 ✅)
- [x] **Wave 1:** Extracted services, types, and configuration
  - [x] Created modular service layer for AI generation
  - [x] Separated TypeScript types into dedicated module
  - [x] Extracted OpenAI client configuration
- [x] **Wave 2:** Modularized routing structure
  - [x] Replaced monolithic routes.ts with Router pattern
  - [x] Created routes/index.ts for route registration
  - [x] Created routes/documents.routes.ts for endpoints
  - [x] Updated documentation with architecture diagrams
- [x] **Wave 3:** Extracted middleware
  - [x] Created middleware/requestLogger.ts for request logging
  - [x] Created middleware/errorHandler.ts for error handling
  - [x] Integrated middleware into server/index.ts
- [x] **Wave 4:** Modularized static file serving
  - [x] Refactored static.ts → static/index.ts for consistency
  - [x] Achieved fully modular backend architecture

### Frontend Refactoring (In Progress 🚧)
- [x] **Results Page Refactor - Steps 1-3** (2026-01-01)
  - [x] Created modular folder structure (`results/hooks/`, `results/sections/`, `results/utils/`)
  - [x] Extracted `ResultsGuidanceSection` component to sections/
  - [x] Created `useResultsLoader` hook (load-with-retry logic + state management)
  - [x] Reduced Results.tsx from 720 lines to 538 lines (-25%)
- [ ] **Results Page Refactor - Steps 4-13** (next)
  - [ ] Extract remaining hooks (exit actions, regeneration)
  - [ ] Extract remaining section components (disclaimer, hero, documents, actions, donate)
  - [ ] Target: ~150-200 lines total

### Code Quality & Deployment
- [x] Repository clean (no uncommitted changes)
- [x] All improvements committed with detailed commit messages
- [x] **Application deployed and live at [reframeme.app](https://reframeme.app)**

---

**Live Application**: [reframeme.app](https://reframeme.app)
**Local Development**: Follow setup steps above to run locally for development and testing.
