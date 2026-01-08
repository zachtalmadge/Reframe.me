/**
 * Email subscription API wrapper
 * Handles subscription requests to /api/subscribe with proper error handling
 */

export type EmailSource = "home" | "footer" | "results" | "donate";

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface SubscribeEmailInput {
  email: string;
  source: EmailSource;
  consentVersion?: string;
  utm?: UTMParams;
}

export type SubscribeEmailResult =
  | { ok: true; status: "created" | "exists" }
  | { ok: false; message: string };

// Simple email regex for UX validation (backend is source of truth)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Read UTM parameters from current URL
 */
function getUTMFromURL(): UTMParams | undefined {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};

  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const term = params.get("utm_term");
  const content = params.get("utm_content");

  if (source) utm.source = source;
  if (medium) utm.medium = medium;
  if (campaign) utm.campaign = campaign;
  if (term) utm.term = term;
  if (content) utm.content = content;

  return Object.keys(utm).length > 0 ? utm : undefined;
}

/**
 * Validate email for UX purposes (lightweight, backend is source of truth)
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
  const trimmed = email.trim();

  if (!trimmed) {
    return { valid: false, message: "Email is required" };
  }

  if (trimmed.length > 254) {
    return { valid: false, message: "Email is too long" };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, message: "Please enter a valid email" };
  }

  return { valid: true };
}

/**
 * Subscribe an email address
 * Never throws - always returns a result object
 */
export async function subscribeEmail(
  input: SubscribeEmailInput
): Promise<SubscribeEmailResult> {
  const { email, source, consentVersion = "v1", utm } = input;

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Client-side validation
  const validation = validateEmail(normalizedEmail);
  if (!validation.valid) {
    return { ok: false, message: validation.message! };
  }

  // Get UTM from URL if not provided
  const utmParams = utm ?? getUTMFromURL();

  // Build request body
  const body = {
    email: normalizedEmail,
    source,
    consentVersion,
    ...(utmParams && { utm: utmParams }),
  };

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Success cases
    if (response.status === 201) {
      return { ok: true, status: "created" };
    }

    if (response.status === 200) {
      return { ok: true, status: "exists" };
    }

    // Error cases
    if (response.status === 400) {
      // Try to get server validation message
      try {
        const data = await response.json();
        return { ok: false, message: data.message || "Invalid email address" };
      } catch {
        const text = await response.text().catch(() => "");
        return { ok: false, message: text || "Invalid email address" };
      }
    }

    // Server errors (500+) - generic message
    return { ok: false, message: "Something went wrong. Please try again." };
  } catch (error) {
    clearTimeout(timeoutId);

    // Timeout or abort
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, message: "Request timed out. Please try again." };
    }

    // Network error
    return { ok: false, message: "Network error. Please try again." };
  }
}
