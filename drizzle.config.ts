import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load .env.local for Neon credentials (Vercel env pull destination)
// override: true ensures .env.local takes precedence over .env
dotenv.config({ path: ".env.local", override: true });

/**
 * Drizzle Kit configuration for database migrations.
 *
 * Uses POSTGRES_URL for Vercel Postgres (production/preview)
 * or DATABASE_URL for local development.
 *
 * Commands:
 *   npm run db:push    - Push schema changes to database
 *   npm run db:migrate - Run migrations (if using migration files)
 *   npm run db:studio  - Open Drizzle Studio for database browsing
 */
export default defineConfig({
  schema: "./server/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Neon uses DATABASE_URL
    url: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
