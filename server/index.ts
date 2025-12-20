// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ override: true });
  console.log('✓ Loaded .env file (development mode)');
} else {
  dotenv.config();
  console.log('✓ Using environment variables (production mode)');
}

// Validate required environment variables
const requiredEnvVars = [
  'AI_INTEGRATIONS_OPENAI_API_KEY',
  'AI_INTEGRATIONS_OPENAI_BASE_URL',
  'SESSION_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('💡 Please check your .env file and ensure all required variables are set.');
  console.error('📋 See .env.example for a template.');
  process.exit(1);
}

// Now import other modules (after env vars are loaded)
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes/index.js";
import { serveStatic } from "./static.js";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
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
});

// Initialize the app
let appInitialized = false;

async function initializeApp() {
  if (appInitialized) return;
  appInitialized = true;

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite.js");
    await setupVite(httpServer, app);
  }
}

// Export for Vercel serverless
export default async function handler(req: Request, res: Response) {
  await initializeApp();
  return app(req, res);
}

// Local development - start the server
if (!process.env.VERCEL) {
  (async () => {
    await initializeApp();

    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
      },
      () => {
        log(`serving on port ${port}`);
      },
    );
  })();
}
