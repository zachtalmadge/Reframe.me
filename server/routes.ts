import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

type ToolType = "narrative" | "responseLetter" | "both";

interface Offense {
  id: string;
  type: string;
  description: string;
  programs: string[];
}

interface FormData {
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
  clarifyingRelevanceEnabled: boolean;
  clarifyingRelevance: string;
  qualifications: string;
}

interface GenerateRequest {
  selection: ToolType;
  formData: FormData;
}

interface NarrativeItem {
  id: string;
  type: "full_disclosure" | "skills_focused" | "growth_journey" | "minimal_disclosure" | "values_aligned";
  title: string;
  content: string;
}

interface ResponseLetter {
  id: string;
  title: string;
  content: string;
}

interface DocumentError {
  documentType: "narrative" | "responseLetter";
  detail: string;
}

interface GenerateResponse {
  status: "success" | "partial_fail" | "total_fail";
  narratives: NarrativeItem[];
  responseLetter: ResponseLetter | null;
  errors: DocumentError[];
}

async function generateNarratives(formData: FormData): Promise<NarrativeItem[]> {
  const systemPrompt = `You are an expert career counselor specializing in helping individuals with criminal backgrounds prepare for employment conversations. You help create authentic, professional disclosure narratives.

Generate exactly 5 different disclosure narratives, each with a distinct approach:

1. full_disclosure - Direct & Professional: Honest, straightforward acknowledgment with emphasis on accountability and professional demeanor.
2. skills_focused - Skills-First: Leads with qualifications and abilities, briefly acknowledges background, returns focus to value offered.
3. growth_journey - Growth-Focused: Emphasizes personal transformation, rehabilitation journey, and lessons learned.
4. minimal_disclosure - Brief & Confident: Concise acknowledgment without over-explaining, projects confidence.
5. values_aligned - Values-Aligned: Connects personal values and growth to the organization's mission.

Each narrative should be 2-4 paragraphs, written in first person, ready for the individual to use in interviews or applications.

Return a JSON object with this exact structure:
{
  "narratives": [
    { "type": "full_disclosure", "title": "Direct & Professional", "content": "..." },
    { "type": "skills_focused", "title": "Skills-First Approach", "content": "..." },
    { "type": "growth_journey", "title": "Growth-Focused", "content": "..." },
    { "type": "minimal_disclosure", "title": "Brief & Confident", "content": "..." },
    { "type": "values_aligned", "title": "Values-Aligned", "content": "..." }
  ]
}`;

  const userPrompt = `Please generate 5 disclosure narratives based on the following information:

Background Information:
${formData.offenses.map((o, i) => `- Offense ${i + 1}: ${o.type}${o.description ? ` - ${o.description}` : ''}${o.programs.length > 0 ? ` (Related programs: ${o.programs.join(', ')})` : ''}`).join('\n')}

Release/Completion: ${formData.releaseMonth} ${formData.releaseYear}

Rehabilitation Programs Completed:
${formData.programs.length > 0 ? formData.programs.join(', ') : 'Not specified'}

Skills Developed:
${formData.skills.length > 0 ? formData.skills.join(', ') : 'Not specified'}

Additional Context:
${formData.additionalContext || 'None provided'}

Generate narratives that are authentic, professional, and help the individual present their background in the most favorable light while remaining honest.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  const parsed = JSON.parse(content);
  return parsed.narratives.map((n: any, index: number) => ({
    id: `narrative-${index + 1}`,
    type: n.type,
    title: n.title,
    content: n.content,
  }));
}

type NarrativeType = "full_disclosure" | "skills_focused" | "growth_journey" | "minimal_disclosure" | "values_aligned";

const narrativeTypeInfo: Record<NarrativeType, { title: string; description: string }> = {
  full_disclosure: {
    title: "Direct & Professional",
    description: "Honest, straightforward acknowledgment with emphasis on accountability and professional demeanor."
  },
  skills_focused: {
    title: "Skills-First Approach",
    description: "Leads with qualifications and abilities, briefly acknowledges background, returns focus to value offered."
  },
  growth_journey: {
    title: "Growth-Focused",
    description: "Emphasizes personal transformation, rehabilitation journey, and lessons learned."
  },
  minimal_disclosure: {
    title: "Brief & Confident",
    description: "Concise acknowledgment without over-explaining, projects confidence."
  },
  values_aligned: {
    title: "Values-Aligned",
    description: "Connects personal values and growth to the organization's mission."
  }
};

async function generateSingleNarrative(formData: FormData, narrativeType: NarrativeType): Promise<NarrativeItem> {
  const info = narrativeTypeInfo[narrativeType];
  
  const systemPrompt = `You are an expert career counselor specializing in helping individuals with criminal backgrounds prepare for employment conversations. You help create authentic, professional disclosure narratives.

Generate a single disclosure narrative using this specific approach:
- Type: ${narrativeType}
- Style: ${info.title}
- Description: ${info.description}

The narrative should be 2-4 paragraphs, written in first person, ready for the individual to use in interviews or applications. Make it fresh and different from previous versions while maintaining the same approach style.

Return a JSON object with this exact structure:
{
  "narrative": {
    "type": "${narrativeType}",
    "title": "${info.title}",
    "content": "..."
  }
}`;

  const userPrompt = `Please generate a ${info.title} disclosure narrative based on the following information:

Background Information:
${formData.offenses.map((o, i) => `- Offense ${i + 1}: ${o.type}${o.description ? ` - ${o.description}` : ''}${o.programs.length > 0 ? ` (Related programs: ${o.programs.join(', ')})` : ''}`).join('\n')}

Release/Completion: ${formData.releaseMonth} ${formData.releaseYear}

Rehabilitation Programs Completed:
${formData.programs.length > 0 ? formData.programs.join(', ') : 'Not specified'}

Skills Developed:
${formData.skills.length > 0 ? formData.skills.join(', ') : 'Not specified'}

Additional Context:
${formData.additionalContext || 'None provided'}

Generate a narrative that is authentic, professional, and helps the individual present their background in the most favorable light while remaining honest. Create a fresh version that differs from any previous iterations.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  const parsed = JSON.parse(content);
  const typeIndex = Object.keys(narrativeTypeInfo).indexOf(narrativeType) + 1;
  
  return {
    id: `narrative-${typeIndex}`,
    type: parsed.narrative.type || narrativeType,
    title: parsed.narrative.title || info.title,
    content: parsed.narrative.content,
  };
}

async function generateResponseLetter(formData: FormData): Promise<ResponseLetter> {
  const systemPrompt = `You are an expert in employment law and Fair Chance hiring practices. You help individuals craft professional pre-adverse action response letters.

A pre-adverse action response letter is sent when an employer indicates they may rescind a job offer based on background check results. The letter should:
- Be professional and formal in tone
- Address the employer's concerns directly
- Use the OIL framework (Ownership, Impact, Lessons Learned)
- Highlight qualifications and fit for the role
- Request reconsideration

Return a JSON object with this exact structure:
{
  "letter": {
    "title": "Pre-Adverse Action Response Letter",
    "content": "..."
  }
}

The content should be a complete, formal letter ready to send (including [Date], [Employer Name], salutation, body paragraphs, and professional closing).`;

  const userPrompt = `Please generate a pre-adverse action response letter based on the following information:

Position Applied For: ${formData.jobTitle || 'Not specified'}
Employer: ${formData.employerName || 'Not specified'}

Background Information:
${formData.offenses.map((o, i) => `- Offense ${i + 1}: ${o.type}${o.description ? ` - ${o.description}` : ''}`).join('\n')}

Release/Completion: ${formData.releaseMonth} ${formData.releaseYear}

OIL FRAMEWORK:

Ownership (Taking responsibility):
${formData.ownership || 'Not specified'}

Impact (How it affected others and myself):
${formData.impact || 'Not specified'}

Lessons Learned:
${formData.lessonsLearned || 'Not specified'}

${formData.clarifyingRelevanceEnabled && formData.clarifyingRelevance ? `Clarifying Relevance to Position:\n${formData.clarifyingRelevance}\n` : ''}

Qualifications & Fit for Role:
${formData.qualifications || 'Not specified'}

Rehabilitation Programs Completed:
${formData.programs.length > 0 ? formData.programs.join(', ') : 'Not specified'}

Skills Developed:
${formData.skills.length > 0 ? formData.skills.join(', ') : 'Not specified'}

Generate a professional, compelling letter that acknowledges the background check findings while making a strong case for reconsideration.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  const parsed = JSON.parse(content);
  return {
    id: "response-letter-1",
    title: parsed.letter.title,
    content: parsed.letter.content,
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/generate-documents", async (req: Request, res: Response) => {
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

  app.post("/api/regenerate-narrative", async (req: Request, res: Response) => {
    try {
      const { narrativeType, formData } = req.body as { narrativeType: NarrativeType; formData: FormData };

      if (!narrativeType || !formData) {
        return res.status(400).json({
          error: "Missing narrativeType or formData in request"
        });
      }

      const validTypes: NarrativeType[] = ["full_disclosure", "skills_focused", "growth_journey", "minimal_disclosure", "values_aligned"];
      if (!validTypes.includes(narrativeType)) {
        return res.status(400).json({
          error: "Invalid narrative type"
        });
      }

      const narrative = await generateSingleNarrative(formData, narrativeType);
      return res.json({ narrative });
    } catch (error) {
      console.error("Error in regenerate-narrative:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to regenerate narrative"
      });
    }
  });

  app.post("/api/regenerate-letter", async (req: Request, res: Response) => {
    try {
      const { formData } = req.body as { formData: FormData };

      if (!formData) {
        return res.status(400).json({
          error: "Missing formData in request"
        });
      }

      const letter = await generateResponseLetter(formData);
      return res.json({ letter });
    } catch (error) {
      console.error("Error in regenerate-letter:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to regenerate letter"
      });
    }
  });

  return httpServer;
}
