# Reframe.me - Development Status

**Last Updated**: 2025-12-17

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

### Code Quality & Refactoring
- [ ] **Refactor React components** - Break down large components (Form.tsx, Results.tsx, etc.) into smaller, reusable, properly modular pieces following single responsibility principle
- [ ] **Refactor Express server** - Organize server code into modular structure:
  - Separate controllers for business logic
  - Service layer for AI integration and document generation
  - Middleware for authentication, error handling, validation
  - Route handlers should be thin and delegate to controllers

## 🎯 Next Steps

### For Local Development
If you want to run the app locally, you'll need to set up the development environment.

### Step 1: Install PostgreSQL

PostgreSQL is required for local development. Choose one of the following options:

**Installation Options:**

**Option A: Install via Homebrew (Recommended for macOS)**
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Option B: Download from PostgreSQL.org**
- Download from: https://www.postgresql.org/download/macosx/
- Follow the installer instructions
- Use Postgres.app for a simple GUI: https://postgresapp.com/

**Option C: Use Docker**
```bash
docker run --name reframe-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

**Option D: Use Cloud Database (Skip local install)**
- Go to https://neon.tech/ (free tier)
- Create a project and get connection string
- Skip to Step 3

### Step 2: Create Database

After PostgreSQL is installed and running:

```bash
# Create the database
createdb reframeme

# Verify it was created
psql -l | grep reframeme
```

Your `DATABASE_URL` will be:
```
postgresql://your_mac_username@localhost:5432/reframeme
```

To find your username:
```bash
whoami
```

### Step 3: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in (create account if needed)
3. Click "Create new secret key"
4. Name it "Reframe.me Development"
5. Copy the key (starts with `sk-proj-...` or `sk-...`)
6. **Important**: Save it somewhere safe - you can only see it once!

### Step 4: Generate Session Secret

```bash
openssl rand -base64 32
```

Copy the output for use in `.env`

### Step 5: Update `.env` File

Edit `/Users/zach/Coding/Reframe.me/.env`:

```env
# Database - Replace 'zach' with your actual username from 'whoami' command
DATABASE_URL=postgresql://zach@localhost:5432/reframeme

# OpenAI API Configuration - Replace with your actual API key
AI_INTEGRATIONS_OPENAI_API_KEY=sk-proj-your-actual-key-here
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1

# Session Configuration - Replace with generated secret
SESSION_SECRET=your_generated_secret_from_openssl_command

# Server Configuration (these are fine as-is)
NODE_ENV=development
PORT=5000
```

### Step 6: Set Up Database Schema

```bash
npm run db:push
```

This will create the necessary tables in your PostgreSQL database.

### Step 7: Start Development Server

```bash
npm run dev
```

Visit http://localhost:5000

### Step 8: Verify Everything Works

1. Click "Get Started"
2. Fill out the form
3. Generate narratives/letter
4. Verify content is generated successfully

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
├── server/                     # Express backend
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API endpoints
│   │   └── POST /api/generate-documents
│   │   └── POST /api/regenerate-narrative
│   │   └── POST /api/regenerate-letter
│   ├── storage.ts             # Data storage (memory)
│   ├── static.ts              # Static file serving
│   └── vite.ts                # Vite dev server setup
├── shared/                     # Shared TypeScript code
│   └── schema.ts              # Drizzle DB schema
├── script/                     # Build scripts
│   └── build.ts               # Production build script
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment template
├── vercel.json                # Vercel deployment config
├── drizzle.config.ts          # Drizzle ORM config
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

## 🔑 Key Files

### Database Schema (`shared/schema.ts`)
Currently minimal - only has a `users` table (likely not being used yet).

### API Routes (`server/routes.ts`)
- **POST /api/generate-documents**: Generate narratives and/or response letter
- **POST /api/regenerate-narrative**: Regenerate a specific narrative type
- **POST /api/regenerate-letter**: Regenerate the response letter

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

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql
# or
ps aux | grep postgres

# Start PostgreSQL if not running
brew services start postgresql@16
```

### Can't create database
```bash
# Initialize PostgreSQL if needed (first time setup)
initdb /opt/homebrew/var/postgresql@16
```

### OpenAI API Errors
- Verify API key is correct in `.env`
- Check you have credits: https://platform.openai.com/usage
- Ensure no extra spaces in the API key

### Port 5000 already in use
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process or change PORT in .env to another port like 5001
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
1. Install and configure PostgreSQL
2. Obtain an OpenAI API key
3. Configure environment variables in `.env`
4. Run database migrations
5. Start the development server

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

### Code Quality & Deployment
- [x] Repository clean (no uncommitted changes)
- [x] Recent improvements committed
- [x] **Application deployed and live at [reframeme.app](https://reframeme.app)**

### Environment Setup (For Local Development)
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] OpenAI API key obtained
- [ ] `.env` configured with real values
- [ ] Database schema pushed
- [ ] Development server tested locally

---

**Live Application**: [reframeme.app](https://reframeme.app)
**Local Development**: Follow setup steps above to run locally for development and testing.
