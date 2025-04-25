// src/db/services/chunkEmbeddings.ts
import { chunkEmbeddings, chunks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cosineSimilarity } from "ai";
import { db } from "..";

export async function getRelevantChunksForEmbedding(
  embedding: number[],
  topK: number = 5,
  embedderName: string,
): Promise<{ title: string; body: string }[]> {
  const results = await db
    .select({
      chunkId: chunkEmbeddings.chunkId,
      title: chunks.title,
      body: chunks.body,
      embedding: chunkEmbeddings.embedding,
    })
    .from(chunkEmbeddings)
    .innerJoin(chunks, eq(chunkEmbeddings.chunkId, chunks.id))
    .where(eq(chunkEmbeddings.embedder, embedderName));

  const ranked = results
    .filter((r) => r.embedding !== null)
    .map((r) => ({
      title: r.title,
      body: r.body,
      similarity: cosineSimilarity(embedding, r.embedding!),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return ranked.map(({ title, body }) => ({ title, body }));
}
