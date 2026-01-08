import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { emailSubscribers, emailSourceEnum } from "../db/schema/emailSubscribers.js";
import type { SubscribeRequest, SubscriptionResult, ValidationError } from "../types/email.js";

/**
 * Maximum lengths for validation.
 */
const MAX_EMAIL_LENGTH = 254;
const MAX_CONSENT_VERSION_LENGTH = 20;
const MAX_UTM_LENGTH = 200;

/**
 * Simple email regex for basic validation.
 * Checks for: something@something.something
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes an email address: trims whitespace and converts to lowercase.
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validates the subscribe request input.
 *
 * @returns null if valid, or ValidationError if invalid
 */
export function validateSubscribeRequest(input: unknown): ValidationError | null {
  if (!input || typeof input !== "object") {
    return { error: "Request body must be a JSON object" };
  }

  const body = input as Record<string, unknown>;

  // Validate email
  if (!body.email || typeof body.email !== "string") {
    return { error: "Email is required", field: "email" };
  }

  const email = body.email.trim();
  if (email.length === 0) {
    return { error: "Email cannot be empty", field: "email" };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return { error: `Email must be ${MAX_EMAIL_LENGTH} characters or less`, field: "email" };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { error: "Invalid email format", field: "email" };
  }

  // Validate source
  if (!body.source || typeof body.source !== "string") {
    return { error: "Source is required", field: "source" };
  }

  if (!emailSourceEnum.includes(body.source as typeof emailSourceEnum[number])) {
    return { error: "Source must be one of: home, footer, results, donate", field: "source" };
  }

  // Validate consentVersion
  if (!body.consentVersion || typeof body.consentVersion !== "string") {
    return { error: "Consent version is required", field: "consentVersion" };
  }

  if (body.consentVersion.length > MAX_CONSENT_VERSION_LENGTH) {
    return { error: `Consent version must be ${MAX_CONSENT_VERSION_LENGTH} characters or less`, field: "consentVersion" };
  }

  // Validate UTM params if present
  if (body.utm !== undefined) {
    if (typeof body.utm !== "object" || body.utm === null) {
      return { error: "UTM must be an object", field: "utm" };
    }

    const utm = body.utm as Record<string, unknown>;
    const utmFields = ["source", "medium", "campaign", "term", "content"];

    for (const field of utmFields) {
      if (utm[field] !== undefined) {
        if (typeof utm[field] !== "string") {
          return { error: `UTM ${field} must be a string`, field: `utm.${field}` };
        }
        if ((utm[field] as string).length > MAX_UTM_LENGTH) {
          return { error: `UTM ${field} must be ${MAX_UTM_LENGTH} characters or less`, field: `utm.${field}` };
        }
      }
    }
  }

  return null;
}

/**
 * Subscribes an email address.
 *
 * - Normalizes email (trim + lowercase)
 * - If email already exists, returns "exists" (idempotent, preserves first-touch attribution)
 * - If email is new, inserts and returns "created"
 *
 * @param input - Validated subscribe request
 * @returns Subscription result with status
 */
export async function subscribeEmail(input: SubscribeRequest): Promise<SubscriptionResult> {
  const normalizedEmail = normalizeEmail(input.email);

  // Check if email already exists
  const existing = await db
    .select({ id: emailSubscribers.id })
    .from(emailSubscribers)
    .where(eq(emailSubscribers.email, normalizedEmail))
    .limit(1);

  if (existing.length > 0) {
    // Email already exists - return success but don't update (first-touch attribution)
    return { status: "exists" };
  }

  // Insert new subscriber using raw values
  // Type assertion needed due to drizzle-orm/vercel-postgres type inference quirks
  await db.insert(emailSubscribers).values({
    email: normalizedEmail,
    source: input.source,
    consentVersion: input.consentVersion,
    utmSource: input.utm?.source ?? null,
    utmMedium: input.utm?.medium ?? null,
    utmCampaign: input.utm?.campaign ?? null,
    utmTerm: input.utm?.term ?? null,
    utmContent: input.utm?.content ?? null,
  } as typeof emailSubscribers.$inferInsert);

  return { status: "created" };
}

/**
 * Masks an email for logging (privacy protection).
 * Example: "user@example.com" -> "u***@e***.com"
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";

  const domainParts = domain.split(".");
  const tld = domainParts.pop() || "";
  const domainName = domainParts.join(".");

  const maskedLocal = local.length > 1 ? local[0] + "***" : "***";
  const maskedDomain = domainName.length > 1 ? domainName[0] + "***" : "***";

  return `${maskedLocal}@${maskedDomain}.${tld}`;
}