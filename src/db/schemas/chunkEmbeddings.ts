import { bigint, integer, pgTable, text, vector } from "drizzle-orm/pg-core";
import { chunks } from "./chunks";

export const chunkEmbeddings = pgTable("chunk_embeddings", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  chunkId: bigint("chunk_id", { mode: "number" }).references(() => chunks.id),
  embedder: text("embedder"),
  dimensions: integer("dimensions"),
  embedding: vector("embedding", { dimensions: 1536 }),
});
