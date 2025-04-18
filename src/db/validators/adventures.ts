import { adventures } from "../schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectAdventureSchema = createSelectSchema(adventures);

export const insertAdventureSchema = createInsertSchema(adventures, {
  title: z.string().min(1),
});

export const deleteAdventureSchema = z.object({
  id: z.string().uuid(),
});
