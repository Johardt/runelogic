import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const ai_model = pgEnum("ai_model", ["gpt-4o", "gpt-4o-mini"]);

export const users_info = pgTable("users_info", {
  id: uuid("id").primaryKey(),
  username: text("username"),
  openai_api_key: text("openai_api_key"),
  openai_api_model: ai_model("openai_api_model"),
});

export type InsertUsersInfo = typeof users_info.$inferInsert;
export type SelectUsersInfo = typeof users_info.$inferSelect;
