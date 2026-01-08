/**
 * Valid sources for email capture.
 */
export type EmailSource = "home" | "footer" | "results" | "donate";

/**
 * UTM tracking parameters (all optional).
 */
export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

/**
 * Request body for POST /api/subscribe endpoint.
 */
export interface SubscribeRequest {
  email: string;
  source: EmailSource;
  consentVersion: string;
  utm?: UtmParams;
}

/**
 * Response from the subscribe endpoint.
 */
export interface SubscribeResponse {
  success: boolean;
  message: string;
}

/**
 * Result from the subscription service.
 */
export interface SubscriptionResult {
  status: "created" | "exists";
}

/**
 * Validation error response.
 */
export interface ValidationError {
  error: string;
  field?: string;
}
