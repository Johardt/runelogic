import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { getRelevantChunksForEmbedding } from "@/db/services/chunkEmbeddings";

export async function getRelevantChunksForUserInput(
  userMessage: string,
  topK = 5,
) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: userMessage,
  });

  if (!embedding) {
    console.warn("No embedding returned from model.");
    return [];
  }

  return getRelevantChunksForEmbedding(
    embedding,
    topK,
    "openai:text-embedding-3-small",
  );
}
