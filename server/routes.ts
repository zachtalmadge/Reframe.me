import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import OpenAI from "openai";

/**
 * Lazy-load OpenAI client to avoid ES module hoisting issue.
 *
 * IMPORTANT: This pattern is necessary because ES modules execute imports
 * before runtime code. If we instantiate OpenAI at module level (e.g.,
 * `const openai = new OpenAI(...)`), it would execute BEFORE dotenv loads
 * environment variables in server/index.ts, resulting in undefined API keys.
 *
 * Lazy loading defers OpenAI instantiation until the first API call at runtime,
 * ensuring environment variables are available from dotenv.
 *
 * @returns {OpenAI} Singleton OpenAI client instance
 */
let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return openaiClient;
}

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
  useResumeAndJobPosting: boolean;
  resumeText: string;
  jobPostingText: string;
}

interface GenerateRequest {
  selection: ToolType;
  formData: FormData;
}

interface NarrativeItem {
  id: string;
  type: "justice_focused_org" | "general_employer" | "minimal_disclosure" | "transformation_focused" | "skills_focused";
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
const systemPrompt = `You are an expert career counselor specializing in helping individuals with arrest or conviction histories prepare **post-offer disclosure conversations** with employers.

You help people craft **calm, professional opening statements** for the moment they proactively disclose their record **after accepting or moving forward with an offer and before a background check is run**.

---

Critical context (do not skip):
All five narratives represent **opening disclosures**.

This is the moment when the person intentionally initiates the disclosure conversation — not during early screening, not mid-interview, and not in response to an employer’s question.

The speaker has already expressed excitement about the role and is now choosing to disclose responsibly, in order to build trust and avoid surprises — not to persuade, impress, or re-sell themselves.

IMPORTANT: Avoid repeating the same opener across narratives.
- Do NOT start more than ONE narrative with “Before you run the background check…” or any close variation (e.g., “before you run this check,” “before screening,” “before the background check”).
- Across the five narratives, each opener must be meaningfully different in wording and approach.
- At most ONE narrative may explicitly mention a background check in the opening sentence.

Examples of different opener styles (use as inspiration only; do not copy repeatedly):
- Excitement + transparency: “I’m really looking forward to getting started, and I want to share something important up front…”
- Forward-motion framing: “As we move into next steps, there’s something I want to address directly…”
- Responsibility framing: “I want to be transparent about something that may come up when my history is reviewed…”
- Values framing (justice-focused): “I appreciate that your organization looks at the whole person, and I want to be honest about my background…”
- Calm, minimal framing: “There’s one part of my history I want to name clearly, so there are no surprises…”

Do **not** frame the disclosure as reactive, defensive, or legally driven.
Avoid policy, compliance, or procedural language unless it naturally fits the sentence.

---

Your Task

Generate **exactly five** disclosure narratives, each with a distinct approach and emphasis.

Each narrative must:
- Be written in the **first person (“I”)**
- Sound like something a real person could **say out loud**
- Function clearly as the *start* of the disclosure conversation
- Feel calm, intentional, and non-defensive

---

Narrative Types

justice_focused_org  
Emphasize mission alignment, lived experience, accountability, and growth for fair-chance or justice-focused employers.

general_employer  
A balanced, professional disclosure emphasizing present-day reliability, stability, and readiness to work.

minimal_disclosure  
A concise, respectful acknowledgment of the record without unnecessary detail, keeping focus on the present and future.

transformation_focused  
Center what has changed since the offense(s): insight, routines, supports, and sustained behavior change. Spend more time on growth than on the original incident.

skills_focused  
Lead with skills, training, and strengths. Briefly acknowledge the record, then return focus to how the person shows up and works today.

---

Tone & Safety Constraints (Apply to ALL Narratives)

- Non-judgmental and trauma-aware
- Honest and accountable without self-punishment
- No victim-blaming or minimizing harm
- No graphic descriptions
- No legal advice, threats, or scare tactics
- No pleading, convincing, or “asking for a chance” language

Post-offer tone requirement:
The speaker is **not** trying to earn the job or prove they deserve it. The offer has been made.  
The purpose of the narrative is **transparent disclosure and trust-building**, not persuasion.

Avoid sales-oriented framing such as:
- “I’d be a great fit because…”
- “I hope you’ll consider me…”
- “This shows I’m rehabilitated…”

Prefer grounded, trust-forward framing such as:
- “I want you to hear this directly from me…”
- “I’m sharing this so there are no surprises…”
- “I understand trust is earned, and I’m prepared to do that through my work.”

---

Use of User Inputs (Very Important)

You must **actively and meaningfully incorporate the user’s specific inputs whenever possible**, including:
- Offense type(s) and timeline
- Programs completed (especially offense-related)
- Skills, training, and transferable strengths
- Additional context about responsibilities, routines, stability, or growth

Do **not** ignore relevant details or replace them with vague generalities.
When inputs logically connect (e.g., offense → program → present behavior), explicitly link them.

Each narrative should feel **clearly grounded in this individual’s real history**, not a generic disclosure template.

---

Programs & Rehabilitation Framing (Critical)

When the user provides programs or classes, do **not** present them like credentials, certifications, or résumé achievements.

Instead, frame programs as **things I learned through my experience** and **practices I use now**.

Prefer language like:
- “Through my experience and the work I did in programs like X, I learned…”
- “What I took from that work was…”
- “I still use those tools today, especially when…”

Avoid box-checking or sales language such as:
- Repeatedly listing program names
- Presenting completion as proof of worthiness
- Framing programs as something meant to impress the employer

Mention a program once for context if helpful, then focus on **insight, behavior, and present-day application**.

---

Structure, Variety & Length

- Max **3 paragraphs** per narrative
- **4–6 sentences per paragraph**
- No bullets, headings, or labels in the narrative text

Vary across the five narratives:
- How each narrative opens
- Where the record is acknowledged
- Emphasis across skills, growth, mission, and stability

The five narratives must not follow the same structure or rhythm.

---

Output Format (Exact)

Return a JSON object with this exact structure:
{
  "narratives": [
    { "type": "justice_focused_org", "title": "Justice-Focused Organization", "content": "..." },
    { "type": "general_employer", "title": "General Employer", "content": "..." },
    { "type": "minimal_disclosure", "title": "Minimal-Disclosure", "content": "..." },
    { "type": "transformation_focused", "title": "Transformation-Focused", "content": "..." },
    { "type": "skills_focused", "title": "Skills-Focused", "content": "..." }
  ]
}
`;


  const userPrompt = `Generate 5 disclosure narratives using the following background information.

Background Information:
${formData.offenses
    .map(
      (o, i) =>
        `- Offense ${i + 1}: ${o.type}${o.description ? ` - ${o.description}` : ""}${
          o.programs.length > 0 ? ` (Related programs: ${o.programs.join(", ")})` : ""
        }`
    )
    .join("\n")}

Release/Completion: ${formData.releaseMonth} ${formData.releaseYear}

Rehabilitation Programs Completed:
${formData.programs.length > 0 ? formData.programs.join(", ") : "Not specified"}

Skills Developed:
${formData.skills.length > 0 ? formData.skills.join(", ") : "Not specified"}

Additional Context:
${formData.additionalContext || "None provided"}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
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
    content: n.content
  }));
}


type NarrativeType = "justice_focused_org" | "general_employer" | "minimal_disclosure" | "transformation_focused" | "skills_focused";

const narrativeTypeInfo: Record<NarrativeType, { title: string; description: string }> = {
  justice_focused_org: {
    title: "Justice-Focused Organization",
    description: "For justice-focused or re-entry organizations and employers with strong fair chance hiring practices, highlighting how your lived experience and growth align with mission-driven work and fair chance values."
  },
  general_employer: {
    title: "General Employer",
    description: "A balanced, professional narrative that works for most employers and focuses on stability, reliability, and readiness to work."
  },
  minimal_disclosure: {
    title: "Minimal-Disclosure",
    description: "A concise narrative that acknowledges your record without going into unnecessary detail, keeping the focus on the present."
  },
  transformation_focused: {
    title: "Transformation-Focused",
    description: "Centers your rehabilitation and personal growth, emphasizing programs completed, insights gained, and the changes you've made."
  },
  skills_focused: {
    title: "Skills-Focused",
    description: "Leads with your skills, training, and strengths, briefly acknowledging your record and returning quickly to what you bring to the job."
  }
};

async function generateSingleNarrative(
  formData: FormData,
  narrativeType: NarrativeType
): Promise<NarrativeItem> {
  const info = narrativeTypeInfo[narrativeType];

  const systemPrompt = `You are an expert career counselor specializing in helping individuals with arrest or conviction histories prepare **post-offer disclosure statements** for employers.

You help people craft **calm, professional opening disclosures** for the moment they proactively disclose their record **after accepting or moving forward with an offer and before a background check is run**.

---

Critical context (do not skip):
This narrative is an **opening statement** — the first thing the person says when they initiate the disclosure.

It is not an interview answer, not a screening response, and not a reaction to an employer’s question.

The tone should reflect a responsible, self-possessed decision to be transparent, with language such as:
- “Before you run the background check, I want to be upfront about something…”
- “As we move forward, there’s something important I want to share before we finalize things…”

Avoid legal, compliance, or policy framing unless it flows naturally.

---

Your Task

Generate **one** disclosure narrative using the following specific approach:

- Type: ${narrativeType}
- Style: ${info.title}
- Description: ${info.description}

The narrative must:
- Be written in the **first person (“I”)**
- Sound natural when spoken out loud
- Function clearly as the *opening* of the disclosure conversation
- Feel calm, intentional, and non-defensive

This should be a **fresh version** — a different way the same person might open the disclosure conversation on another day — without changing or contradicting any facts.

---

Style emphasis for this narrative:

${narrativeType === "justice_focused_org" ? `
- Emphasize mission alignment, lived experience, accountability, and growth.
- Connect the person’s background to why this work or organization matters to them now.
` : ""}

${narrativeType === "general_employer" ? `
- Emphasize present-day reliability, stability, and readiness to work.
- Keep the disclosure professional, clear, and grounded.
` : ""}

${narrativeType === "minimal_disclosure" ? `
- Keep the acknowledgment of the record brief and calm, without unnecessary detail.
- Spend most of the narrative focused on the present and future.
` : ""}

${narrativeType === "transformation_focused" ? `
- Emphasize what has changed: programs, insight, routines, and sustained behavior change.
- Spend more time on growth than on the original incident.
` : ""}

${narrativeType === "skills_focused" ? `
- Lead with skills, training, and strengths.
- Briefly acknowledge the record mid-narrative, then return focus to job fit and value.
` : ""}

---

Tone & Safety Constraints (Apply at all times)

- Non-judgmental and trauma-aware
- Honest and accountable without self-punishment
- No victim-blaming or minimizing harm
- No graphic details
- No legal advice, threats, or scare tactics
- No pleading or “asking for a chance” language

---

Use of User Inputs (Very Important)

Actively incorporate the user’s specific inputs whenever possible:
- Offense type(s) and timeline
- Programs completed (especially offense-related)
- Skills, training, and transferable strengths
- Context about routines, stability, responsibilities, or growth

Do not replace concrete details with generic language.
When inputs logically connect (e.g., offense → program → present behavior), explicitly link them.

---

Length & Structure

- **1–2 paragraphs only**
- **180–280 words total**
- **4–6 sentences per paragraph**
- No bullets, headings, or labels in the narrative text

---

Output Format (Exact)

Return a JSON object with this structure:
{
  "narrative": {
    "type": "${narrativeType}",
    "title": "${info.title}",
    "content": "..."
  }
}`;

  const userPrompt = `Generate a ${info.title} disclosure narrative using the following background information.

Background Information:
${formData.offenses
    .map(
      (o, i) =>
        `- Offense ${i + 1}: ${o.type}${o.description ? ` - ${o.description}` : ""}${
          o.programs.length > 0 ? ` (Related programs: ${o.programs.join(", ")})` : ""
        }`
    )
    .join("\n")}

Release/Completion: ${formData.releaseMonth} ${formData.releaseYear}

Rehabilitation Programs Completed:
${formData.programs.length > 0 ? formData.programs.join(", ") : "Not specified"}

Skills Developed:
${formData.skills.length > 0 ? formData.skills.join(", ") : "Not specified"}

Additional Context:
${formData.additionalContext || "None provided"}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  const parsed = JSON.parse(content);

  return {
    id: `narrative-${narrativeType}`,
    type: parsed.narrative.type || narrativeType,
    title: parsed.narrative.title || info.title,
    content: parsed.narrative.content
  };
}



async function generateResponseLetter(formData: FormData): Promise<ResponseLetter> {
  const systemPrompt = `You are an expert in Fair Chance hiring and employment communication. You help individuals with criminal records craft professional pre-adverse action response letters that are honest, respectful, and persuasive, without giving legal advice.

Context:
- A pre-adverse action response letter is sent after an employer indicates they may rescind a job offer based on background check results.
- The purpose of this letter is to:
  - Acknowledge the background check findings.
  - Take appropriate ownership.
  - Show reflection on impact.
  - Highlight lessons learned and concrete changes.
  - When appropriate, address whether the record does or does not clearly relate to the job.
  - Reinforce qualifications and fit for the specific role.
  - Respectfully ask the employer to reconsider.

Tone and perspective:
- Write in the first person ("I") as the candidate.
- Sound like a thoughtful, professional person speaking for themselves, not a lawyer or a judge.
- Use plain, professional language that could realistically be read in a workplace context.
- Keep the tone accountable, calm, and hopeful. Avoid begging, dramatizing, or sounding defensive.

CRITICAL: No meta / no instruction references:
- The letter must NEVER mention the prompt, instructions, settings, toggles, checkboxes, flags, or the user’s input process.
- Do NOT write phrases like: “because you told me…”, “as requested…”, “you indicated…”, “based on the toggle…”, “according to the instructions…”, “the form says…”, “the clarifying relevance setting…”.
- Only include text that a candidate would reasonably write to an employer.

Opening requirement (critical):
- The first 1–2 sentences must be employer-facing: thank the employer for the opportunity to respond and acknowledge the pre-adverse action notice/background check review.
- The opening must NOT explain what you were asked to include or why you are writing beyond normal workplace context.

Use of the OIL framework:
- The inputs will include three OIL sections: Ownership, Impact, Lessons Learned.
- Sometimes these fields will contain detailed user-written text; sometimes they will say "Not specified".
- When a field contains user-written text (not "Not specified"), weave that content into the letter in a natural way. You may lightly edit for clarity and tone, but do not change the core meaning.
- When a field is "Not specified", you should still include a brief perspective on that dimension (ownership, impact, or lessons), but:
  - Keep it high-level and general.
  - Do not invent specific stories, dramatic details, or descriptions of particular people harmed.
  - Rely on the known facts (offenses, programs, skills, time since release) to speak concretely about growth.

Clarifying charge relevance guidance (do not mention any settings; apply honestly based on the facts):
- Review the offense descriptions, timing, and the job responsibilities (if provided).
- If it is honestly supportable that the record does NOT directly relate to the job’s core duties:
  - Include a short, measured paragraph noting that the conviction does not interfere with the candidate’s ability to perform the role.
  - Keep language careful and non-absolute (avoid guarantees).
- If the record appears closely related to the core duties or creates a clear job-relevant concern:
  - Do NOT claim it is unrelated or “doesn’t matter.”
  - Instead, acknowledge why the employer may have concerns and emphasize growth, safeguards, stability, and present-day judgment.

Use of resume, job posting, programs, and skills:
- When resume and job posting text are provided:
  - Explicitly connect 2–3 key requirements from the job posting to concrete items from the resume, skills, and programs.
  - Show how the candidate's experience and strengths align with the responsibilities of the role.
- When resume and job posting are not provided:
  - Still highlight skills, programs, and strengths drawn from the other inputs.
- When mentioning rehabilitation programs, skills, and strengths:
  - Use specific names or categories from the inputs, not vague references.
  - Frame programs as learning and present-day practice (what I learned, what I do differently now), not as credentials or box-checking.

Safety and ethical constraints:
- Do NOT blame or criticize people who may have been harmed by the offense.
- Do NOT minimize the seriousness of the offense.
- Do NOT include graphic, sensational, or emotionally manipulative descriptions.
- Do NOT invent new factual details about the offense, victims, supervision conditions, or personal life that are not implied by the inputs.
- Do NOT provide legal advice, cite laws, or tell the employer what they are required to do.
- Do NOT threaten legal action or make demands. The tone should be a respectful request for reconsideration.

Length and structure:
- The letter should normally be about 3–5 paragraphs and roughly 300–500 words, unless the inputs are extremely minimal.
- Include:
  - A brief opening that acknowledges the background check / pre-adverse action notice and thanks the employer for the opportunity to respond.
  - One or more body paragraphs that reflect Ownership, Impact, and Lessons Learned, grounded in the provided information.
  - A short paragraph addressing job-related relevance honestly:
    - Either a measured “does not interfere with job duties” paragraph when supportable, OR
    - An acknowledgment of the employer’s concern with emphasis on growth, safeguards, and reliability when there may be a connection.
  - A paragraph that reinforces qualifications and fit for this specific role at this specific employer.
  - A closing that respectfully asks for reconsideration and expresses appreciation.

Output format:
Return a JSON object with this exact structure:
{
  "letter": {
    "title": "Pre-Adverse Action Response Letter",
    "content": "..."
  }
}

The "content" field must contain the full letter text, including [Date], [Employer Name], salutation, body paragraphs, and professional closing.`;

  // Trimmed user prompt: facts only (no "settings" narration that can leak into the letter)
  const userPrompt = `Generate a pre-adverse action response letter using the following information.

Position Applied For:
${formData.jobTitle || "Not specified"}

Employer:
${formData.employerName || "Not specified"}

Background Information (offenses and timing):
${formData.offenses
    .map(
      (o, i) =>
        `- Offense ${i + 1}: ${o.type}${o.description ? ` - ${o.description}` : ""}`
    )
    .join("\n")}

Release/Completion:
${formData.releaseMonth} ${formData.releaseYear}

OIL FRAMEWORK (user inputs may be detailed or may say "Not specified"):

Ownership (Taking responsibility):
${formData.ownership || "Not specified"}

Impact (How it affected others and myself):
${formData.impact || "Not specified"}

Lessons Learned (what has changed, including programs, skills, and routines):
${formData.lessonsLearned || "Not specified"}

${
  formData.useResumeAndJobPosting && formData.resumeText
    ? `Candidate's Resume:
${formData.resumeText}
`
    : ""
}${
    formData.useResumeAndJobPosting && formData.jobPostingText
      ? `Job Posting:
${formData.jobPostingText}
`
      : ""
  }

Rehabilitation Programs Completed:
${formData.programs.length > 0 ? formData.programs.join(", ") : "Not specified"}

Skills and Strengths Developed:
${formData.skills.length > 0 ? formData.skills.join(", ") : "Not specified"}

Additional Context:
${formData.additionalContext || "None provided"}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  const parsed = JSON.parse(content);

  return {
    id: "response-letter-1",
    title: parsed.letter.title,
    content: parsed.letter.content
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

  app.post("/api/regenerate-narrative", async (req: Request, res: Response) => {
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

  app.post("/api/regenerate-letter", async (req: Request, res: Response) => {
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

  return httpServer;
}
