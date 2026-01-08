import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../db/schema/emailSubscribers.js";

/**
 * Database client for Neon Postgres (serverless).
 *
 * Uses lazy initialization to ensure environment variables are loaded first.
 * Uses WebSocket-based Pool for better compatibility with Drizzle ORM.
 *
 * Expects DATABASE_URL environment variable with Neon connection string.
 */

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({ connectionString });
  _db = drizzle(pool, { schema });
  return _db;
}

// For backwards compatibility, export db as a getter
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});
