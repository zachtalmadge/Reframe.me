import { ToolType, FormState } from "@/lib/formState";
import { GenerationResult } from "@/lib/resultsPersistence";

export async function generateDocuments(
  selection: ToolType,
  formData: FormState,
  timeoutMs: number = 60000 // 60 seconds
): Promise<GenerationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("/api/generate-documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selection,
        formData,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.detail || `Server error: ${response.status}`);
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);

    // Type-safe check for AbortError
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw err;
  }
}
