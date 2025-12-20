import OpenAI from "openai";

/**
 * Singleton OpenAI client instance (lazy-loaded).
 *
 * Initialized on first call to getOpenAI() to ensure environment variables
 * are loaded by dotenv before client instantiation.
 */
let openaiClient: OpenAI | null = null;

/**
 * Returns the singleton OpenAI client instance.
 *
 * Lazy-loads the client on first call to avoid ES module hoisting issues.
 * ES modules execute imports before runtime code, so instantiating OpenAI
 * at module level would happen BEFORE dotenv loads environment variables
 * in server/index.ts, resulting in undefined API keys.
 *
 * @returns {OpenAI} Configured OpenAI client instance
 */
export function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return openaiClient;
}
