import { Router, type Request, type Response } from "express";
import type { SubscribeRequest, SubscribeResponse, ValidationError } from "../types/email.js";
import {
  validateSubscribeRequest,
  subscribeEmail,
  maskEmail
} from "../services/emailSubscription.service.js";

export const emailRouter = Router();

/**
 * POST /api/subscribe
 *
 * Subscribes an email address for updates.
 *
 * Request body: { email, source, consentVersion, utm? }
 * Response:
 *   - 201 Created: New subscription
 *   - 200 OK: Email already subscribed (idempotent)
 *   - 400 Bad Request: Validation error
 *   - 500 Internal Server Error: Database error
 */
emailRouter.post("/subscribe", async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationError = validateSubscribeRequest(req.body);
    if (validationError) {
      return res.status(400).json(validationError as ValidationError);
    }

    const input = req.body as SubscribeRequest;

    // Log with masked email for privacy
    console.log(`📧 Subscribe request from source: ${input.source}, email: ${maskEmail(input.email)}`);

    // Process subscription
    const result = await subscribeEmail(input);

    const response: SubscribeResponse = {
      success: true,
      message: result.status === "created"
        ? "Successfully subscribed"
        : "Already subscribed"
    };

    // 201 for new, 200 for existing (idempotent)
    const statusCode = result.status === "created" ? 201 : 200;

    console.log(`📧 Subscribe result: ${result.status}`);

    return res.status(statusCode).json(response);
  } catch (error) {
    console.error("Error in subscribe endpoint:", error);

    // Don't expose internal error details to client
    return res.status(500).json({
      error: "Failed to process subscription"
    });
  }
});
