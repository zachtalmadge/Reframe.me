# Reflect.me - Replit Agent Guide

## Overview

Reflect.me is a mobile-first web application designed to help justice-involved individuals prepare for job opportunities. The application generates two key tools:

1. **Five Disclosure Narratives** - Different ways to discuss background information with potential employers during interviews
2. **Pre-Adverse Action Response Letter** - A formal response when employers flag background check concerns

The application follows a simple 5-screen flow: Home → Selection → Multi-step Form → Loading → Disclaimer + Documents. The design prioritizes calming clarity, dignity, and accessibility to reduce anxiety for users navigating sensitive employment situations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React (TypeScript)** with Vite as the build tool and development server
- **Single-Page Application (SPA)** using Wouter for client-side routing
- **Mobile-First Design** with progressive enhancement for tablet/desktop viewports
- Rationale: React provides component reusability, Wouter offers lightweight routing without server dependencies, and Vite ensures fast development with hot module replacement

**UI Component System**
- **shadcn/ui** components based on Radix UI primitives with Tailwind CSS styling
- Component configuration in `components.json` follows "new-york" style preset
- Extensive component library including forms, dialogs, cards, buttons, and navigation elements
- Rationale: Radix UI provides accessible, unstyled primitives that can be customized to match the calming design guidelines while maintaining WCAG compliance

**Styling Approach**
- **Tailwind CSS** utility-first framework with custom design tokens
- Custom color system: Teal primary (#0D9488), Orange secondary (#F97316), warm gray neutrals
- Design guidelines emphasize "Calming Clarity" and "Dignified Simplicity"
- CSS variables for theming defined in `client/src/index.css`
- Rationale: Utility-first CSS enables rapid iteration while maintaining design consistency through centralized tokens

**State Management**
- **TanStack Query (React Query)** for server state and API data fetching
- Custom query client configuration with infinite stale time and disabled refetching
- Rationale: Separates server state from component state, provides caching and background updates

### Backend Architecture

**Server Framework**
- **Express.js** HTTP server with TypeScript
- HTTP server creation using Node's built-in `http.createServer()`
- Custom logging middleware tracking request duration and response status
- Rationale: Express provides a minimal, flexible foundation for REST API endpoints

**API Structure**
- Routes registered through `registerRoutes()` function in `server/routes.ts`
- All application routes prefixed with `/api`
- Static file serving for SPA with fallback to `index.html` for client-side routing
- Rationale: Clear separation between API and static assets, supports SPA routing patterns

**Storage Layer**
- Storage interface defined in `server/storage.ts` with CRUD operations
- **In-Memory Storage** implementation (`MemStorage`) for development
- Interface supports migration to persistent database (Postgres with Drizzle ORM configured)
- Rationale: Interface abstraction allows swapping storage implementations without changing business logic

### Data Storage Solutions

**Database Configuration**
- **Drizzle ORM** configured with PostgreSQL dialect
- Schema defined in `shared/schema.ts` using Drizzle's table definitions
- Migration support via `drizzle-kit` with migrations output to `./migrations`
- Zod integration via `drizzle-zod` for runtime validation
- Rationale: Type-safe ORM with lightweight footprint, excellent TypeScript integration

**Current Schema**
- Users table with id, username, password fields
- UUID primary keys using PostgreSQL's `gen_random_uuid()`
- Shared schema between client and server via `@shared` path alias
- Rationale: Simple authentication foundation that can be extended for form submissions and document generation

**Note**: The application is configured for PostgreSQL but currently uses in-memory storage. Database connection requires `DATABASE_URL` environment variable.

### Authentication & Authorization

**Authentication Mechanism**
- User schema supports username/password authentication
- Storage interface includes `getUserByUsername()` for credential lookup
- Session management dependencies installed: `express-session`, `connect-pg-simple`
- Rationale: Foundation for optional user accounts while maintaining "no account required" user flow

**Current State**
- No authentication routes currently implemented
- Application designed to work anonymously without requiring login
- Infrastructure prepared for future session-based authentication if needed

### External Dependencies

**Third-Party Services**
- None currently integrated
- Application designed to function entirely client-side and server-side without external APIs
- Prepared dependencies: OpenAI client, Google Generative AI, Stripe (not yet utilized)
- Rationale: Keeps the application self-contained and privacy-focused for sensitive user data

**Development Tools**
- Replit-specific plugins for development banner, runtime error overlay, and cartographer
- Google Fonts integration: Inter and Open Sans font families
- Rationale: Enhanced development experience in Replit environment

**Build & Deployment**
- Custom build script (`script/build.ts`) using esbuild for server and Vite for client
- Allowlist of bundled dependencies to reduce syscalls and improve cold start performance
- Production mode serves pre-built static files from `dist/public`
- Rationale: Optimized production bundle with minimal external dependencies

### Path Aliases

- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

These aliases are configured in both `tsconfig.json` and `vite.config.ts` for consistency across the codebase.