import type { Request, Response, NextFunction } from "express";

/**
 * Express error-handling middleware for centralized error responses.
 *
 * Catches errors that escape route handlers, extracts status code and message,
 * sends a JSON error response, and re-throws the error for logging/debugging.
 *
 * Response format: { message: string }
 * Status code: err.status || err.statusCode || 500
 *
 * Registered in server/index.ts after route registration. Acts as a safety net
 * for uncaught errors, though most document generation errors are handled at
 * the route level with more detailed error responses.
 *
 * @returns Express error-handling middleware function
 */
export function errorHandler() {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  };
}
