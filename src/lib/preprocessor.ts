import { generateObject, LanguageModel } from "ai";
import { z } from "zod";
import { getRelevantChunksForUserInput } from "./fetchRelevantChunks";

export interface PreprocessedInput {
  isValid: boolean;
  inferredMove: string | null;
  requiresRoll: boolean;
  notesForSystemPrompt: string;
  relevantChunks: {
    title: string;
    body: string;
  }[];
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
  model: LanguageModel,
): Promise<PreprocessedInput> {
  try {
    const { object } = await generateObject({
      model: model,
      schema: preprocessSchema,
      temperature: 0.2,
      system: `
You are a Dungeon World input preprocessor. Your job is to analyze player input before it reaches the Game Master AI. Dungeon World is a game of emergent narrative, not player-authored fiction. Your job is to **protect narrative integrity and enforce the GM's authority.**

Your output must return the following fields:

1. **isValid**: Whether the input is fictionally valid. This means the player is describing something their character *could reasonably attempt*, given the current fiction and what’s on their sheet. Reject all statements that:
   - Invent new abilities, items, or powers
   - Skip conflict or discovery
   - Declare things as already true ("I have X", "I already know Y")
   - Assert backstory or world changes that haven’t been established collaboratively

2. **inferredMove**: The name of the Dungeon World move being triggered, if any. Only include moves that are clearly justified by the input. If unsure, return null.

3. **requiresRoll**: Whether the inferred move requires a dice roll. Only true for player moves with mechanical resolution. If no move is triggered, this is false.

4. **notesForSystemPrompt**: A short note for the GM. Include useful context, or describe why the input is invalid. If rejecting the input, be blunt and specific.

## Iron Rules:
- **Players may attempt, but not declare outcomes.**
- **Players cannot create truths.** All discoveries, powers, and setting facts must come from the GM or prior fiction.
- **No new powers without mechanical backing.** If a player claims to shapeshift into a superhuman form, they better be a Druid with a legal animal form or have a custom move on their sheet.
- **Fiction is not improv.** It’s emergent. Players don’t retcon powers or rewrite the world mid-scene.
- **If in doubt, say it's invalid.** Let the GM handle appeals.

## Tone:
Be strict. When a player overreaches, call it. Do not soften rejections. Flag narrative overreach early and clearly.

You are the firewall protecting Dungeon World’s structure and fairness.

`,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const relevantChunks = await getRelevantChunksForUserInput(userMessage, 5);

    return {
      ...object,
      relevantChunks,
    };
  } catch (error) {
    console.error("Preprocessing error:", error);
    // fallback
    return {
      isValid: true,
      inferredMove: null,
      requiresRoll: false,
      notesForSystemPrompt: "No preprocessing analysis available.",
      relevantChunks: [],
    };
  }
}
