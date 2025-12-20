import { Router, type Request, type Response } from "express";
import type {
  GenerateRequest,
  NarrativeType,
  FormData,
  GenerateResponse
} from "../types/documents.js";
import {
  generateNarratives,
  generateSingleNarrative,
  generateResponseLetter
} from "../services/documentGeneration.service.js";

export const documentsRouter = Router();

/**
 * POST /api/generate-documents
 *
 * Generates disclosure narratives and/or response letter based on user selection.
 *
 * Request body: { selection: ToolType, formData: FormData }
 * Response: GenerateResponse with status ("success" | "partial_fail" | "total_fail"),
 *           narratives array, responseLetter object, and errors array
 *
 * Handles partial failures gracefully - if one document type fails, the other may still succeed.
 */
documentsRouter.post("/generate-documents", async (req: Request, res: Response) => {
  try {
    const { selection, formData } = req.body as GenerateRequest;

    if (!selection || !formData) {
      return res.status(400).json({
        status: "total_fail",
        narratives: [],
        responseLetter: null,
        errors: [{ documentType: "narrative", detail: "Missing selection or formData in request" }]
      });
    }

    const needsNarratives = selection === "narrative" || selection === "both";
    const needsResponseLetter = selection === "responseLetter" || selection === "both";

    const result: GenerateResponse = {
      status: "success",
      narratives: [],
      responseLetter: null,
      errors: []
    };

    let narrativesSuccess = true;
    let responseLetterSuccess = true;

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

    if (needsResponseLetter) {
      try {
        result.responseLetter = await generateResponseLetter(formData);
        console.log('📊 ANALYTICS: Generated response letter');
      } catch (error) {
        responseLetterSuccess = false;
        result.errors.push({
          documentType: "responseLetter",
          detail: error instanceof Error ? error.message : "Failed to generate response letter"
        });
      }
    }

    if (needsNarratives && needsResponseLetter) {
      if (!narrativesSuccess && !responseLetterSuccess) {
        result.status = "total_fail";
        return res.status(500).json(result);
      } else if (!narrativesSuccess || !responseLetterSuccess) {
        result.status = "partial_fail";
      }
    } else if (needsNarratives && !narrativesSuccess) {
      result.status = "total_fail";
      return res.status(500).json(result);
    } else if (needsResponseLetter && !responseLetterSuccess) {
      result.status = "total_fail";
      return res.status(500).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error("Error in generate-documents:", error);
    return res.status(500).json({
      status: "total_fail",
      narratives: [],
      responseLetter: null,
      errors: [{ documentType: "narrative", detail: error instanceof Error ? error.message : "Unknown server error" }]
    });
  }
});

/**
 * POST /api/regenerate-narrative
 *
 * Regenerates a single specific narrative type.
 *
 * Request body: { narrativeType: NarrativeType, formData: FormData }
 * Response: { narrative: NarrativeItem } or { error: string }
 *
 * Used when user wants to regenerate one narrative without regenerating all 5.
 */
documentsRouter.post("/regenerate-narrative", async (req: Request, res: Response) => {
  try {
    const { narrativeType, formData } = req.body as { narrativeType: NarrativeType; formData: FormData };

    if (!narrativeType || !formData) {
      return res.status(400).json({
        error: "Missing narrativeType or formData in request"
      });
    }

    const validTypes: NarrativeType[] = ["justice_focused_org", "general_employer", "minimal_disclosure", "transformation_focused", "skills_focused"];
    if (!validTypes.includes(narrativeType)) {
      return res.status(400).json({
        error: "Invalid narrative type"
      });
    }

    const narrative = await generateSingleNarrative(formData, narrativeType);
    console.log(`📊 ANALYTICS: Regenerated narrative (${narrativeType})`);
    return res.json({ narrative });
  } catch (error) {
    console.error("Error in regenerate-narrative:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to regenerate narrative"
    });
  }
});

/**
 * POST /api/regenerate-letter
 *
 * Regenerates the pre-adverse action response letter.
 *
 * Request body: { formData: FormData }
 * Response: { letter: ResponseLetter } or { error: string }
 *
 * Used when user wants to regenerate the response letter with fresh wording.
 */
documentsRouter.post("/regenerate-letter", async (req: Request, res: Response) => {
  try {
    const { formData } = req.body as { formData: FormData };

    if (!formData) {
      return res.status(400).json({
        error: "Missing formData in request"
      });
    }

    const letter = await generateResponseLetter(formData);
    console.log('📊 ANALYTICS: Regenerated response letter');
    return res.json({ letter });
  } catch (error) {
    console.error("Error in regenerate-letter:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to regenerate letter"
    });
  }
});
