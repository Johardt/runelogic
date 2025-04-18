import { z } from "zod";

export const characterSheetSchema = z.object({
  look: z.record(z.string()),
  name: z.string(),
  race: z.string(),
  level: z.number().int().nonnegative(),
  maxHp: z.number().int().positive(),
  stats: z.object({
    Wisdom: z.number(),
    Charisma: z.number(),
    Strength: z.number(),
    Dexterity: z.number(),
    Constitution: z.number(),
    Intelligence: z.number(),
  }),
  alignment: z.string(),
  className: z.string(),
  damage_die: z.string(),
});

export const insertCharacterSchema = z.object({
  userId: z.string().uuid(),
  characterSheet: characterSheetSchema,
});

export const deleteCharacterSchema = z.object({
  characterId: z.string().uuid(),
});

export type CharacterSheet = z.infer<typeof characterSheetSchema>;
