import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import {
  createFetchCharacterSheetTool,
  createFetchStatModifierTool,
  rollDiceTool,
} from "@/lib/tools";
import { getUser } from "@/utils/supabase/server";
import { selectUserInfo } from "@/app/profile/actions";
import { NextResponse } from "next/server";
import { preprocessInput } from "@/lib/preprocessor";

export async function POST(req: Request) {
  const { messages, clientSettings, conversationId } = await req.json();

  const latestUserMessage = messages
    .slice()
    .reverse()
    .find((m: { role: string }) => m.role === "user")?.content;

  if (!latestUserMessage) {
    return NextResponse.json(
      { error: "No user message found." },
      { status: 400 },
    );
  }

  const { error, user } = await getUser();
  if (error || !user) {
    console.log(error);
    console.log("Something went wrong!");
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  let apiKey: string | null = null;
  let model: string | null = null;

  const fetchCharacterSheetTool = createFetchCharacterSheetTool(conversationId);
  const fetchStatModifierTool = createFetchStatModifierTool(conversationId);

  // Check if client settings were passed in the request
  if (clientSettings?.storageType === "client" && clientSettings.apiKey) {
    // Use client-stored settings from the request
    console.log("Using client-stored settings");
    apiKey = clientSettings.apiKey;
    model = clientSettings.model || "gpt-4o-mini";
  } else {
    // Fall back to server-stored settings
    console.log("Using server-stored settings");
    let userInfo = await selectUserInfo(user.id).then((infos) => {
      return infos[0];
    });
    apiKey = userInfo.openaiApiKey;
    model = userInfo.aiModel;
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key found. Please configure your API settings." },
      { status: 400 },
    );
  }

  const systemPrompt = `
You are a Game Master AI running a game of Dungeon World.  Before you see the raw player text, you receive a JSON object called 'preprocessed' with these fields:

- 'isValid' (boolean): whether the input makes sense fictionally  
- 'inferredMove' (string|null): the Dungeon World move the player is attempting, if any  
- 'requiresRoll' (boolean): whether that move needs dice  
- 'notesForSystemPrompt' (string): any assumptions or flags to carry into your narration  

Your turn‐by‐turn loop now looks like:

0. **Ingest preprocessing**  
   - If 'isValid' is false, respond in‐character or ask for clarification, referencing 'notesForSystemPrompt'.  
   - Otherwise proceed and keep 'notesForSystemPrompt' in mind as context.  

1. **Interpret**  
   - Use 'inferredMove' if present to shortcut straight to step 2.  
   - If 'inferredMove' is null, reason what move (if any) the player is trying.  

2. **Decide on a move**  
   - If 'inferredMove' is non‑null and 'requiresRoll' is true → call 'roll_dice()' and 'fetch_stat_modifier()' if relevant.  
   - If 'inferredMove' is non‑null and 'requiresRoll' is false → narrate a no‑roll “soft” move.  
   - If 'inferredMove' is null → describe what the player attempted and ask any necessary questions.  

3. **Fetch tools** as needed:  
   - “I need stats → fetch_character_sheet()”  
   - “Requires a skill check → fetch_stat_modifier for the relevant skill, then roll_dice with the returned modifier”
   - “This is Hack and Slash → roll_dice(2d6 + STR)”  

4. **Weave the result — concretely**  
       - **Full success (10+):** describe exactly what unfolds in vivid, cinematic detail.  
       - **Mixed success (7–9):** choose and narrate one clear complication—no hedging language.  
         - *Bad:* “You defy danger, but you might feel a strange side effect.”  
         - *Good:* “You vault clear of the poison gas, but as you land your foot twists sharply—your ankle thunders in pain, forcing you to limp.”  
       - **Miss (≤6):** unleash a specific hard move against the player—spell out exactly what the world does to them.

5. **Narrate** in cinematic detail, weaving in any 'notesForSystemPrompt'.  

**Principles:**  
- Never ignore 'isValid' or 'notesForSystemPrompt'.  
- Always use tools for rolls and data. **Never** guess modifiers or dice rolls
- Keep the fiction driving the mechanics.  
- Don’t lecture on rules—play the world.  
- Step‐by‐step reasoning: each block is either an action, tool call, or narrative.  
- **Never** Invent available spells, gear, inventory, skills. If something is not in the inventory or the character sheet, its not available.
- YOU are the Game Master and always have the final say. Use this to make the story interesting. Surprise the player from time to time with a twist.
`;

  const openai = createOpenAI({
    apiKey: apiKey,
  });

  console.log("[Preprocessor] Running on input:", latestUserMessage);

  // Run the preprocessor
  const preprocessed = await preprocessInput(
    latestUserMessage,
    openai,
    model || "gpt-4.1-mini",
  );

  console.log("[Preprocessor Result]", JSON.stringify(preprocessed, null, 2));

  const planningNoteMessage = {
    role: "assistant" as const,
    content: `NOTE: Pre-analysis result —
- isValid: ${preprocessed.isValid}
- inferredMove: ${preprocessed.inferredMove ?? "None"}
- requiresRoll: ${preprocessed.requiresRoll}
- notes: ${preprocessed.notesForSystemPrompt}`,
  };

  try {
    const result = streamText({
      model: openai(model || "gpt-4.1-mini"),
      system: systemPrompt,
      messages: [planningNoteMessage, ...messages],
      tools: {
        roll_dice: rollDiceTool,
        fetch_character_sheet: fetchCharacterSheetTool,
        fetch_stat_modifier: fetchStatModifierTool,
      },
      maxSteps: 7,
      onStepFinish: async (result) => {
        console.log("[📦 Step finished]");
        console.log("Step type:", result.stepType);
        console.log("Finish reason:", result.finishReason);
        console.log("Text generated:", result.text);

        if (result.stepType === "tool-result") {
          console.log("Tool calls:", result.toolCalls);
          console.log("Tool results:", result.toolResults);
        }
      },
      onFinish: ({ response }) => {
        const messages = response.messages;
        // TODO: Somehow get these to the chat
      },
    });

    // Use the correct method and handle streaming response
    return new Response(result.toDataStream());
  } catch (error) {
    console.error("Error in chat API:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500 },
    );
  }
}
