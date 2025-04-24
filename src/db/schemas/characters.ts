import { jsonb, pgTable, uuid } from "drizzle-orm/pg-core";
import { CharacterSheet } from "../validators/characters";

export const characters = pgTable("characters", {
  characterId: uuid("character_id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  characterSheet: jsonb("character_sheet").$type<CharacterSheet>(),
});

export type SelectCharacter = typeof characters.$inferSelect;
export type InsertCharacter = typeof characters.$inferInsert;
