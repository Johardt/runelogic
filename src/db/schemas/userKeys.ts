import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const userKeys = pgTable("user_keys", {
  id: uuid("id").primaryKey(),
  created_at: timestamp("created_at").defaultNow(),
  key: uuid("key").defaultRandom(),
});

export type SelectUserKey = typeof userKeys.$inferSelect;
