import { FormState, ToolType, initialFormState } from "./formState";

const STORAGE_KEY = "reflectme_form_data";
const TOOL_KEY = "reflectme_tool_type";

export interface PersistedFormData {
  formState: FormState;
  tool: ToolType;
  timestamp: number;
}

export function saveFormData(formState: FormState, tool: ToolType): void {
  try {
    const data: PersistedFormData = {
      formState,
      tool,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save form data:", e);
  }
}

export function loadFormData(): PersistedFormData | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: PersistedFormData = JSON.parse(stored);
    
    const oneHour = 60 * 60 * 1000;
    if (Date.now() - data.timestamp > oneHour) {
      clearFormData();
      return null;
    }

    return data;
  } catch (e) {
    console.error("Failed to load form data:", e);
    return null;
  }
}

export function clearFormData(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear form data:", e);
  }
}

export function hasPersistedFormData(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  } catch (e) {
    return false;
  }
}
