import { ToolType } from "./formState";

export interface NarrativeItem {
  id: string;
  type: "justice_focused_org" | "general_employer" | "minimal_disclosure" | "transformation_focused" | "skills_focused";
  title: string;
  content: string;
}

export interface ResponseLetter {
  id: string;
  title: string;
  content: string;
}

export interface DocumentError {
  documentType: "narrative" | "responseLetter";
  detail: string;
}

export interface GenerationResult {
  status: "success" | "partial_fail" | "total_fail";
  narratives: NarrativeItem[];
  responseLetter: ResponseLetter | null;
  errors: DocumentError[];
}

export interface PersistedResults {
  result: GenerationResult;
  tool: ToolType;
  timestamp: number;
  sessionId: string;
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const RESULTS_KEY = "reflectme_results";

export function saveResults(
  result: GenerationResult,
  tool: ToolType,
  sessionId?: string
): { success: boolean; error?: string } {
  try {
    const data: PersistedResults = {
      result,
      tool,
      timestamp: Date.now(),
      sessionId: sessionId || generateSessionId(),
    };

    const serialized = JSON.stringify(data);

    // Check if sessionStorage is available
    if (typeof sessionStorage === 'undefined') {
      console.error('SessionStorage not available');
      return { success: false, error: 'Storage not available' };
    }

    try {
      sessionStorage.setItem(RESULTS_KEY, serialized);
      return { success: true };
    } catch (quotaError: any) {
      if (quotaError.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded, clearing and retrying');
        clearResults();
        sessionStorage.setItem(RESULTS_KEY, serialized);
        return { success: true };
      }
      throw quotaError;
    }
  } catch (e) {
    console.error("Failed to save results:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error'
    };
  }
}

export function loadResults(): PersistedResults | null {
  try {
    const stored = sessionStorage.getItem(RESULTS_KEY);
    if (!stored) return null;

    const data: PersistedResults = JSON.parse(stored);
    
    const oneHour = 60 * 60 * 1000;
    if (Date.now() - data.timestamp > oneHour) {
      clearResults();
      return null;
    }

    return data;
  } catch (e) {
    console.error("Failed to load results:", e);
    return null;
  }
}

export function updateResults(result: GenerationResult): void {
  try {
    const existing = loadResults();
    if (!existing) return;
    
    const data: PersistedResults = {
      ...existing,
      result,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(RESULTS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to update results:", e);
  }
}

export function clearResults(): void {
  try {
    sessionStorage.removeItem(RESULTS_KEY);
  } catch (e) {
    console.error("Failed to clear results:", e);
  }
}

export function hasPersistedResults(): boolean {
  try {
    return sessionStorage.getItem(RESULTS_KEY) !== null;
  } catch (e) {
    return false;
  }
}
