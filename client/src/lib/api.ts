import { NarrativeItem, ResponseLetter } from "./resultsPersistence";
import { FormState } from "./formState";

type FormData = Omit<FormState, "currentStep" | "errors">;

export interface RegenerateNarrativeResponse {
  narrative?: NarrativeItem;
  error?: string;
}

export interface RegenerateLetterResponse {
  letter?: ResponseLetter;
  error?: string;
}

export async function regenerateNarrative(
  narrativeType: NarrativeItem["type"],
  formData: FormData
): Promise<RegenerateNarrativeResponse> {
  try {
    const response = await fetch("/api/regenerate-narrative", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ narrativeType, formData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.error || "Failed to regenerate narrative. Please try again." };
    }

    return response.json();
  } catch (e) {
    console.error("Regenerate narrative error:", e);
    return { error: "Network error. Please check your connection and try again." };
  }
}

export async function regenerateLetter(
  formData: FormData
): Promise<RegenerateLetterResponse> {
  try {
    const response = await fetch("/api/regenerate-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.error || "Failed to regenerate letter. Please try again." };
    }

    return response.json();
  } catch (e) {
    console.error("Regenerate letter error:", e);
    return { error: "Network error. Please check your connection and try again." };
  }
}
