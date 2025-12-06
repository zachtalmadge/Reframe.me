import type { GenerateDocumentsResponse } from "@shared/schema";

const RESULTS_KEY = "reflect_me_results";

export function saveResults(results: GenerateDocumentsResponse): void {
  try {
    sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  } catch (error) {
    console.error("Failed to save results to sessionStorage:", error);
  }
}

export function loadResults(): GenerateDocumentsResponse | null {
  try {
    const stored = sessionStorage.getItem(RESULTS_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as GenerateDocumentsResponse;
  } catch (error) {
    console.error("Failed to load results from sessionStorage:", error);
    return null;
  }
}

export function clearResults(): void {
  try {
    sessionStorage.removeItem(RESULTS_KEY);
  } catch (error) {
    console.error("Failed to clear results from sessionStorage:", error);
  }
}
