export type ToolType = "narrative" | "responseLetter" | "both";

export interface Offense {
  id: string;
  type: string;
  description: string;
  programs: string[];
}

export interface FormState {
  currentStep: number;
  offenses: Offense[];
  releaseMonth: string;
  releaseYear: string;
  programs: string[];
  skills: string[];
  additionalContext: string;
  jobTitle: string;
  employerName: string;
  ownership: string;
  impact: string;
  lessonsLearned: string;
  clarifyingRelevanceEnabled: boolean | null;
  clarifyingRelevance: string;
  qualifications: string;
  useResumeAndJobPosting: boolean;
  resumeText: string;
  jobPostingText: string;
  errors: Record<string, string>;
}

export type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: unknown }
  | { type: "ADD_OFFENSE" }
  | { type: "REMOVE_OFFENSE"; id: string }
  | { type: "UPDATE_OFFENSE"; id: string; field: keyof Offense; value: unknown }
  | { type: "ADD_OFFENSE_PROGRAM"; offenseId: string; program: string }
  | { type: "REMOVE_OFFENSE_PROGRAM"; offenseId: string; index: number }
  | { type: "ADD_CHIP"; field: "programs" | "skills"; value: string }
  | { type: "REMOVE_CHIP"; field: "programs" | "skills"; index: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "CLEAR_ERRORS" };

export const initialFormState: FormState = {
  currentStep: 1,
  offenses: [{ id: "1", type: "", description: "", programs: [] }],
  releaseMonth: "",
  releaseYear: "",
  programs: [],
  skills: [],
  additionalContext: "",
  jobTitle: "",
  employerName: "",
  ownership: "",
  impact: "",
  lessonsLearned: "",
  clarifyingRelevanceEnabled: null,
  clarifyingRelevance: "",
  qualifications: "",
  useResumeAndJobPosting: false,
  resumeText: "",
  jobPostingText: "",
  errors: {},
};

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "ADD_OFFENSE":
      return {
        ...state,
        offenses: [
          ...state.offenses,
          { id: Date.now().toString(), type: "", description: "", programs: [] },
        ],
      };

    case "REMOVE_OFFENSE":
      if (state.offenses.length <= 1) return state;
      return {
        ...state,
        offenses: state.offenses.filter((o) => o.id !== action.id),
      };

    case "UPDATE_OFFENSE":
      return {
        ...state,
        offenses: state.offenses.map((o) =>
          o.id === action.id ? { ...o, [action.field]: action.value } : o
        ),
      };

    case "ADD_OFFENSE_PROGRAM":
      return {
        ...state,
        offenses: state.offenses.map((o) =>
          o.id === action.offenseId
            ? { ...o, programs: [...o.programs, action.program] }
            : o
        ),
      };

    case "REMOVE_OFFENSE_PROGRAM":
      return {
        ...state,
        offenses: state.offenses.map((o) =>
          o.id === action.offenseId
            ? { ...o, programs: o.programs.filter((_, i) => i !== action.index) }
            : o
        ),
      };

    case "ADD_CHIP":
      return {
        ...state,
        [action.field]: [...state[action.field], action.value],
      };

    case "REMOVE_CHIP":
      return {
        ...state,
        [action.field]: state[action.field].filter((_, i) => i !== action.index),
      };

    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1, errors: {} };

    case "PREV_STEP":
      return { ...state, currentStep: Math.max(1, state.currentStep - 1), errors: {} };

    case "SET_ERRORS":
      return { ...state, errors: action.errors };

    case "CLEAR_ERRORS":
      return { ...state, errors: {} };

    default:
      return state;
  }
}

export function getTotalSteps(tool: ToolType): number {
  return tool === "narrative" ? 3 : 9;
}

export function getStepTitle(step: number, tool: ToolType): string {
  const sharedTitles: Record<number, string> = {
    1: "Background Information",
    2: "Programs & Skills",
    3: "Additional Context",
  };

  const conditionalTitles: Record<number, string> = {
    4: "Job Application Details",
    5: "Ownership",
    6: "Impact",
    7: "Lessons Learned",
    8: "Clarifying Relevance",
    9: "Reinforcing Qualifications",
  };

  if (step <= 3) return sharedTitles[step];
  if (tool !== "narrative") return conditionalTitles[step] || "";
  return "";
}

export type GenerationStatus = "idle" | "loading" | "success" | "error";

export type GenerationErrorType = "network" | "server" | "timeout" | "unknown";

export interface GenerationError {
  type: GenerationErrorType;
  message: string;
}

export interface GenerationState {
  status: GenerationStatus;
  error: GenerationError | null;
  retryCount: number;
}

export const initialGenerationState: GenerationState = {
  status: "idle",
  error: null,
  retryCount: 0,
};

export function getErrorMessage(errorType: GenerationErrorType): string {
  switch (errorType) {
    case "network":
      return "Please check your internet connection and try again.";
    case "server":
      return "Our service is temporarily unavailable. Please try again in a moment.";
    case "timeout":
      return "The request took too long. Please try again.";
    case "unknown":
    default:
      return "Something unexpected happened. Please try again.";
  }
}
