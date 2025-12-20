# Reframe.me - Development Status

**Last Updated**: 2025-12-20

## 📊 Current State

### Application Overview
Reframe.me is a web application that helps justice-involved individuals prepare for employment opportunities by generating:
- 5 different disclosure narrative approaches
- Pre-adverse action response letters

### Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Wouter (routing)
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: OpenAI API (GPT-5.2)
- **Build**: Vite + esbuild
- **Target Deployment**: Vercel

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
✅ Repository clean with latest improvements committed
✅ **Application deployed at [reframeme.app](https://reframeme.app)**

## 📋 TODO

### Backend Refactoring (In Progress)
- [x] **Wave 1: Extract services and types** (Completed 2025-12-20)
  - ✅ Created `server/config/openaiClient.ts` - OpenAI singleton
  - ✅ Created `server/types/documents.ts` - TypeScript domain types
  - ✅ Created `server/services/documentGeneration.service.ts` - AI generation logic
- [x] **Wave 2: Modularize routing** (Completed 2025-12-20)
  - ✅ Created `server/routes/index.ts` - Route registration
  - ✅ Created `server/routes/documents.routes.ts` - Document endpoints
  - ✅ Replaced monolithic `routes.ts` with modular structure
- [ ] **Wave 3: Extract middleware**
  - [ ] Create `server/middleware/requestLogger.ts`
  - [ ] Create `server/middleware/errorHandler.ts`
  - [ ] Update `server/index.ts` to import middleware

### Frontend Refactoring
- [ ] **Refactor React components** - Break down large components (Form.tsx, Results.tsx, etc.) into smaller, reusable, properly modular pieces following single responsibility principle

## 🎯 Next Steps

### For Local Development
If you want to run the app locally, you'll need to set up the development environment.

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
│   │   │   ├── Home.tsx       # Landing page
│   │   │   ├── Form.tsx       # Multi-step form
│   │   │   ├── Results.tsx    # Generated content display
│   │   │   └── Selection.tsx  # Tool selection
│   │   ├── lib/               # Utilities
│   │   │   ├── formState.ts   # Form state management
│   │   │   ├── formPersistence.ts
│   │   │   └── resultsPersistence.ts
│   │   └── hooks/             # Custom React hooks
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
│   ├── storage.ts             # In-memory storage (legacy)
│   ├── static.ts              # Static file serving
│   └── vite.ts                # Vite dev server setup
├── shared/                     # Shared TypeScript code
│   └── schema.ts              # Drizzle DB schema (legacy)
├── docs/                       # Documentation
│   └── backend-express-architecture.md  # Backend refactoring docs
├── script/                     # Build scripts
│   └── build.ts               # Production build script
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment template
├── vercel.json                # Vercel deployment config
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

## 🔑 Key Files

### Backend Architecture (Modular Structure)

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

### Form Flow
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
3. Results page with generated content

## 🌐 Live Application

The application is currently deployed and accessible at **[reframeme.app](https://reframeme.app)**.

For deployment configuration details, see `VERCEL_DEPLOYMENT.md`.

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

## 📝 Notes

- The app currently uses **in-memory storage** for user sessions (see `server/storage.ts`)
- Form data is stored in **browser localStorage** only
- Results are **not persisted** to the database
- This is by design for privacy - no user data is stored server-side
- The `users` table in the schema appears to be unused legacy code from the Replit template

## 🎨 Design System

See `design_guidelines.md` for:
- Color palette (Teal primary, Orange secondary)
- Typography system
- Component specifications
- Accessibility requirements

The app uses a calming, dignified design to reduce anxiety for users.

## 🚦 Development Status

The application is currently **live at [reframeme.app](https://reframeme.app)** and fully functional. The codebase is clean and all recent UI/UX improvements have been committed.

### To Run Locally for Development
If you want to contribute or test changes locally, follow the setup steps above to:
1. Obtain an OpenAI API key
2. Configure environment variables in `.env`
3. Install dependencies with `npm install`
4. Start the development server with `npm run dev`

## ✅ Completed

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

### Backend Refactoring (2025-12-20)
- [x] **Wave 1:** Extracted services, types, and configuration
  - [x] Created modular service layer for AI generation
  - [x] Separated TypeScript types into dedicated module
  - [x] Extracted OpenAI client configuration
- [x] **Wave 2:** Modularized routing structure
  - [x] Replaced monolithic routes.ts with Router pattern
  - [x] Created routes/index.ts for route registration
  - [x] Created routes/documents.routes.ts for endpoints
  - [x] Updated documentation with architecture diagrams

### Code Quality & Deployment
- [x] Repository clean (no uncommitted changes)
- [x] Recent improvements committed
- [x] **Application deployed and live at [reframeme.app](https://reframeme.app)**

---

**Live Application**: [reframeme.app](https://reframeme.app)
**Local Development**: Follow setup steps above to run locally for development and testing.
