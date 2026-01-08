import { pgTable, uuid, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Valid sources for email capture.
 */
export const emailSourceEnum = ["home", "footer", "results", "donate"] as const;
export type EmailSourceType = typeof emailSourceEnum[number];

/**
 * Email subscribers table schema.
 *
 * Stores email subscriptions with first-touch attribution.
 * Privacy-focused: only captures necessary fields for email marketing.
 */
export const emailSubscribers = pgTable(
  "email_subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 254 }).notNull(),
    source: varchar("source", { length: 20 }).notNull(),
    consentVersion: varchar("consent_version", { length: 20 }).notNull(),
    utmSource: varchar("utm_source", { length: 200 }),
    utmMedium: varchar("utm_medium", { length: 200 }),
    utmCampaign: varchar("utm_campaign", { length: 200 }),
    utmTerm: varchar("utm_term", { length: 200 }),
    utmContent: varchar("utm_content", { length: 200 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("email_subscribers_email_idx").on(table.email),
  ]
);

/**
 * Type for inserting a new email subscriber.
 */
export type InsertEmailSubscriber = typeof emailSubscribers.$inferInsert;

/**
 * Type for selecting an email subscriber.
 */
export type SelectEmailSubscriber = typeof emailSubscribers.$inferSelect;
