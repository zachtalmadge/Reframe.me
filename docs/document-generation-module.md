# Document Generation Module

**Purpose**: This document explains how the AI-powered document generation feature works in the Reframe.me application.

**Audience**: Engineers joining the project who are familiar with TypeScript and Express but new to this codebase.

---

## High-Level Overview

### What This Feature Does

The document generation module helps justice-involved individuals prepare for employment opportunities by generating:

1. **Disclosure Narratives** (5 different approaches):
   - Justice-Focused Organization
   - General Employer
   - Minimal-Disclosure
   - Transformation-Focused
   - Skills-Focused

2. **Pre-Adverse Action Response Letters**:
   - Professional letters responding to potential job offer rescission based on background check results

### External Dependencies

**OpenAI API (GPT-5.2)**
- Used for AI-powered content generation
- Accessed via lazy-loaded singleton pattern to avoid ES module hoisting issues
- Configured in `config/openaiClient.ts`
- API key and base URL loaded from environment variables

---

## Module Map

### Configuration Layer

#### `server/config/openaiClient.ts` (26 lines)

**Purpose**: Provides a singleton OpenAI client instance with lazy loading.

**Why Lazy Loading?**
```typescript
// ❌ BAD: ES modules execute imports before runtime code
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY }); // undefined!

// ✅ GOOD: Lazy loading defers instantiation until runtime
let openaiClient: OpenAI | null = null;
export function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_KEY });
  }
  return openaiClient;
}
```

**Problem**: ES modules execute imports before `dotenv` loads environment variables in `server/index.ts`.

**Solution**: Lazy loading defers OpenAI instantiation until the first API call, ensuring environment variables are available.

**Usage**: Services call `getOpenAI()` to get the client instance.

---

### Type Layer

#### `server/types/documents.ts` (87 lines)

**Purpose**: Defines TypeScript types for the document generation domain.

**Key Types:**

**Input Types:**
```typescript
// What the user fills out in the form
interface FormData {
  offenses: Offense[];           // Array of offense details
  releaseMonth: string;          // Release date
  releaseYear: string;
  programs: string[];            // Rehabilitation programs completed
  skills: string[];              // Skills developed
  additionalContext: string;     // Additional user context
  jobTitle: string;              // Position applying for
  employerName: string;          // Employer name
  ownership: string;             // OIL framework: Ownership
  impact: string;                // OIL framework: Impact
  lessonsLearned: string;        // OIL framework: Lessons Learned
  // ... other fields
}

interface Offense {
  id: string;
  type: string;
  description: string;
  programs: string[];            // Programs related to this offense
}
```

**Output Types:**
```typescript
// A generated disclosure narrative
interface NarrativeItem {
  id: string;
  type: "justice_focused_org" | "general_employer" | "minimal_disclosure"
        | "transformation_focused" | "skills_focused";
  title: string;
  content: string;               // The actual narrative text
}

// A generated response letter
interface ResponseLetter {
  id: string;
  title: string;
  content: string;               // The actual letter text
}
```

**API Types:**
```typescript
// Request to /api/generate-documents
interface GenerateRequest {
  selection: ToolType;           // "narrative" | "responseLetter" | "both"
  formData: FormData;
}

// Response from /api/generate-documents
interface GenerateResponse {
  status: "success" | "partial_fail" | "total_fail";
  narratives: NarrativeItem[];
  responseLetter: ResponseLetter | null;
  errors: DocumentError[];
}
```

**Type Flow:**
1. User submits `GenerateRequest` with `FormData`
2. Services use `FormData` to generate content
3. Services return `NarrativeItem[]` or `ResponseLetter`
4. Routes package into `GenerateResponse`

---

### Service Layer

#### `server/services/documentGeneration.service.ts` (572 lines)

**Purpose**: Pure business logic for AI document generation. Framework-agnostic (no Express dependencies).

**Exported Functions:**

**1. `generateNarratives(formData: FormData): Promise<NarrativeItem[]>`**

Generates all 5 narrative types in a single OpenAI API call.

**How It Works:**
```typescript
async function generateNarratives(formData: FormData): Promise<NarrativeItem[]> {
  // 1. Build system prompt (defines AI behavior, constraints, tone)
  const systemPrompt = `You are an expert career counselor...`;

  // 2. Build user prompt (user's specific background data)
  const userPrompt = `Generate 5 disclosure narratives using:
  - Offenses: ${formData.offenses}
  - Programs: ${formData.programs}
  - Skills: ${formData.skills}
  ...`;

  // 3. Call OpenAI API
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  // 4. Parse and return narratives
  const parsed = JSON.parse(response.choices[0].message.content);
  return parsed.narratives.map((n, index) => ({
    id: `narrative-${index + 1}`,
    type: n.type,
    title: n.title,
    content: n.content
  }));
}
```

**2. `generateSingleNarrative(formData: FormData, type: NarrativeType): Promise<NarrativeItem>`**

Regenerates one specific narrative type.

**Difference from `generateNarratives()`:**
- Generates only 1 narrative instead of 5
- Used for the "regenerate" feature
- System prompt tailored to the specific narrative type
- Shorter output (1-2 paragraphs vs 3 paragraphs)

**3. `generateResponseLetter(formData: FormData): Promise<ResponseLetter>`**

Generates a pre-adverse action response letter.

**Key Features:**
- Uses OIL framework (Ownership, Impact, Lessons Learned)
- Incorporates resume and job posting if provided
- Addresses charge relevance honestly
- Professional, calm tone
- 3-5 paragraphs, 300-500 words

**Common Pattern Across All Functions:**

```typescript
1. Define systemPrompt (AI instructions, tone, constraints)
2. Build userPrompt (user's specific data)
3. Call OpenAI API with both prompts
4. Parse JSON response
5. Return typed result
```

**Error Handling in Services:**
- Services throw errors if OpenAI API fails
- Services throw errors if JSON parsing fails
- Routes catch these errors and format responses

---

### Route Layer

#### `server/routes/documents.routes.ts` (145 lines)

**Purpose**: Express route handlers for document generation endpoints. Thin layer that validates requests, calls services, and formats responses.

**Endpoints:**

**1. POST `/api/generate-documents`**

Generates narratives and/or response letter based on user selection.

**Request Body:**
```typescript
{
  selection: "narrative" | "responseLetter" | "both",
  formData: {
    offenses: [...],
    programs: [...],
    skills: [...],
    // ... all FormData fields
  }
}
```

**Handler Logic:**
```typescript
1. Validate request (has selection and formData?)
2. Determine what to generate (needsNarratives, needsResponseLetter)
3. Try to generate each requested document type:
   - Call generateNarratives(formData) if needed
   - Call generateResponseLetter(formData) if needed
   - Catch errors individually for each type
4. Determine overall status:
   - "success": All requested documents generated
   - "partial_fail": Some succeeded, some failed
   - "total_fail": All failed
5. Return GenerateResponse
```

**Success Response (status 200):**
```json
{
  "status": "success",
  "narratives": [
    {
      "id": "narrative-1",
      "type": "justice_focused_org",
      "title": "Justice-Focused Organization",
      "content": "I'm really looking forward to..."
    },
    // ... 4 more narratives
  ],
  "responseLetter": {
    "id": "response-letter-1",
    "title": "Pre-Adverse Action Response Letter",
    "content": "[Date]\n\nDear Hiring Manager..."
  },
  "errors": []
}
```

**Partial Fail Response (status 200):**
```json
{
  "status": "partial_fail",
  "narratives": [...],  // Successfully generated
  "responseLetter": null,
  "errors": [
    {
      "documentType": "responseLetter",
      "detail": "OpenAI API error: rate limit exceeded"
    }
  ]
}
```

**Total Fail Response (status 500):**
```json
{
  "status": "total_fail",
  "narratives": [],
  "responseLetter": null,
  "errors": [
    {
      "documentType": "narrative",
      "detail": "Failed to generate narratives"
    }
  ]
}
```

**2. POST `/api/regenerate-narrative`**

Regenerates a single specific narrative type.

**Request Body:**
```typescript
{
  narrativeType: "justice_focused_org" | "general_employer" | "minimal_disclosure"
                 | "transformation_focused" | "skills_focused",
  formData: { ... }
}
```

**Handler Logic:**
```typescript
1. Validate narrativeType and formData
2. Validate narrativeType is valid (one of 5 allowed types)
3. Call generateSingleNarrative(formData, narrativeType)
4. Return { narrative: NarrativeItem }
```

**Success Response (status 200):**
```json
{
  "narrative": {
    "id": "narrative-justice_focused_org",
    "type": "justice_focused_org",
    "title": "Justice-Focused Organization",
    "content": "As we move into next steps..."
  }
}
```

**Error Response (status 500):**
```json
{
  "error": "Failed to regenerate narrative"
}
```

**3. POST `/api/regenerate-letter`**

Regenerates the response letter.

**Request Body:**
```typescript
{
  formData: { ... }
}
```

**Handler Logic:**
```typescript
1. Validate formData exists
2. Call generateResponseLetter(formData)
3. Return { letter: ResponseLetter }
```

**Success Response (status 200):**
```json
{
  "letter": {
    "id": "response-letter-1",
    "title": "Pre-Adverse Action Response Letter",
    "content": "[Date]\n\nDear Hiring Manager..."
  }
}
```

**Error Response (status 500):**
```json
{
  "error": "Failed to regenerate letter"
}
```

---

## Request → Response Flow

### Flow 1: Generate Both Narratives and Letter

```
Client
  ↓
  POST /api/generate-documents
  {
    selection: "both",
    formData: { ... }
  }
  ↓
routes/documents.routes.ts
  - Validate request
  - needsNarratives = true
  - needsResponseLetter = true
  ↓
services/documentGeneration.service.ts
  - generateNarratives(formData)
    ↓
    config/openaiClient.ts → getOpenAI()
    ↓
    OpenAI API (gpt-5.2)
    ↓
    Returns 5 narratives

  - generateResponseLetter(formData)
    ↓
    config/openaiClient.ts → getOpenAI()
    ↓
    OpenAI API (gpt-5.2)
    ↓
    Returns 1 letter
  ↓
routes/documents.routes.ts
  - Package into GenerateResponse
  - status: "success"
  ↓
Client receives:
  {
    status: "success",
    narratives: [5 items],
    responseLetter: {...},
    errors: []
  }
```

### Flow 2: Regenerate Single Narrative

```
Client
  ↓
  POST /api/regenerate-narrative
  {
    narrativeType: "transformation_focused",
    formData: { ... }
  }
  ↓
routes/documents.routes.ts
  - Validate narrativeType (is it one of 5 valid types?)
  - Validate formData
  ↓
services/documentGeneration.service.ts
  - generateSingleNarrative(formData, "transformation_focused")
    ↓
    Uses narrativeTypeInfo["transformation_focused"] for prompts
    ↓
    OpenAI API (gpt-5.2)
    ↓
    Returns 1 narrative (1-2 paragraphs)
  ↓
routes/documents.routes.ts
  - Return { narrative }
  ↓
Client receives:
  {
    narrative: {
      id: "narrative-transformation_focused",
      type: "transformation_focused",
      title: "Transformation-Focused",
      content: "..."
    }
  }
```

---

## Error Handling

### Service Layer Error Handling

**Services throw errors when:**
- OpenAI API call fails
- JSON parsing fails
- Response content is missing

```typescript
// Example from generateNarratives()
const response = await getOpenAI().chat.completions.create({ ... });

const content = response.choices[0].message.content;
if (!content) {
  throw new Error("No content in OpenAI response");  // ← Service throws
}

const parsed = JSON.parse(content);  // ← Can throw if invalid JSON
```

**Services do NOT:**
- Catch errors themselves
- Return error objects
- Format HTTP responses

---

### Route Layer Error Handling

**Routes catch service errors and format responses:**

**1. For `/api/generate-documents`:**

```typescript
// Individual try-catch for each document type
if (needsNarratives) {
  try {
    result.narratives = await generateNarratives(formData);
    console.log('📊 ANALYTICS: Generated 5 narratives');
  } catch (error) {
    narrativesSuccess = false;
    result.errors.push({
      documentType: "narrative",
      detail: error instanceof Error ? error.message : "Failed to generate narratives"
    });
  }
}

// Determine overall status based on what succeeded/failed
if (needsNarratives && needsResponseLetter) {
  if (!narrativesSuccess && !responseLetterSuccess) {
    result.status = "total_fail";
    return res.status(500).json(result);
  } else if (!narrativesSuccess || !responseLetterSuccess) {
    result.status = "partial_fail";  // Some succeeded
  }
}
```

**2. For `/api/regenerate-narrative` and `/api/regenerate-letter`:**

```typescript
// Single try-catch for the entire operation
try {
  const narrative = await generateSingleNarrative(formData, narrativeType);
  return res.json({ narrative });
} catch (error) {
  console.error("Error in regenerate-narrative:", error);
  return res.status(500).json({
    error: error instanceof Error ? error.message : "Failed to regenerate narrative"
  });
}
```

---

### Global Error Handler

**`middleware/errorHandler.ts`** catches errors that escape route handlers.

**When It's Triggered:**
- If a route handler throws an error without catching it
- If an error is passed to `next(error)`

**What It Does:**
```typescript
export function errorHandler() {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;  // Re-throw for logging
  };
}
```

**For Document Generation:**
- Routes catch errors internally and format responses
- Global error handler is a safety net for unexpected errors
- Most document generation errors are handled at the route level

---

## Extensibility

### Adding a New Narrative Type

**Current Types:**
- `justice_focused_org`
- `general_employer`
- `minimal_disclosure`
- `transformation_focused`
- `skills_focused`

**Steps to Add a New Type (e.g., "community_focused"):**

**1. Update Types (`types/documents.ts`)**

```typescript
// Add to NarrativeType union
export type NarrativeType =
  | "justice_focused_org"
  | "general_employer"
  | "minimal_disclosure"
  | "transformation_focused"
  | "skills_focused"
  | "community_focused";  // ← NEW

// Add to narrativeTypeInfo
export const narrativeTypeInfo: Record<NarrativeType, { title: string; description: string }> = {
  // ... existing types
  community_focused: {
    title: "Community-Focused",
    description: "Emphasizes community involvement, local connections, and giving back."
  }
};

// Update NarrativeItem.type
export interface NarrativeItem {
  id: string;
  type: "justice_focused_org" | "general_employer" | "minimal_disclosure"
        | "transformation_focused" | "skills_focused" | "community_focused";  // ← ADD
  title: string;
  content: string;
}
```

**2. Update Service System Prompt (`services/documentGeneration.service.ts`)**

```typescript
// In generateNarratives() systemPrompt, add narrative type description:

const systemPrompt = `...

Narrative Types

// ... existing types

community_focused
Emphasize community involvement, volunteer work, local connections, and desire to give back to the community.

...`;

// In generateNarratives() output format, add new type:
{
  "narratives": [
    // ... existing types
    { "type": "community_focused", "title": "Community-Focused", "content": "..." }
  ]
}
```

**3. Update Route Validation (`routes/documents.routes.ts`)**

```typescript
// In /api/regenerate-narrative endpoint
const validTypes: NarrativeType[] = [
  "justice_focused_org",
  "general_employer",
  "minimal_disclosure",
  "transformation_focused",
  "skills_focused",
  "community_focused"  // ← ADD
];
```

**4. Update Frontend** (not covered in this doc, but needed)
- Add UI for the new narrative type
- Update client-side types to match

**Result:**
- All endpoints now support the new narrative type
- Type safety maintained throughout
- No breaking changes to existing functionality

---

### Adding a New Endpoint

**Example: Add endpoint to generate a cover letter**

**1. Update Types (`types/documents.ts`)**

```typescript
// Add new type
export interface CoverLetter {
  id: string;
  title: string;
  content: string;
}

// Update ToolType if needed
export type ToolType = "narrative" | "responseLetter" | "coverLetter" | "both";
```

**2. Create Service Function (`services/documentGeneration.service.ts`)**

```typescript
export async function generateCoverLetter(formData: FormData): Promise<CoverLetter> {
  const systemPrompt = `You are an expert at writing professional cover letters...`;

  const userPrompt = `Generate a cover letter for:
  Job Title: ${formData.jobTitle}
  Employer: ${formData.employerName}
  Skills: ${formData.skills.join(", ")}
  ...`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  const parsed = JSON.parse(content);

  return {
    id: "cover-letter-1",
    title: parsed.letter.title,
    content: parsed.letter.content
  };
}
```

**3. Add Route Handler (`routes/documents.routes.ts`)**

```typescript
documentsRouter.post("/generate-cover-letter", async (req: Request, res: Response) => {
  try {
    const { formData } = req.body as { formData: FormData };

    if (!formData) {
      return res.status(400).json({
        error: "Missing formData in request"
      });
    }

    const coverLetter = await generateCoverLetter(formData);
    console.log('📊 ANALYTICS: Generated cover letter');
    return res.json({ coverLetter });
  } catch (error) {
    console.error("Error in generate-cover-letter:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to generate cover letter"
    });
  }
});
```

**4. Update Documentation**
- Add endpoint to this document
- Update API documentation
- Update request/response examples

**Result:**
- New endpoint: `POST /api/generate-cover-letter`
- Follows same patterns as existing endpoints
- Type-safe throughout
- Consistent error handling

---

### Best Practices for Extensions

**1. Maintain Type Safety**
- Always update TypeScript types first
- Let TypeScript guide you to all places that need updates

**2. Follow Existing Patterns**
- Services: Pure functions, throw errors, no HTTP concerns
- Routes: Thin handlers, validate input, catch service errors
- Use same JSON response formats

**3. Keep Prompts in Services**
- System prompts define AI behavior
- User prompts format user data
- Never put prompts in routes

**4. Test Incrementally**
- Test service function independently first
- Then test route handler
- Finally test end-to-end

**5. Document as You Go**
- Update this document for new endpoints
- Add JSDoc comments to new functions
- Update type documentation

---

## Common Pitfalls

### 1. OpenAI Client Initialization

**❌ Don't:**
```typescript
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
```

**✅ Do:**
```typescript
import { getOpenAI } from "../config/openaiClient.js";
const openai = getOpenAI();  // Lazy loading ensures env vars are loaded
```

### 2. Error Handling in Routes

**❌ Don't:**
```typescript
// Throwing in route without catching
app.post("/api/generate", async (req, res) => {
  const result = await generateNarratives(formData);  // Can throw!
  res.json(result);
});
```

**✅ Do:**
```typescript
// Catch and format errors
app.post("/api/generate", async (req, res) => {
  try {
    const result = await generateNarratives(formData);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to generate"
    });
  }
});
```

### 3. Response Formats

**❌ Don't:**
```typescript
// Inconsistent response formats
return res.json({ data: narrative });  // Different from other endpoints
```

**✅ Do:**
```typescript
// Follow established patterns
return res.json({ narrative });  // Matches /api/regenerate-narrative
```

### 4. Modifying FormData Shape

**❌ Don't:**
```typescript
// Breaking change to FormData
interface FormData {
  // Removed: offenses: Offense[]  ← BREAKS EXISTING CODE
  backgroundInfo: string;  // New field
}
```

**✅ Do:**
```typescript
// Additive changes only
interface FormData {
  offenses: Offense[];  // Keep existing
  backgroundInfo?: string;  // Add as optional
}
```

---

## Summary

**Module Responsibilities:**

| Module | Responsibility | Dependencies |
|--------|---------------|--------------|
| `config/openaiClient.ts` | Provide OpenAI client | Environment variables |
| `types/documents.ts` | Define domain types | None |
| `services/documentGeneration.service.ts` | AI generation logic | OpenAI client, types |
| `routes/documents.routes.ts` | HTTP endpoints | Services, types |

**Data Flow:**

```
Client → Route → Service → OpenAI → Service → Route → Client
         (validate)  (generate)          (parse)  (format)
```

**Error Flow:**

```
Service throws → Route catches → Route formats error response → Client
                                ↓ (if uncaught)
                         Global error handler
```

**Extension Points:**
- Add narrative types: Update types, prompts, validation
- Add endpoints: Create service function, add route handler
- Modify prompts: Edit service functions only

**Key Principles:**
- Services are pure, framework-agnostic business logic
- Routes are thin HTTP adapters
- Types ensure consistency across layers
- Errors bubble up and are formatted at route level

---

**For More Information:**
- Backend Architecture: `docs/backend-express-architecture.md`
- API Endpoints: See route handlers in `server/routes/documents.routes.ts`
- Type Definitions: See `server/types/documents.ts`
