import { streamText } from "ai";
import {
  createFetchCharacterSheetTool,
  createFetchStatModifierTool,
  rollDiceTool,
} from "@/lib/tools";
import { getUser } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { preprocessInput } from "@/lib/preprocessor";
import { db } from "@/db";
import { models } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserInfo } from "@/db/services/userInfos";
import { getLanguageModel } from "@/lib/models/router";
import { dungeonWorldSystemPrompt } from "@/lib/prompts/game-master";

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

  if (clientSettings?.storageType === "client" && clientSettings.apiKey) {
    console.log("Using client-stored settings");
    model = clientSettings.model || "gpt-4o-mini";
  } else {
    console.log("Using server-stored settings");
    const userInfo = await getUserInfo(user.id).then((infos) => infos[0]);
    model = userInfo.aiModel;
  }

  const [modelInfo] = await db
    .select()
    .from(models)
    .where(eq(models.modelId, model!))
    .limit(1);

  if (!modelInfo) {
    return NextResponse.json({ error: "Model not found" }, { status: 400 });
  }

  if (clientSettings?.storageType === "client" && clientSettings.apiKey) {
    apiKey = clientSettings.apiKey;
  } else {
    const userInfo = await getUserInfo(user.id).then((infos) => infos[0]);
    apiKey =
      modelInfo.vendorId === "google"
        ? userInfo.googleApiKey
        : userInfo.openaiApiKey;
  }

  const vendorId = modelInfo.vendorId;

  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key found. Please configure your API settings." },
      { status: 400 },
    );
  }

  const modelRunner = getLanguageModel({
    modelId: model!,
    vendorId: vendorId!,
    apiKey,
  });

  console.log("[Preprocessor] Running on input:", latestUserMessage);

  // Run the preprocessor
  const preprocessed = await preprocessInput(latestUserMessage, modelRunner);

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
      model: modelRunner,
      system: dungeonWorldSystemPrompt,
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
