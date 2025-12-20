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
import { serveStatic } from "./static/index.js";
import { createServer } from "http";
import { requestLogger, log } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";

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

app.use(requestLogger());

// Initialize the app
let appInitialized = false;

async function initializeApp() {
  if (appInitialized) return;
  appInitialized = true;

  await registerRoutes(httpServer, app);

  app.use(errorHandler());

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
