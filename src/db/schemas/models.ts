import { pgTable, text } from "drizzle-orm/pg-core";

export const models = pgTable("models", {
  modelId: text("model_id").primaryKey(),
  description: text("description"),
  vendorId: text("vendor_id"),
  displayName: text("display_name"),
});

export type SelectModel = typeof models.$inferSelect;
