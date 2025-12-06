import type {
  GenerateDocumentsRequest,
  GenerateDocumentsResponse,
  Narrative,
  ResponseLetter,
  NarrativeType,
} from "@shared/schema";

const NARRATIVE_CONFIGS: Array<{ type: NarrativeType; title: string }> = [
  { type: "honest", title: "The Honest Approach" },
  { type: "brief", title: "The Brief Acknowledgment" },
  { type: "detailed", title: "The Detailed Explanation" },
  { type: "skills-focused", title: "The Skills-Focused Approach" },
  { type: "growth", title: "The Growth Story" },
];

function generateNarrativeContent(
  type: NarrativeType,
  formData: GenerateDocumentsRequest["formData"]
): string {
  const { offenses, releaseMonth, releaseYear, programs, skills, additionalContext } = formData;
  const offenseTypes = offenses.map((o) => o.type).join(", ");
  const skillsList = skills.length > 0 ? skills.join(", ") : "various skills";
  const programsList = programs.length > 0 ? programs.join(", ") : "rehabilitation programs";

  switch (type) {
    case "honest":
      return `I want to be upfront with you about my background. In the past, I made some serious mistakes that led to a ${offenseTypes} conviction. I was released in ${releaseMonth} ${releaseYear}, and since then, I've been committed to making positive changes in my life.

During my time away, I participated in ${programsList}, which helped me develop ${skillsList}. ${additionalContext ? `${additionalContext} ` : ""}I understand if this gives you pause, but I'm hoping you'll consider giving me the opportunity to prove myself through my work ethic and dedication.

I believe everyone deserves a second chance, and I'm ready to demonstrate that I can be a valuable, trustworthy member of your team.`;

    case "brief":
      return `I should mention that I have a criminal record from several years ago. I was released in ${releaseMonth} ${releaseYear} and have since focused on building new skills and contributing positively to my community.

I've completed ${programsList} and developed expertise in ${skillsList}. I'm fully committed to this career path and would appreciate the opportunity to discuss how my experience and skills can benefit your organization.`;

    case "detailed":
      return `I'd like to share some important context about my background. Prior to ${releaseMonth} ${releaseYear}, I was incarcerated for ${offenseTypes}. I take full responsibility for my past actions and the harm they caused.

While incarcerated, I made the most of my time by participating in ${programsList}. These programs helped me develop ${skillsList} and gain new perspectives on how I want to live my life going forward.

${additionalContext ? `${additionalContext}\n\n` : ""}Since my release, I've maintained a clean record and focused entirely on rebuilding my life through honest work and continuous self-improvement. I understand that my background may raise concerns, and I'm prepared to address any questions you might have. I'm committed to proving through my actions that I've changed and that I can be a reliable, hardworking employee.`;

    case "skills-focused":
      return `I'm excited to bring my skills in ${skillsList} to this position. Over the past few years, I've worked hard to develop these competencies through dedicated training and practice.

My background includes experience with ${programsList}, where I honed practical skills that directly apply to this role. ${additionalContext ? `${additionalContext} ` : ""}I should also mention that I have a criminal record from before ${releaseMonth} ${releaseYear}, but I've used that experience as motivation to build a new career path.

I'm confident that my skills and work ethic will make me a valuable addition to your team, and I'm eager to demonstrate what I can contribute.`;

    case "growth":
      return `The person I am today is very different from who I was before ${releaseMonth} ${releaseYear}. A ${offenseTypes} conviction was a turning point in my life that forced me to confront my choices and commit to genuine change.

I channeled my energy into ${programsList}, developing valuable skills in ${skillsList}. ${additionalContext ? `${additionalContext} ` : ""}These experiences taught me discipline, accountability, and the importance of integrity in everything I do.

My journey has given me unique perspectives on resilience and personal growth. I've learned that setbacks can become stepping stones when approached with the right mindset. I'm now focused on building a meaningful career where I can apply what I've learned and contribute positively to a team that's willing to see my potential.`;
  }
}

function generateMockNarratives(
  formData: GenerateDocumentsRequest["formData"]
): Narrative[] {
  return NARRATIVE_CONFIGS.map((config, index) => ({
    id: `narrative-${index + 1}`,
    type: config.type,
    title: config.title,
    content: generateNarrativeContent(config.type, formData),
  }));
}

function generateMockResponseLetter(
  formData: GenerateDocumentsRequest["formData"]
): ResponseLetter {
  const {
    jobTitle,
    employerName,
    ownership,
    impact,
    lessonsLearned,
    clarifyingRelevance,
    qualifications,
    offenses,
    releaseMonth,
    releaseYear,
    programs,
    skills,
  } = formData;

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const offenseTypes = offenses.map((o) => o.type).join(", ");
  const skillsList = skills.length > 0 ? skills.join(", ") : "relevant professional skills";
  const programsList = programs.length > 0 ? programs.join(", ") : "rehabilitation and education programs";

  const content = `${formattedDate}

To Whom It May Concern at ${employerName || "[Employer Name]"},

RE: Response to Pre-Adverse Action Notice for ${jobTitle || "[Position Title]"} Position

I am writing in response to the pre-adverse action notice I received regarding my application for the ${jobTitle || "[Position Title]"} position. I appreciate the opportunity to provide additional context about my background before a final decision is made.

${ownership ? `TAKING RESPONSIBILITY\n${ownership}\n\n` : ""}I acknowledge my past conviction for ${offenseTypes}, which occurred prior to my release in ${releaseMonth} ${releaseYear}. I take full responsibility for my actions and the consequences they had on others.

${impact ? `UNDERSTANDING THE IMPACT\n${impact}\n\n` : ""}${lessonsLearned ? `LESSONS LEARNED\n${lessonsLearned}\n\n` : ""}REHABILITATION AND GROWTH
Since my release, I have been committed to personal and professional growth. I have completed ${programsList}, which have equipped me with ${skillsList}. These experiences have fundamentally changed my outlook and prepared me to be a responsible, contributing member of the workforce.

${clarifyingRelevance ? `RELEVANCE TO THE POSITION\n${clarifyingRelevance}\n\n` : ""}${qualifications ? `MY QUALIFICATIONS\n${qualifications}\n\n` : ""}I understand that background check results are an important part of your hiring process, and I respect your need to ensure a safe and trustworthy workplace. However, I hope you will consider the significant changes I have made in my life and the dedication I have shown to becoming a productive member of society.

I would welcome the opportunity to discuss my background further and demonstrate why I would be a valuable addition to your team. Please feel free to contact me if you have any questions or would like additional information.

Thank you for your time and consideration.

Sincerely,
[Your Name]
[Your Contact Information]`;

  return {
    content,
    formattedDate,
  };
}

export async function generateDocuments(
  request: GenerateDocumentsRequest
): Promise<GenerateDocumentsResponse> {
  const { tool, formData } = request;

  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  const needsNarratives = tool === "narrative" || tool === "both";
  const needsLetter = tool === "responseLetter" || tool === "both";

  const narratives = needsNarratives ? generateMockNarratives(formData) : undefined;
  const responseLetter = needsLetter ? generateMockResponseLetter(formData) : undefined;

  return {
    status: "success",
    narratives,
    responseLetter,
  };
}
