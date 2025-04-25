import { bigint, pgTable, text } from "drizzle-orm/pg-core";

export const chunks = pgTable("chunks", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  category: text("category"),
  type: text("type"),
  source: text("source"),
});
