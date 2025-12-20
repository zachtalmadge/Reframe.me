import type { Request, Response, NextFunction } from "express";

/**
 * Logs a message with timestamp and source label.
 *
 * @param message - The message to log
 * @param source - Label for the log source (default: "express")
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * Express middleware that logs API requests with timing and response data.
 *
 * Captures request start time, intercepts res.json() to capture response body,
 * and logs when the response finishes. Only logs routes starting with "/api"
 * to reduce console noise.
 *
 * Logs format: "METHOD /path STATUS in Xms :: {response: 'json'}"
 *
 * Registered in server/index.ts after body parsing middleware.
 *
 * @returns Express middleware function
 */
export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        log(logLine);
      }
    });

    next();
  };
}
