import {
  pgEnum,
  pgTable,
  text,
  uuid,
  timestamp,
  serial,
  jsonb,
} from "drizzle-orm/pg-core";

export const AiModelNames = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4.1",
  "gpt-4.1-mini",
] as const;

// TODO put these in the db!
export const AiModelDescriptions: Record<
  (typeof AiModelNames)[number],
  string
> = {
  "gpt-4o":
    "Best for immersive storytelling and complex world-building as your Dungeon Master.",
  "gpt-4o-mini":
    "Great for fast-paced sessions, offering quick and creative responses for your RPG adventures.",
  "gpt-4.1":
    "Balanced choice for detailed narratives and engaging character interactions in Dungeon World.",
  "gpt-4.1-mini":
    "Ideal for lightweight, responsive gameplay and rapid scene progression.",
};
export const ai_model_name = pgEnum("ai_model", AiModelNames);

export const users_info = pgTable("users_info", {
  id: uuid("id").primaryKey(),
  username: text("username"),
  ai_api_key: text("ai_api_key"),
  ai_model: ai_model_name("ai_model"),
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

export type AiModelType = (typeof AiModelNames)[number];
export type InsertUsersInfo = typeof users_info.$inferInsert;
export type SelectUsersInfo = typeof users_info.$inferSelect;
