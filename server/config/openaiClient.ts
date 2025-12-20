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

export function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return openaiClient;
}
