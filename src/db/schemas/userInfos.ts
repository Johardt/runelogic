import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { models } from "../schema";

export const userInfos = pgTable("users_info", {
  id: uuid("id").primaryKey(),
  username: text("username"),
  openaiApiKey: text("openai_api_key"),
  googleApiKey: text("google_api_key"),
  aiModel: text("ai_model").references(() => models.modelId),
});

export type SelectUserInfo = typeof userInfos.$inferSelect;
export type InsertUserInfo = typeof userInfos.$inferInsert;
