import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { rollDiceTool } from "@/lib/tools";
import { createClient } from "@/utils/supabase/server";
import { selectUserInfo } from "@/app/profile/actions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/utils/server-encryption";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const supabase = createClient();

  const { data, error } = await (await supabase).auth.getUser();
  if (error || !data?.user) {
    console.log(error);
    console.log("Something went wrong!");
    return NextResponse.error;
  }

  // Check for client-stored API key first
  const cookieStore = await cookies();
  const encryptedApiKey = cookieStore.get("ai_api_key")?.value;
  const encryptedModel = cookieStore.get("ai_model")?.value;

  let apiKey: string | null = null;
  let model: string | null = null;

  if (encryptedApiKey) {
    // Use client-stored settings
    apiKey = decrypt(encryptedApiKey);
    model = encryptedModel ? decrypt(encryptedModel) : "gpt-4o-mini";
  } else {
    // Fall back to server-stored settings
    let userInfo = await selectUserInfo(data.user.id).then((infos) => {
      return infos[0];
    });
    apiKey = userInfo.ai_api_key;
    model = userInfo.ai_model;
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key found. Please configure your API settings." },
      { status: 400 }
    );
  }

  const defaultSystemPrompt = `
    You are a Dungeon Master (GM) running a game of Dungeon World.

    Your job is to describe a vivid, immersive world, react to the players' actions, and uphold the rules and narrative principles of Dungeon World.

    You do not explain the rules to players unless they ask. Instead, use the rules to guide how events unfold. Use additional context (from the rules and setting) when available to determine outcomes.

    Always respond with:
    1. Fictional description of the world reacting to the player's action
    2. The outcome of their move or attempted action
    3. Any consequences, dangers, or follow-up questions

    Important principles:
    - Only trigger a move when the fiction demands it
    - When a player triggers a move, determine which move applies
    - Roll 2d6 + appropriate stat (use tool call)
    - Interpret rolls as follows:
      - 10+ → Full success
      - 7–9 → Mixed success, choose a drawback
      - 6- → Miss: make a hard move against the player

    When a move or rule is unclear, use what makes sense narratively. Lean into danger, drama, and tension. Ask provocative questions. Show the world's reaction. Never say "you can't do that" — instead, show what it would cost.

    Speak evocatively. Describe the world in vivid, sensory terms. Keep the pacing tight. You are not an impartial referee — you are the world's voice.

    You have access to tools:
    - rollDice(amount, sides): Rolls dice, e.g., "2 d6". IMPORTANT: YOU MUST roll dice yourself, the user CAN NOT do it on their own!!

    Use these tools to resolve actions when appropriate. Do not guess roll results or stats.
  `;

  const openai = createOpenAI({
    apiKey: apiKey,
  });

  const result = streamText({
    model: openai(model || "gpt-4o-mini"),
    system: defaultSystemPrompt,
    messages,
    tools: {
      roll_dice: rollDiceTool,
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
