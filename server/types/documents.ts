/**
 * Specifies which document type(s) to generate.
 */
export type ToolType = "narrative" | "responseLetter" | "both";

/**
 * Details about a specific offense from the user's background.
 */
export interface Offense {
  id: string;
  type: string;
  description: string;
  programs: string[]; // Rehabilitation programs related to this offense
}

/**
 * User's complete background information collected from the multi-step form.
 * Used as input for AI document generation.
 */
export interface FormData {
  offenses: Offense[];
  releaseMonth: string;
  releaseYear: string;
  programs: string[]; // All rehabilitation programs completed
  skills: string[]; // Skills developed
  additionalContext: string;
  jobTitle: string; // Position applying for
  employerName: string;
  ownership: string; // OIL framework: Taking responsibility
  impact: string; // OIL framework: How it affected others
  lessonsLearned: string; // OIL framework: What has changed
  clarifyingRelevanceEnabled: boolean;
  clarifyingRelevance: string;
  qualifications: string;
  useResumeAndJobPosting: boolean;
  resumeText: string;
  jobPostingText: string;
}

/**
 * Request body for POST /api/generate-documents endpoint.
 */
export interface GenerateRequest {
  selection: ToolType; // What to generate (narratives, letter, or both)
  formData: FormData; // User's background information
}

/**
 * A single generated disclosure narrative.
 */
export interface NarrativeItem {
  id: string;
  type: "justice_focused_org" | "general_employer" | "minimal_disclosure" | "transformation_focused" | "skills_focused";
  title: string;
  content: string; // The actual narrative text
}

/**
 * A generated pre-adverse action response letter.
 */
export interface ResponseLetter {
  id: string;
  title: string;
  content: string; // The actual letter text
}

/**
 * Error details for a failed document generation.
 */
export interface DocumentError {
  documentType: "narrative" | "responseLetter";
  detail: string; // Error message
}

/**
 * Response body from POST /api/generate-documents endpoint.
 */
export interface GenerateResponse {
  status: "success" | "partial_fail" | "total_fail";
  narratives: NarrativeItem[]; // Generated narratives (empty if not requested or failed)
  responseLetter: ResponseLetter | null; // Generated letter (null if not requested or failed)
  errors: DocumentError[]; // Errors that occurred during generation
}

/**
 * The five types of disclosure narratives that can be generated.
 */
export type NarrativeType = "justice_focused_org" | "general_employer" | "minimal_disclosure" | "transformation_focused" | "skills_focused";

/**
 * Metadata for each narrative type (title and description).
 * Used for AI prompts and UI display.
 */
export const narrativeTypeInfo: Record<NarrativeType, { title: string; description: string }> = {
  justice_focused_org: {
    title: "Justice-Focused Organization",
    description: "For justice-focused or re-entry organizations and employers with strong fair chance hiring practices, highlighting how your lived experience and growth align with mission-driven work and fair chance values."
  },
  general_employer: {
    title: "General Employer",
    description: "A balanced, professional narrative that works for most employers and focuses on stability, reliability, and readiness to work."
  },
  minimal_disclosure: {
    title: "Minimal-Disclosure",
    description: "A concise narrative that acknowledges your record without going into unnecessary detail, keeping the focus on the present."
  },
  transformation_focused: {
    title: "Transformation-Focused",
    description: "Centers your rehabilitation and personal growth, emphasizing programs completed, insights gained, and the changes you've made."
  },
  skills_focused: {
    title: "Skills-Focused",
    description: "Leads with your skills, training, and strengths, briefly acknowledging your record and returning quickly to what you bring to the job."
  }
};
