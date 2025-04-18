import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { adventures } from "../schema";

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("adventure_id")
    .references(() => adventures.id)
    .notNull(),
  role: text("role").notNull(), // e.g., 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type SelectMessage = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;