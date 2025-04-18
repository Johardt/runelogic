import { jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";

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

export type SelectClass = typeof classes.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;
