import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const AiModelNames = ["gpt-4o", "gpt-4o-mini"] as const;
export const ai_model_name = pgEnum("ai_model", AiModelNames);

export const users_info = pgTable("users_info", {
  id: uuid("id").primaryKey(),
  username: text("username"),
  ai_api_key: text("ai_api_key"),
  ai_model: ai_model_name("ai_model"),
});

export type AiModelType = (typeof AiModelNames)[number];
export type InsertUsersInfo = typeof users_info.$inferInsert;
export type SelectUsersInfo = typeof users_info.$inferSelect;
