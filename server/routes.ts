import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateDocumentsRequestSchema } from "@shared/schema";
import { generateDocuments } from "./services/documentGenerator";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/generate-documents", async (req, res) => {
    const result = generateDocumentsRequestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        status: "total_fail",
        errors: [{ code: "VALIDATION_ERROR", message: "Invalid request data" }],
        details: result.error.flatten() 
      });
    }
    
    try {
      const documents = await generateDocuments(result.data);
      return res.json(documents);
    } catch (error) {
      console.error("Document generation error:", error);
      return res.status(500).json({ 
        status: "total_fail",
        errors: [{ code: "GENERATION_ERROR", message: "Failed to generate documents" }]
      });
    }
  });

  return httpServer;
}
