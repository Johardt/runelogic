import {
  pgEnum,
  pgTable,
  text,
  uuid,
  timestamp,
  serial,
  jsonb,
} from "drizzle-orm/pg-core";

export const models = pgTable("models", {
  modelName: text("model_name").primaryKey(),
  description: text("description"),
});

export const users_info = pgTable("users_info", {
  id: uuid("id").primaryKey(),
  username: text("username"),
  openaiApiKey: text("openai_api_key"),
  aiModel: text("ai_model").references(() => models.modelName),
});

export const user_keys = pgTable("user_keys", {
  id: uuid("id").primaryKey(),
  created_at: timestamp("created_at").defaultNow(),
  key: uuid("key").defaultRandom(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title"),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  characterId: uuid("character_id").references(() => characters.characterId),
  aiModel: text("ai_model").references(() => models.modelName),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .references(() => conversations.id)
    .notNull(),
  role: text("role").notNull(), // e.g., 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const classes = pgTable("classes", {
  id: serial(),
  className: text("class_name").notNull(),
  raceOptions: jsonb("race_options"),
  nameOptions: jsonb("name_options"),
  lookOptions: jsonb("look_options"),
  stats: jsonb("stats"),
  alignmentOptions: jsonb("alignment_options"),
  gearOptions: jsonb("gear_options"),
  bonds: jsonb("bonds"),
  startingMoves: jsonb("starting_moves"),
  advancedMoved: jsonb("advanced_moves"),
  expertMoves: jsonb("expert_moves"),
  description: text("description"),
});

export const characters = pgTable("characters", {
  characterId: uuid("character_id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  characterSheet: jsonb("character_sheet"),
});

export type InsertUsersInfo = typeof users_info.$inferInsert;

export type SelectModelsType = typeof models.$inferSelect;
export type SelectUsersInfo = typeof users_info.$inferSelect;

export type AiModelType = typeof models.$inferSelect["modelName"];

export const AiModelDescriptions: Record<string, string> = {};
