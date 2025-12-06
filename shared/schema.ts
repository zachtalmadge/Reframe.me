import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const toolTypeSchema = z.enum(["narrative", "responseLetter", "both"]);
export type ToolType = z.infer<typeof toolTypeSchema>;

export const offenseSchema = z.object({
  type: z.string().min(1, "Offense type is required"),
  description: z.string().min(1, "Description is required"),
  programs: z.array(z.string()),
});
export type Offense = z.infer<typeof offenseSchema>;

export const formDataSchema = z.object({
  offenses: z.array(offenseSchema).min(1, "At least one offense is required"),
  releaseMonth: z.string().min(1, "Release month is required"),
  releaseYear: z.string().min(1, "Release year is required"),
  programs: z.array(z.string()),
  skills: z.array(z.string()),
  additionalContext: z.string(),
  jobTitle: z.string().optional(),
  employerName: z.string().optional(),
  ownership: z.string().optional(),
  impact: z.string().optional(),
  lessonsLearned: z.string().optional(),
  clarifyingRelevance: z.string().optional(),
  qualifications: z.string().optional(),
});
export type FormData = z.infer<typeof formDataSchema>;

export const generateDocumentsRequestSchema = z.object({
  tool: toolTypeSchema,
  formData: formDataSchema,
});
export type GenerateDocumentsRequest = z.infer<typeof generateDocumentsRequestSchema>;

export const narrativeTypeSchema = z.enum([
  "honest",
  "brief",
  "detailed",
  "skills-focused",
  "growth",
]);
export type NarrativeType = z.infer<typeof narrativeTypeSchema>;

export const narrativeSchema = z.object({
  id: z.string(),
  type: narrativeTypeSchema,
  title: z.string(),
  content: z.string(),
});
export type Narrative = z.infer<typeof narrativeSchema>;

export const responseLetterSchema = z.object({
  content: z.string(),
  formattedDate: z.string(),
});
export type ResponseLetter = z.infer<typeof responseLetterSchema>;

export const generationErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  target: z.enum(["narratives", "responseLetter"]).optional(),
});
export type GenerationError = z.infer<typeof generationErrorSchema>;

export const generationStatusSchema = z.enum(["success", "partial_fail", "total_fail"]);
export type GenerationStatus = z.infer<typeof generationStatusSchema>;

export const generateDocumentsResponseSchema = z.object({
  status: generationStatusSchema,
  narratives: z.array(narrativeSchema).optional(),
  responseLetter: responseLetterSchema.optional(),
  errors: z.array(generationErrorSchema).optional(),
});
export type GenerateDocumentsResponse = z.infer<typeof generateDocumentsResponseSchema>;
