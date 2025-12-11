import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
  const systemPrompt = `You are an expert career counselor specializing in helping individuals with criminal backgrounds prepare for employment conversations. You help create authentic, professional disclosure narratives that feel natural and human, not robotic.

Your task:
Generate exactly 5 different disclosure narratives, each with a distinct approach:

1. justice_focused_org - Justice-Focused Organization:
   - For justice-focused or re-entry organizations and employers with strong fair chance hiring practices.
   - Emphasize how the person's lived experience and growth align with mission-driven work and fair chance values.
   - It should sound like something they could say to a hiring manager at a nonprofit, community-based organization, or fair chance employer.

2. general_employer - General Employer:
   - A balanced, professional narrative suitable for most employers.
   - Focus on stability, reliability, and readiness to work.
   - Use everyday, plain language that would feel natural in a typical interview.

3. minimal_disclosure - Minimal-Disclosure:
   - Concise acknowledgment of the record without unnecessary detail.
   - Project calm confidence and keep the focus on the present and near future.
   - Use a soft, respectful lead-in (for example: “I also want to be upfront that…”), and do not go into graphic or sensational details.

4. transformation_focused - Transformation-Focused:
   - Center rehabilitation and personal growth, including programs completed, insights gained, routines, supports, and the changes made since the offense(s).
   - Spend more time on what has changed and how they live differently now than on the original incident.

5. skills_focused - Skills-Focused:
   - Lead with skills, training, work history, and strengths.
   - Briefly acknowledge the record in the middle of the narrative, then quickly return to how their skills match the job and what they bring to the role.

Tone and general requirements for ALL narratives:

- Each narrative must be written in the first person ("I") and should sound like something the person could realistically say out loud in an interview or conversation with an employer.
- Use natural, conversational language (including contractions where appropriate) while remaining respectful and professional.
- Vary sentence length and structure so it does not read like a rigid template.

Shared elements you can draw from (palette):

Across all five narratives, you can draw from the following elements as they make sense for the style:

- Who the person is today (skills, experience, goals, or why they are interested in the job or organization).
- A clear but non-graphic acknowledgment of the record.
- A brief sense of impact and responsibility.
- Rehabilitation, programs, skills, routines, and supports that show growth and change.
- Present-day stability and reliability (work history, housing, routines, community, family, etc.).
- Fit and motivation for the role or organization (why they want to be there and what they hope to contribute).

Not every narrative needs to use all of these elements, and they do not need to appear in the same order. Let structure and emphasis vary in a natural way.

How style should influence emphasis:

- justice_focused_org:
  - Emphasize mission fit, fair chance values, and how lived experience connects to the work.
  - You might open with the organization’s mission or why this kind of work matters to them, then connect to their story and record.

- general_employer:
  - Emphasize present-day reliability, basic fit, and readiness to work.
  - Often start with skills, experience, or interest in the role; bring the record in briefly and clearly, then reassure with stability and commitment.

- minimal_disclosure:
  - Keep the record acknowledgment very brief and calm, without detail, and spend most of the narrative on present and future.
  - The acknowledgment can appear near the beginning or in the middle, but it should not dominate the narrative.

- transformation_focused:
  - Emphasize the journey and what has changed: programs, insight, routines, and supports.
  - You may start from “how life used to be” or from “how life looks now,” but give more space to growth and transformation than to the original incident.

- skills_focused:
  - Clearly lead with skills, training, and work history.
  - Tuck a short, clear acknowledgment of the record into the middle of the narrative, then end by reinforcing how their strengths match the role.

Variety across the five narratives:

- Across the 5 narratives, vary how you begin and organize the story:
  - Some can open with skills or recent work.
  - Some can open with why the person cares about the role or organization.
  - One might open by briefly acknowledging the record more directly.
- Also vary where and how you bring up the record, growth, and stability, as long as you stay honest and non-graphic.
- The five narratives must not all follow the exact same sequence or feel like copies of one template.

Length and formatting:

- Each narrative should usually be 2 paragraphs (do not exceed 2).
- Aim for roughly 180–280 words total per narrative.
- Each paragraph should have around 4–6 sentences.
- Do NOT use bullet points, numbered lists, headings, or section labels in the narratives themselves—only normal paragraphs of text.

Content quality:

- Make the narratives feel specific and grounded in the person’s offenses, timeline, programs, skills, and context, rather than generic.
- Avoid overused buzzwords and vague filler phrases like “I am very passionate about…” without concrete details.
- Each of the 5 narratives should feel noticeably different in approach and emphasis, even though they are based on the same background.

Return a JSON object with this exact structure:
{
  "narratives": [
    { "type": "justice_focused_org", "title": "Justice-Focused Organization", "content": "..." },
    { "type": "general_employer", "title": "General Employer", "content": "..." },
    { "type": "minimal_disclosure", "title": "Minimal-Disclosure", "content": "..." },
    { "type": "transformation_focused", "title": "Transformation-Focused", "content": "..." },
    { "type": "skills_focused", "title": "Skills-Focused", "content": "..." }
  ]
}`;

  const userPrompt = `Please generate 5 disclosure narratives based on the following information. Use these details to make the narratives feel specific and grounded in this person’s real background, not generic.

Background Information:
${formData.offenses
      .map(
        (o, i) =>
          `- Offense ${i + 1}: ${o.type}${o.description ? ` - ${o.description}` : ""
          }${o.programs.length > 0
            ? ` (Related programs: ${o.programs.join(", ")})`
            : ""
          }`
      )
      .join("\n")}

Release/Completion: ${formData.releaseMonth} ${formData.releaseYear}

Rehabilitation Programs Completed:
${formData.programs.length > 0 ? formData.programs.join(", ") : "Not specified"}

Skills Developed:
${formData.skills.length > 0 ? formData.skills.join(", ") : "Not specified"}

Additional Context (anything that might help explain the situation, responsibilities, growth, or current stability):
${formData.additionalContext || "None provided"}

Guidance for how to use this information:

- Weave in relevant programs and skills as part of the growth story and what the person offers today.
- When mentioning the record, keep details clear but non-graphic and avoid sensational language.
- Write each narrative so it could be spoken out loud in a calm, steady tone during an interview.
- Avoid bullet points or lists in the narratives themselves—just use paragraphs of natural-sounding first-person text.

Generate narratives that are authentic, professional, and help the individual present their background in the most favorable light while remaining honest.`;

  const response = await getOpenAI().chat.completions.create({
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

async function generateSingleNarrative(formData: FormData, narrativeType: NarrativeType): Promise<NarrativeItem> {
  const info = narrativeTypeInfo[narrativeType];

  const systemPrompt = `You are an expert career counselor specializing in helping individuals with criminal backgrounds prepare for employment conversations. You help create authentic, professional disclosure narratives that feel natural and human, not robotic.

Generate a single disclosure narrative using this specific approach:
- Type: ${narrativeType}
- Style: ${info.title}
- Description: ${info.description}

Tone and general requirements:

- The narrative must be written in the first person ("I") and should sound like something the person could realistically say out loud in an interview or conversation with an employer.
- Use natural, conversational language (including contractions where appropriate) while remaining respectful and professional.
- Vary sentence length and structure so it does not read like a rigid template.
- Apply the style described above (title and description) in a concrete way that fits this person’s background and feels like their voice.

Shared elements you can draw from (palette):

For this narrative, you can draw from the following elements as they make sense for the style:

- Who the person is today (skills, experience, goals, or why they are interested in the job or organization).
- A clear but non-graphic acknowledgment of the record.
- A brief sense of impact and responsibility.
- Rehabilitation, programs, skills, routines, and supports that show growth and change.
- Present-day stability and reliability (work history, housing, routines, community, family, etc.).
- Fit and motivation for the role or organization (why they want to be there and what they hope to contribute).

You do not need to use all of these elements, and they do not need to appear in any fixed order. Choose a structure and emphasis that feels natural for this person and this specific style.

How style should influence emphasis for this narrative (do not treat these as strict step-by-step instructions):

- justice_focused_org:
  - Emphasize mission fit, fair chance values, and how lived experience connects to the work.
  - You might highlight the organization’s mission, the person’s lived experience, and why this work matters to them in any order that feels natural.

- general_employer:
  - Emphasize present-day reliability, basic fit, and readiness to work.
  - You can bring in skills, experience, interest in the role, and a brief acknowledgment of the record in whatever sequence feels like a realistic conversation, as long as the record is addressed clearly and calmly.

- minimal_disclosure:
  - Keep the record acknowledgment very brief and calm, without detail, and spend most of the narrative on present and future.
  - The acknowledgment can appear near the beginning, in the middle, or later in the narrative, but it should not dominate the narrative or feel like the main focus.

- transformation_focused:
  - Emphasize the journey and what has changed: programs, insight, routines, and supports.
  - You may choose to start from how life used to be, from how life looks now, or from a key turning point, as long as the arc clearly shows growth and transformation without being graphic about the original incident.

- skills_focused:
  - Emphasize skills, training, and work history as a major thread of the narrative.
  - Include a short, clear acknowledgment of the record somewhere in the narrative, and make sure the overall emphasis returns to what they can do in the role.

Variety for this regenerated narrative:

- This regenerated narrative does NOT need to follow the same order, opening, or flow as any previous narrative of this style.
- You can choose a different way to begin (for example, starting with skills, with motivation for the role, with a brief acknowledgment of the past, or with how life looks now).
- You can introduce the record at a different point than before, as long as you remain honest, non-graphic, and consistent with the facts.
- Keep the overall length and level of detail roughly similar to the other narratives this person received. Do not make this version significantly longer just to be different.

Length and formatting:

- The narrative should usually be 1–2 paragraphs (do not exceed 2).
- Aim for about 180–280 words total.
- Each paragraph should have roughly 4–6 sentences.
- Do NOT use bullet points, numbered lists, headings, or section labels in the narrative itself—only normal paragraphs of text.

Content quality:

- Make the narrative feel specific and grounded in the person’s offenses, timeline, programs, skills, and context, rather than generic.
- Avoid overused buzzwords and vague filler phrases like "I am very passionate about..." without concrete details.
- The narrative should feel like a different way the same person might explain their story on another day, without changing or contradicting the facts of their background.

Return a JSON object with this exact structure:
{
  "narrative": {
    "type": "${narrativeType}",
    "title": "${info.title}",
    "content": "..."
  }
}`;

  const userPrompt = `Please generate a ${info.title} disclosure narrative based on the following information. Use these details to make the narrative feel specific and grounded in this person’s real background, not generic.

Background Information:
${formData.offenses
      .map(
        (o, i) =>
          `- Offense ${i + 1}: ${o.type}${o.description ? ` - ${o.description}` : ""
          }${o.programs.length > 0
            ? ` (Related programs: ${o.programs.join(", ")})`
            : ""
          }`
      )
      .join("\n")}

Release/Completion: ${formData.releaseMonth} ${formData.releaseYear}

Rehabilitation Programs Completed:
${formData.programs.length > 0 ? formData.programs.join(", ") : "Not specified"}

Skills Developed:
${formData.skills.length > 0 ? formData.skills.join(", ") : "Not specified"}

Additional Context (anything that might help explain the situation, responsibilities, growth, or current stability):
${formData.additionalContext || "None provided"}

Guidance for how to use this information:

- Weave in relevant programs and skills as part of the growth story and what the person offers today.
- When you mention the record, keep details clear but non-graphic and avoid sensational language. You can place this acknowledgment wherever it feels most natural for this style and this person, as long as it’s addressed directly and respectfully.
- Write the narrative so it could be spoken out loud in a calm, steady tone during an interview.
- Avoid bullet points or numbered lists in the narrative itself—use paragraphs of natural-sounding first-person text.
- Create a fresh version that feels different in wording, opening, and flow from previous iterations, but stays consistent with the same facts and overall approach style.

Generate a narrative that is authentic, professional, and helps the individual present their background in the most favorable light while remaining honest. Create a fresh version that differs from any previous iterations.`;

  const response = await getOpenAI().chat.completions.create({
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
  const typeIndex = Object.keys(narrativeTypeInfo).indexOf(narrativeType) + 1;

  return {
    id: `narrative-${typeIndex}`,
    type: parsed.narrative.type || narrativeType,
    title: parsed.narrative.title || info.title,
    content: parsed.narrative.content,
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
- Use plain, professional language that could realistically be spoken or read in a workplace context.
- Keep the tone accountable, calm, and hopeful. Avoid begging, dramatizing, or sounding defensive.

Use of the OIL framework:
- The inputs will include three OIL sections: Ownership, Impact, Lessons Learned.
- Sometimes these fields will contain detailed user-written text; sometimes they will say "Not specified".
- When a field contains user-written text (not "Not specified"), weave that content into the letter in a natural way. You may lightly edit for clarity and tone, but do not change the core meaning.
- When a field is "Not specified", you should still include a brief perspective on that dimension (ownership, impact, or lessons), but:
  - Keep it high-level and general.
  - Do not invent specific stories, dramatic details, or descriptions of particular people harmed.
  - Rely on the known facts (offenses, programs, skills, time since release) to speak concretely about growth.

${formData.clarifyingRelevanceEnabled
  ? `Clarifying charge relevance (clarifying relevance enabled):
- The inputs include a boolean flag indicating that the candidate wants to include a section stating that their record does NOT relate to the job.
- In this case:
  - Look at the offense descriptions and the job posting responsibilities.
  - If it appears reasonable that the conviction does not directly relate to the core duties of the role (for example, an older drug offense for an office-based data job):
    - Include a short paragraph that calmly states that, based on the nature of the job, the conviction does not interfere with the candidate’s ability to perform the role.
    - It can be similar in spirit to: "It is important to note that these charges are not connected to my professional responsibilities in this role and do not affect my ability to perform the job effectively."
    - Keep the language honest and measured, not defensive or absolute.
  - If the conviction appears closely related to the core duties (for example, driving offenses for driving jobs, financial crimes for financial roles, or similar clear conflicts):
    - Do NOT claim that the conviction is unrelated to the job or has no impact.
    - In this case, do not include a "this does not relate to the job" paragraph. Focus instead on Ownership, Impact, Lessons Learned, and the candidate’s current skills, stability, and safeguards.
`
  : `Clarifying charge relevance (clarifying relevance disabled):
- The inputs include a boolean flag indicating that the candidate does NOT want to include a paragraph claiming that their record does not relate to the job.
- In this case:
  - Assume there may be some connection between the record and the role.
  - Do NOT include any paragraph that says or implies that the conviction is unrelated to the job or has no impact.
  - You should still account for the employer’s likely concern by:
    - Acknowledging that you understand why the conviction may raise questions for this role (in calm, professional language).
    - Emphasizing the time since the offense, any treatment or rehabilitation, vocational training, and current stability and reliability.
    - Framing it around: "Here is what I have done to change, and here is how I now show reliability and good judgment," rather than "this does not matter at all."
`}

Use of resume, job posting, programs, and skills:
- When resume and job posting text are provided:
  - Explicitly connect 2–3 key requirements from the job posting to concrete items from the resume, skills, and programs.
  - Show how the candidate's experience and strengths align with the responsibilities of the role.
- When resume and job posting are not provided:
  - Still highlight skills, programs, and strengths drawn from the other inputs.
- When mentioning rehabilitation programs, skills, and strengths:
  - Use specific names or categories from the inputs (for example, substance use treatment program, vocational training, teamwork with diverse people), not vague references.

Safety and ethical constraints:
- Do NOT blame or criticize people who may have been harmed by the offense.
- Do NOT minimize the seriousness of the offense (for example, avoid saying it was "not a big deal").
- Do NOT include graphic, sensational, or emotionally manipulative descriptions of the offense.
- Do NOT invent new factual details about the offense, victims, supervision conditions, or personal life that are not reasonably implied by the inputs.
- Do NOT provide legal advice, cite laws, or tell the employer what they are required to do.
- Do NOT threaten legal action or make demands. The tone should be a respectful request for reconsideration.

Length and structure:
- The letter should normally be about 3–5 paragraphs and roughly 300–500 words, unless the inputs are extremely minimal.
- Include:
  - A brief opening that acknowledges the background check and thanks the employer for the opportunity to respond.
  - One or more body paragraphs that reflect Ownership, Impact, and Lessons Learned, grounded in the provided information.
  - Depending on the offense/job relationship and the clarifying relevance setting, either:
    - A short paragraph that calmly notes the conviction does not interfere with performing the job (when honestly supportable and clarifying relevance is enabled), or
    - A short paragraph that acknowledges the employer’s concern and emphasizes growth, safeguards, and current reliability (when there may be a connection to the role, or when clarifying relevance is disabled).
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

  const userPrompt = `Please generate a pre-adverse action response letter based on the following information. Use these details to make the letter feel specific and grounded in this person’s real background, not generic.

Position Applied For:
${formData.jobTitle || "Not specified"}

Employer:
${formData.employerName || "Not specified"}

Background Information (offenses and timing):
${formData.offenses
      .map(
        (o, i) =>
          `- Offense ${i + 1}: ${o.type}${
            o.description ? ` - ${o.description}` : ""
          }`
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

Clarifying relevance setting:
${
  formData.clarifyingRelevanceEnabled
    ? "The candidate has indicated that they would like to include a paragraph stating that their record does not relate to this job, but you should only include such a paragraph if that is honestly supportable based on the offenses and job description. If it appears closely related to the core duties, do not make that claim."
    : "The candidate has NOT requested a 'this does not relate to the job' paragraph. Assume there may be some connection between the record and the role, and follow the system instructions for this case."
}

${
  formData.useResumeAndJobPosting && formData.resumeText
    ? `Candidate's Resume (use this to highlight qualifications and fit for the role):
${formData.resumeText}
`
    : ""
}${
    formData.useResumeAndJobPosting && formData.jobPostingText
      ? `Job Posting (use this to align qualifications to what the employer is seeking and to connect specific requirements to the candidate's experience):
${formData.jobPostingText}
`
      : ""
  }

Rehabilitation Programs Completed:
${formData.programs.length > 0 ? formData.programs.join(", ") : "Not specified"}

Skills and Strengths Developed:
${formData.skills.length > 0 ? formData.skills.join(", ") : "Not specified"}

Additional guidance for this letter:
- Use the candidate’s own words from Ownership, Impact, and Lessons Learned where they have provided them, lightly editing for clarity and tone.
- When any OIL field is "Not specified", include only brief, general statements for that dimension and do not invent detailed stories or new facts.
- When programs and skills are provided, connect them to current reliability, work habits, and readiness for this specific job.
- Base everything you write only on the information above. Do not make up new factual details.

Generate a professional, compelling letter that acknowledges the background check findings, reflects accountability and growth, handles the relevance of the record to the job in an honest way according to the clarifying relevance setting, reinforces the candidate’s fit for the role, and respectfully asks the employer to reconsider.`;

  const response = await getOpenAI().chat.completions.create({
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

      const validTypes: NarrativeType[] = ["justice_focused_org", "general_employer", "minimal_disclosure", "transformation_focused", "skills_focused"];
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
