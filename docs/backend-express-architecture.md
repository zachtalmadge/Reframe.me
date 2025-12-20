# Backend Express Architecture

**Purpose**: Document the refactoring of the Express + TypeScript server from a three-file monolith to a modular, maintainable architecture.

---

## ✅ Refactoring Status

**Wave 1: COMPLETED (2025-12-20)**

The first wave of refactoring split the monolithic `routes.ts` file (783 lines) into modular components:

- ✅ `server/config/openaiClient.ts` - OpenAI client singleton (26 lines)
- ✅ `server/types/documents.ts` - TypeScript domain types (87 lines)
- ✅ `server/services/documentGeneration.service.ts` - AI generation logic (572 lines)
- ✅ `server/routes.ts` - Refactored route handlers (151 lines)

**Wave 2: COMPLETED (2025-12-20)**

The second wave of refactoring organized routes into a modular structure:

- ✅ `server/routes/index.ts` - Route registration orchestration (13 lines)
- ✅ `server/routes/documents.routes.ts` - Document generation endpoints (145 lines)
- ✅ Deleted `server/routes.ts` - Replaced with modular route structure
- ✅ Updated `server/index.ts` - Now imports from `routes/index.js`

**Wave 3: COMPLETED (2025-12-20)**

The third wave of refactoring extracted middleware into dedicated modules:

- ✅ `server/middleware/requestLogger.ts` - Request logging middleware (38 lines)
- ✅ `server/middleware/errorHandler.ts` - Error handling middleware (11 lines)
- ✅ Updated `server/index.ts` - Imports and uses middleware modules (~70 lines, down from 140)

**Current Structure:**
```
server/
├── index.ts       (~70 lines) - Entry point, initialization ✅ REFACTORED
├── static.ts      (20 lines)  - Static file serving
├── config/
│   └── openaiClient.ts (26 lines)
├── types/
│   └── documents.ts (87 lines)
├── services/
│   └── documentGeneration.service.ts (572 lines)
├── routes/
│   ├── index.ts (13 lines)
│   └── documents.routes.ts (145 lines)
├── middleware/
│   ├── requestLogger.ts (38 lines) - ✅ NEW
│   └── errorHandler.ts (11 lines) - ✅ NEW
├── storage.ts     - In-memory storage (legacy, unused)
└── vite.ts        - Vite dev server setup
```

**All Waves Complete!** The Express server has been fully refactored into a modular, maintainable architecture.

---

## Current (Pre-Refactor) Structure

### File Organization

```
server/
├── index.ts       (140 lines) - Entry point, middleware, initialization
├── routes.ts      (783 lines) - Types, OpenAI client, generation logic, routes
├── static.ts      (20 lines)  - Static file serving
├── storage.ts                 - In-memory storage (legacy, unused)
└── vite.ts                    - Vite dev server setup
```

### Route Inventory

| Method | Path | Handler Function(s) | Lines in routes.ts |
|--------|------|---------------------|-------------------|
| POST | `/api/generate-documents` | Anonymous handler calling `generateNarratives()` and/or `generateResponseLetter()` | 653-730 |
| POST | `/api/regenerate-narrative` | Anonymous handler calling `generateSingleNarrative()` | 732-758 |
| POST | `/api/regenerate-letter` | Anonymous handler calling `generateResponseLetter()` | 760-779 |
| GET | `/*` (production) | Served by `express.static` + catch-all fallback to `index.html` | static.ts:13-18 |

### Current Responsibilities by File

#### `server/index.ts` (140 lines)
**Responsibilities:**
1. Environment variable loading and validation (dotenv)
2. Express app and HTTP server creation
3. Body parsing middleware configuration (JSON, URL-encoded)
4. Request logging utility function (`log()`)
5. Request/response logging middleware (captures timing, JSON responses)
6. App initialization orchestration (`initializeApp()`)
7. Error-handling middleware registration
8. Static/Vite middleware setup (environment-dependent)
9. Vercel serverless handler export
10. Local development server startup

**Key Middleware:**
- JSON body parser with raw body capture
- URL-encoded body parser
- Request logging middleware (lines 63-87): Logs method, path, status, duration, and response JSON for `/api/*` routes
- Error-handling middleware (lines 98-104): Catches errors and sends JSON error responses

#### `server/routes.ts` (783 lines)
**Responsibilities:**
1. TypeScript type definitions for document generation domain
2. OpenAI client lazy-loading and singleton management
3. Business logic for AI-powered document generation:
   - `generateNarratives(formData)`: Creates 5 disclosure narratives via GPT-5.2
   - `generateSingleNarrative(formData, narrativeType)`: Creates 1 specific narrative
   - `generateResponseLetter(formData)`: Creates pre-adverse action response letter
4. Express route registration via `registerRoutes(httpServer, app)`
5. Request validation and error handling
6. Complex system prompts for AI generation (embedded in functions)

**Types Defined:**
- `ToolType`, `Offense`, `FormData`, `GenerateRequest`
- `NarrativeItem`, `ResponseLetter`, `DocumentError`, `GenerateResponse`
- `NarrativeType` and `narrativeTypeInfo` mapping

#### `server/static.ts` (20 lines)
**Responsibilities:**
1. Production static file serving
2. Build directory validation
3. SPA fallback routing to `index.html`

---

## Proposed (Post-Refactor) Structure

### File Organization

```
server/
├── index.ts                                    - Entry point, app initialization, serverless handler
├── config/
│   └── openaiClient.ts                         - OpenAI client singleton with lazy loading
├── middleware/
│   ├── requestLogger.ts                        - Request/response logging middleware
│   └── errorHandler.ts                         - Error-handling middleware
├── types/
│   └── documents.ts                            - Domain types for document generation
├── services/
│   └── documentGeneration.service.ts           - AI generation logic (narratives, letters)
├── routes/
│   ├── index.ts                                - Exports registerRoutes(), wires all route modules
│   └── documents.routes.ts                     - Document generation route handlers
├── static.ts                                   - Static file serving (unchanged)
├── vite.ts                                     - Vite dev server setup (unchanged)
└── storage.ts                                  - In-memory storage (legacy, unused)
```

### Proposed File Responsibilities

#### `server/index.ts` (~60 lines)
**Responsibilities:**
- Environment variable loading and validation
- Express app and HTTP server creation
- Body parsing middleware registration
- Request logging middleware registration (imported)
- Call `registerRoutes(httpServer, app)`
- Error-handling middleware registration (imported)
- Static/Vite middleware setup (environment-dependent)
- Export serverless handler for Vercel
- Start local development server

**Changes:**
- Remove inline middleware implementations → import from `middleware/`
- Remove `log()` utility → moved to `middleware/requestLogger.ts`
- Simplified, focused on orchestration

---

#### `server/config/openaiClient.ts` (~20 lines)
**Responsibilities:**
- Export `getOpenAI()` function
- Lazy-load and cache OpenAI client singleton
- Ensure environment variables are available before instantiation

**Exports:**
```typescript
export function getOpenAI(): OpenAI
```

**Rationale:**
- Keeps OpenAI configuration in one place
- Prevents ES module hoisting issues with environment variables
- Reusable across services

---

#### `server/middleware/requestLogger.ts` (38 lines) ✅ IMPLEMENTED
**Responsibilities:**
- Export request/response logging middleware
- Export `log()` utility function
- Capture request timing, method, path, status code
- Capture and log JSON responses for `/api/*` routes
- Wrap `res.json()` to intercept response bodies
- Only log requests to `/api/*` paths to reduce noise

**Exports:**
```typescript
export function log(message: string, source?: string): void
export function requestLogger(): RequestHandler
```

**Implementation Details:**
- Middleware wraps `res.json()` to capture JSON response bodies
- Measures request duration from start to finish
- Logs format: `METHOD /path STATUS in Xms :: {"response":"json"}`
- Only logs API routes (paths starting with `/api`)
- Used by `server/index.ts` after body parsing middleware

**Rationale:**
- Separates cross-cutting concerns
- Makes logging logic reusable and testable
- Clear single responsibility
- Easy to modify logging behavior in one place

---

#### `server/middleware/errorHandler.ts` (11 lines) ✅ IMPLEMENTED
**Responsibilities:**
- Export error-handling middleware
- Extract status code from error object (default: 500)
- Send JSON error responses with format `{ message }`
- Re-throw errors after responding (for logging/debugging)

**Exports:**
```typescript
export function errorHandler(): ErrorRequestHandler
```

**Implementation Details:**
- Extracts status from `err.status` or `err.statusCode`, defaults to 500
- Extracts message from `err.message`, defaults to "Internal Server Error"
- Returns JSON response: `res.status(status).json({ message })`
- Re-throws error after responding (allows upstream error handlers)
- Registered in `server/index.ts` after route registration, before static/Vite

**Rationale:**
- Centralized error handling logic
- Follows Express error-handling middleware pattern
- Easy to extend for error logging services (Sentry, etc.)
- Consistent error response format across all routes

---

#### `server/types/documents.ts` (~60 lines)
**Responsibilities:**
- Define all TypeScript types for document generation domain
- No runtime logic, types only

**Types:**
- `ToolType`, `Offense`, `FormData`, `GenerateRequest`
- `NarrativeItem`, `ResponseLetter`, `DocumentError`, `GenerateResponse`
- `NarrativeType` and `narrativeTypeInfo` mapping

**Rationale:**
- Separates type definitions from business logic
- Makes types importable across services and routes
- Easier to maintain and extend domain model

---

#### `server/services/documentGeneration.service.ts` (~650 lines)
**Responsibilities:**
- Import `getOpenAI()` from `config/openaiClient.ts`
- Import types from `types/documents.ts`
- Implement all AI generation functions:
  - `generateNarratives(formData: FormData): Promise<NarrativeItem[]>`
  - `generateSingleNarrative(formData: FormData, type: NarrativeType): Promise<NarrativeItem>`
  - `generateResponseLetter(formData: FormData): Promise<ResponseLetter>`
- Contain all system prompts and AI interaction logic
- Handle OpenAI API errors and response parsing

**Exports:**
```typescript
export async function generateNarratives(formData: FormData): Promise<NarrativeItem[]>
export async function generateSingleNarrative(formData: FormData, type: NarrativeType): Promise<NarrativeItem>
export async function generateResponseLetter(formData: FormData): Promise<ResponseLetter>
```

**Rationale:**
- Single Responsibility: Pure business logic for document generation
- Testable: Can mock OpenAI client and test prompts
- No HTTP concerns: Service layer is framework-agnostic
- Reusable: Could be called from CLI, scheduled jobs, etc.

---

#### `server/routes/documents.routes.ts` (145 lines) ✅ IMPLEMENTED
**Responsibilities:**
- Import service functions from `services/documentGeneration.service.ts`
- Import types from `types/documents.ts`
- Define Express Router for document generation endpoints
- Handle request validation
- Call service layer functions
- Format responses and errors
- Preserve all analytics logging (`📊 ANALYTICS: ...`)

**Route Handlers:**
- `POST /generate-documents`: Generate narratives and/or response letter
- `POST /regenerate-narrative`: Regenerate a specific narrative type
- `POST /regenerate-letter`: Regenerate the response letter

**Exports:**
```typescript
export const documentsRouter: Router
```

**Implementation Details:**
- Uses Express `Router()` for modular route definition
- Routes are relative to the base path (no `/api` prefix here)
- Preserves all status codes, error messages, and JSON response shapes
- Maintains analytics console.log statements exactly as before

**Rationale:**
- Thin route handlers: Delegate to service layer
- HTTP concerns only: Validation, request/response formatting
- Router pattern enables easy mounting at different paths
- Easy to add new endpoints or modify existing ones

---

#### `server/routes/index.ts` (13 lines) ✅ IMPLEMENTED
**Responsibilities:**
- Import and orchestrate all route modules
- Export `registerRoutes(httpServer, app)` function
- Wire up document routes under `/api` base path
- Maintain same signature as original `routes.ts`

**Exports:**
```typescript
export async function registerRoutes(httpServer: Server, app: Express): Promise<Server>
```

**Implementation:**
```typescript
import type { Express } from "express";
import type { Server } from "http";
import { documentsRouter } from "./documents.routes.js";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register document generation routes under /api
  app.use("/api", documentsRouter);

  return httpServer;
}
```

**Rationale:**
- Central route registration point
- Mounts documentsRouter at `/api` to maintain API contract
- Same signature ensures no changes needed in `index.ts`
- Easy to add new route modules in the future
- Maintains backward compatibility

---

## Request Lifecycle (Post-Refactor)

### Incoming Request Flow

```
1. HTTP Request
   ↓
2. server/index.ts
   - Express app receives request
   ↓
3. Body Parsing Middleware
   - express.json() with raw body capture
   - express.urlencoded()
   ↓
4. middleware/requestLogger.ts
   - Capture request start time
   - Intercept res.json() for response logging
   ↓
5. routes/index.ts → routes/documents.routes.ts
   - Match route: POST /api/generate-documents
   - Validate request body
   ↓
6. services/documentGeneration.service.ts
   - Call generateNarratives(formData) and/or generateResponseLetter(formData)
   ↓
7. config/openaiClient.ts
   - Get OpenAI client singleton
   ↓
8. OpenAI API
   - Send system + user prompts
   - Receive JSON response
   ↓
9. services/documentGeneration.service.ts
   - Parse OpenAI response
   - Return NarrativeItem[] or ResponseLetter
   ↓
10. routes/documents.routes.ts
    - Format success/error response
    - res.json(result)
    ↓
11. middleware/requestLogger.ts
    - Log request completion (method, path, status, duration, response JSON)
    ↓
12. HTTP Response sent to client
```

### Error Handling Flow

```
Error thrown in service layer
   ↓
routes/documents.routes.ts catch block
   - Format error response
   - res.status(500).json({ error })
   ↓
OR (if error not caught in route)
   ↓
middleware/errorHandler.ts
   - Extract status code
   - res.status(status).json({ message })
   - Re-throw for logging
   ↓
HTTP Error Response sent to client
```

---

## Migration Benefits

### Code Organization
- **Separation of Concerns**: Each file has a single, clear responsibility
- **Testability**: Services can be tested independently of HTTP layer
- **Maintainability**: Easy to locate and modify specific functionality
- **Scalability**: Simple to add new routes, services, or middleware

### Developer Experience
- **Reduced Cognitive Load**: No need to scan 783-line files
- **Clear Dependencies**: Import structure shows relationships
- **Type Safety**: Centralized type definitions
- **Reusability**: Services can be called from multiple routes or contexts

### Technical Benefits
- **No Behavior Changes**: Refactoring preserves all existing functionality
- **Backward Compatible**: `registerRoutes()` signature unchanged
- **Framework-Agnostic Service Layer**: Can swap Express for another framework
- **Future-Proof**: Easy to add authentication, database persistence, analytics

---

## Next Steps

### Refactoring Order (Recommended)

1. **Create `server/config/openaiClient.ts`**
   - Extract OpenAI client logic
   - Test that lazy loading still works

2. **Create `server/types/documents.ts`**
   - Copy all type definitions
   - Update imports in routes.ts temporarily

3. **Create `server/services/documentGeneration.service.ts`**
   - Move generation functions
   - Import types and OpenAI client
   - Export service functions

4. **Create `server/middleware/requestLogger.ts`**
   - Extract logging middleware and `log()` function
   - Update index.ts to import

5. **Create `server/middleware/errorHandler.ts`**
   - Extract error-handling middleware
   - Update index.ts to import

6. **Create `server/routes/documents.routes.ts`**
   - Move route handlers from routes.ts
   - Import service functions
   - Export `registerDocumentRoutes(app)`

7. **Create `server/routes/index.ts`**
   - Import document routes
   - Export `registerRoutes(httpServer, app)`

8. **Update `server/index.ts`**
   - Remove inline middleware
   - Import from middleware/
   - Update imports for routes/

9. **Delete old `server/routes.ts`**
   - Verify all functionality migrated

10. **Test thoroughly**
    - All three API endpoints
    - Error handling
    - Request logging
    - Static file serving
    - Vercel serverless deployment

---

## Testing Checklist

- [ ] POST `/api/generate-documents` with `selection: "narrative"`
- [ ] POST `/api/generate-documents` with `selection: "responseLetter"`
- [ ] POST `/api/generate-documents` with `selection: "both"`
- [ ] POST `/api/regenerate-narrative` with valid narrative type
- [ ] POST `/api/regenerate-letter` with form data
- [ ] Error handling: Missing formData
- [ ] Error handling: Invalid narrative type
- [ ] Error handling: OpenAI API failure
- [ ] Request logging appears in console for `/api/*` routes
- [ ] Static files serve correctly in production build
- [ ] Vite dev server works in development
- [ ] Vercel deployment (serverless handler)

---

## File Size Comparison

### Before Refactoring
- `server/routes.ts`: **783 lines** (types + OpenAI + services + routes)
- `server/index.ts`: **140 lines** (entry + middleware + init)

**Total Core Logic**: 923 lines in 2 files

### After Refactoring
- `server/config/openaiClient.ts`: ~20 lines
- `server/types/documents.ts`: ~60 lines
- `server/services/documentGeneration.service.ts`: ~650 lines
- `server/middleware/requestLogger.ts`: ~30 lines
- `server/middleware/errorHandler.ts`: ~15 lines
- `server/routes/documents.routes.ts`: ~120 lines
- `server/routes/index.ts`: ~15 lines
- `server/index.ts`: ~60 lines

**Total Core Logic**: ~970 lines in 8 files (slight increase due to module boilerplate)

**Benefit**: Same functionality, 4x more maintainable files, clear separation of concerns

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     server/index.ts                          │
│  - Environment validation                                    │
│  - Express app setup                                         │
│  - Middleware registration                                   │
│  - Serverless handler export                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Registers middleware
                       ↓
        ┌──────────────────────────────────┐
        │   Middleware Layer                │
        │                                   │
        │  - middleware/requestLogger.ts    │
        │  - middleware/errorHandler.ts     │
        │  - Body parsers (express.json)    │
        └──────────────┬───────────────────┘
                       │
                       │ Routes requests
                       ↓
        ┌──────────────────────────────────┐
        │   Routing Layer                   │
        │                                   │
        │  routes/index.ts                  │
        │    ↓                              │
        │  routes/documents.routes.ts       │
        │    - POST /api/generate-documents │
        │    - POST /api/regenerate-narrative│
        │    - POST /api/regenerate-letter  │
        └──────────────┬───────────────────┘
                       │
                       │ Calls services
                       ↓
        ┌──────────────────────────────────┐
        │   Service Layer                   │
        │                                   │
        │  services/documentGeneration.service.ts│
        │    - generateNarratives()         │
        │    - generateSingleNarrative()    │
        │    - generateResponseLetter()     │
        └──────────────┬───────────────────┘
                       │
                       │ Uses
                       ↓
        ┌──────────────────────────────────┐
        │   Configuration & Types           │
        │                                   │
        │  config/openaiClient.ts           │
        │  types/documents.ts               │
        └───────────────────────────────────┘
```

---

**Document Version**: 1.0
**Last Updated**: 2025-12-20
**Status**: Ready for Implementation
