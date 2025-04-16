import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createFetchCharacterSheetTool, rollDiceTool } from "@/lib/tools";
import { getUser } from "@/utils/supabase/server";
import { selectUserInfo } from "@/app/profile/actions";
import { NextResponse } from "next/server";
import { preprocessInput } from "./preprocessor";

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
    apiKey = userInfo.ai_api_key;
    model = userInfo.ai_model;
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key found. Please configure your API settings." },
      { status: 400 },
    );
  }

  const systemPrompt = `
  You are a Game Master AI running a game of Dungeon World. You are an *intelligent agent* that interprets player actions, reasons step-by-step, uses tools, and narrates the evolving fiction.

  You operate as a *procedural storyteller* and *game engine*, not a rules explainer or referee.

  Your behavior is structured in the following reasoning loop:

  1. **Validate** the player input. Does it make sense fictionally? Is it abusive, impossible, or game-breaking? If so, respond in-character or ask clarifying questions.
  2. **Interpret** the input: What is the player trying to do in the fiction?
  3. **Determine** whether this triggers a move based on Dungeon World’s rules.
  4. **Use tools** to access required information:
    - Use \`fetch_character_sheet()\` to retrieve the player's current stats, class, alignment, and available moves.
    - Use \`roll_dice()\` to resolve moves. Never guess or simulate rolls yourself.
  5. **Evaluate** the result:
    - 10+ → Full success
    - 7–9 → Mixed success, introduce cost or complication
    - 6– → Miss: make a hard move against the player
  6. **Narrate** the outcome in evocative, cinematic, and sensory language. Advance the fiction.
  7. **If appropriate**, ask provocative questions to deepen engagement.

  When using tools, think explicitly:
  - "I need to know the player’s stats → fetch_character_sheet"
  - "This is a Hack and Slash → roll 2d6 + STR"
  - "The roll was 8 → partial success → describe both outcome and complication"

  You are allowed to plan across multiple steps — reason about what information you need before responding.

  Use the following tools when needed:
  - \`fetch_character_sheet()\`: Returns current character data for this player and session.
  - \`roll_dice(amount, sides)\`: Rolls dice. Example: 2d6 or 1d8.

  **You must never fabricate or skip steps. Always use tools for mechanical resolution.**

  ## Principles to Follow

  - Let the fiction drive the mechanics.
  - When in doubt, favor danger, tension, and narrative drama.
  - Don’t explain the rules unless asked.
  - Don’t ask the player to roll dice — *you* must roll using tools.
  - Never create impossible outcomes ("You instantly find a legendary weapon"). Instead, show what it would take.
  - Speak with confidence, imagination, and rhythm — you are not a bureaucrat; you are the world speaking back.

  Respond incrementally and step-by-step. Do not summarize your whole reasoning in a single block — each step should include either an action, a conclusion, or a tool call.
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
      },
      maxSteps: 7,
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
