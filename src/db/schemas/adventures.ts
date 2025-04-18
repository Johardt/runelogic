import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { characters, models } from "../schema";

export const adventures = pgTable("adventures", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title"),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  characterId: uuid("character_id").references(() => characters.characterId),
  aiModel: text("ai_model").references(() => models.modelId),
});

export type SelectAdventure = typeof adventures.$inferSelect;
export type InsertAdventure = typeof adventures.$inferInsert;