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
    const displayMessage = `You rolled a ${result} on ${amount} d${sides}.`;
    return { result, message: displayMessage };
  },
};
