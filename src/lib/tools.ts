import { db } from "@/db";
import { eq } from "drizzle-orm";
import { characters, conversations, messages } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { z } from "zod";

export const rollDiceTool = {
  name: "roll_dice",
  description:
    "Roll a number of dice with the given number of sides. After rolling, you MUST inform the user of the result.",
  parameters: z.object({
    amount: z.number().min(1).max(10).describe("The number of dice to roll"),
    sides: z
      .number()
      .min(2)
      .max(100)
      .describe("The number of sides on the die"),
  }),
  execute: async ({ amount, sides }: { amount: number; sides: number }) => {
    const result = amount * Math.floor(Math.random() * sides) + 1;
    return {
      result,
      message: `🎲 Rolled a ${result} on ${amount} d${sides}.`,
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
          conversations,
          eq(characters.characterId, conversations.characterId),
        )
        .where(eq(conversations.id, conversationId))
        .limit(1);

      if (!result || result.length === 0) {
        console.log(result);
        return "No character sheet found for this conversation.";
      }

      return {result: result[0].sheet, message: "Accessed character sheet."};
    },
  };
}
