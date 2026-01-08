import type { Express } from "express";
import type { Server } from "http";
import { documentsRouter } from "./documents.routes.js";
import { emailRouter } from "./email.routes.js";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register document generation routes under /api
  app.use("/api", documentsRouter);

  // Register email subscription routes under /api
  app.use("/api", emailRouter);

  return httpServer;
}
