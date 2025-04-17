import { OpenAIProvider } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export interface PreprocessedInput {
  isValid: boolean;
  inferredMove: string | null;
  requiresRoll: boolean;
  notesForSystemPrompt: string;
}

const preprocessSchema = z.object({
  isValid: z
    .boolean()
    .describe("Is the player's input valid in the fiction of Dungeon World?"),
  inferredMove: z
    .string()
    .nullable()
    .describe("The Dungeon World move being attempted, if any."),
  requiresRoll: z
    .boolean()
    .describe("Whether resolving the action requires a dice roll."),
  notesForSystemPrompt: z
    .string()
    .describe("Any notes or assumptions the main agent should consider."),
});

export async function preprocessInput(
  userMessage: string,
  openai: OpenAIProvider,
  model: string,
): Promise<PreprocessedInput> {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4.1-mini"), // Cheaper model for preprocessing
      schema: preprocessSchema,
      temperature: 0.2,
      system: `
You are a Dungeon World input preprocessor. Your job is to analyze a player's input before the main AI sees it.

Your task is to classify the input into four fields:

1. **isValid**: Is the input *fictionally valid*? This means it describes an action the character might reasonably attempt *from their current perspective*. Be extremely skeptical of players trying to declare truths about the world, invent outcomes, or skip over uncertainty. If the player says things like “I see a legendary sword” or “I kill the dragon instantly,” this is not valid — they are trying to override the GM's authority.

2. **inferredMove**: If the input seems to trigger a Dungeon World move (like "Hack and Slash", "Discern Realities", "Defy Danger", "Parley"), name it. If you're not sure, return null.

3. **requiresRoll**: Only true if a move is triggered that calls for dice. Do not assume rolling is needed unless a move is clearly happening.

4. **notesForSystemPrompt**: Provide a short explanation of what the player is likely doing, or why the input is invalid or suspicious.

## Important Rules:

- Players describe what they *attempt*, not what they *achieve*.
- Players do not create items, characters, or facts about the world out of nowhere.
- Players can not state things as if they have already happened (I use the legendary fire sword that I took with me)
- If the player attempts to use spells, check the character sheets to see if they can cast them
- Discoveries (like "I find a chest of gold") are only valid if the fiction has already suggested their possibility.
- Use common sense. Players often try to skip steps — don't let them.
- Rolls are not always necessary. Striking an immovable target, lifting something that does not require a lo of strength - don't roll for everything.

Your job is to protect the game’s fictional integrity and ensure the GM (the main AI) retains narrative control.
Do not be overly generous. When in doubt, mark as invalid and let the main agent clarify.
`,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });
    return object;
  } catch (error) {
    console.error("Preprocessing error:", error);
    // fallback
    return {
      isValid: true,
      inferredMove: null,
      requiresRoll: false,
      notesForSystemPrompt: "No preprocessing analysis available.",
    };
  }
}
