import type { GenerateDocumentsRequest, GenerateDocumentsResponse } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function generateDocuments(
  request: GenerateDocumentsRequest
): Promise<GenerateDocumentsResponse> {
  const response = await apiRequest("POST", "/api/generate-documents", request);
  return response.json();
}
