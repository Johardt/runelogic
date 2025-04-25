import { createClient } from "@supabase/supabase-js";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import * as classMoves from "./chunks/classMoves";
import * as examples from "./chunks/examples";
import * as moves from "./chunks/moves";
import * as gamePlay from "./chunks/gamePlay";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });

console.log("🔍 Using Supabase URL:", process.env.SUPABASE_URL);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

const EMBEDDER = "openai:text-embedding-3-small";
const EMBED_DIMENSIONS = 1536;

type Chunk = {
  title: string;
  body: string;
  category: string;
  type: string;
  source: string;
};

const chunks: Chunk[] = [
  ...Object.values(classMoves),
  ...Object.values(examples),
  ...Object.values(moves),
  ...Object.values(gamePlay),
];

(async () => {
  const valuesToEmbed = chunks.map(
    (chunk) => `${chunk.title}\n\n${chunk.body}`,
  );

  const { embeddings } = await embedMany({
    model: openai.embedding(EMBEDDER.split(":")[1]),
    values: valuesToEmbed,
  });

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = embeddings[i];

    const { data: insertedChunk, error: chunkErr } = await supabase
      .from("chunks")
      .insert([
        {
          title: chunk.title,
          body: chunk.body,
          category: chunk.category,
          type: chunk.type,
          source: chunk.source,
        },
      ])
      .select("id")
      .single();

    if (chunkErr) throw chunkErr;

    const chunk_id = insertedChunk.id;

    const { error: embedErr } = await supabase.from("chunk_embeddings").insert([
      {
        chunk_id,
        embedder: EMBEDDER,
        dimensions: EMBED_DIMENSIONS,
        embedding,
      },
    ]);

    if (embedErr) throw embedErr;

    console.log(`✅ Inserted: ${chunk.title}`);
  }

  console.log("🎉 All chunks embedded and inserted!");
})().catch((err) => {
  console.error("❌ Error embedding chunks:", err);
  process.exit(1);
});
