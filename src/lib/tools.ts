import { db } from "@/db";
import { eq } from "drizzle-orm";
import { characters, adventures, messages } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { z } from "zod";
import type { CharacterSheet } from "@/types/character";

export const rollDiceTool = {
  name: "roll_dice",
  description:
    "Roll a number of dice with the given number of sides. Optionally, add a modifier from [-3, 3] to the roll. It will automatically be added. After rolling, you MUST inform the user of the result.",
  parameters: z.object({
    amount: z.number().min(1).max(10).describe("The number of dice to roll"),
    sides: z
      .number()
      .min(2)
      .max(100)
      .describe("The number of sides on the die"),
    modifier: z.number().describe("Optional modifier to add to the roll, if you're doing a skill check").optional(),
  }),
  execute: async ({
    amount,
    sides,
    modifier,
  }: {
    amount: number;
    sides: number;
    modifier?: number;
  }) => {
    // roll each die into an array of numbers
    const rolls = Array.from(
      { length: amount },
      () => Math.floor(Math.random() * sides) + 1,
    );
    // sum the individual rolls
    const baseRoll = rolls.reduce((sum, roll) => sum + roll, 0);
    const total = baseRoll + (modifier ?? 0);
    return {
      result: total,
      message: `🎲 Rolled ${amount}d${sides}${modifier ? ` + ${modifier}` : ""}: base ${baseRoll}, total ${total}.`,
    };
  },
};

export function createFetchCharacterSheetTool(conversationId: string) {
  return {
    name: "fetch_character_sheet",
    description:
      "Returns the player's character sheet for stat checks, class info, etc.",
    parameters: z.object({}),
    execute: async () => {
      const { error, user } = await getUser();
      if (error || !user) {
        console.log(error);
        return "There was an error returning the character sheet. Please inform the user of this.";
      }

      const result = await db
        .select({ sheet: characters.characterSheet })
        .from(characters)
        .innerJoin(
          adventures,
          eq(characters.characterId, adventures.characterId),
        )
        .where(eq(adventures.id, conversationId))
        .limit(1);

      if (!result || result.length === 0) {
        console.log(result);
        return "No character sheet found for this conversation.";
      }

      return { result: result[0].sheet, message: "Accessed character sheet." };
    },
  };
}

export function createFetchStatModifierTool(conversationId: string) {
  return {
    name: "fetch_stat_modifier",
    description:
      "Fetches the stat modifier for a given stat based on Dungeon World rules.",
    parameters: z.object({
      stat: z
        .enum([
          "Wisdom",
          "Charisma",
          "Strength",
          "Dexterity",
          "Constitution",
          "Intelligence",
        ])
        .describe("The stat to fetch the modifier for"),
    }),
    execute: async ({ stat }: { stat: keyof CharacterSheet["stats"] }) => {
      // fetch character sheet
      const { error, user } = await getUser();
      if (error || !user) {
        console.log(error);
        return "There was an error fetching the stat modifier. Please inform the user.";
      }

      const result = await db
        .select({ sheet: characters.characterSheet })
        .from(characters)
        .innerJoin(
          adventures,
          eq(characters.characterId, adventures.characterId),
        )
        .where(eq(adventures.id, conversationId))
        .limit(1);

      if (!result || result.length === 0) {
        console.log(result);
        return "No character sheet found for this conversation.";
      }

      const sheet = result[0].sheet as CharacterSheet;
      const score = sheet.stats[stat];
      const modifier =
        score <= 3
          ? -3
          : score <= 5
            ? -2
            : score <= 8
              ? -1
              : score <= 12
                ? 0
                : score <= 15
                  ? 1
                  : score <= 17
                    ? 2
                    : 3;

      return {
        result: modifier,
        message: `Modifier for ${stat} (${score}) is ${modifier >= 0 ? "+" : ""}${modifier}.`,
      };
    },
  };
}
