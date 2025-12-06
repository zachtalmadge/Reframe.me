import { ToolType } from "./formState";

export interface NarrativeItem {
  id: string;
  type: "full_disclosure" | "skills_focused" | "growth_journey" | "minimal_disclosure" | "values_aligned";
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

export function saveResults(result: GenerationResult, tool: ToolType, sessionId?: string): void {
  try {
    const data: PersistedResults = {
      result,
      tool,
      timestamp: Date.now(),
      sessionId: sessionId || generateSessionId(),
    };
    sessionStorage.setItem(RESULTS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save results:", e);
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
