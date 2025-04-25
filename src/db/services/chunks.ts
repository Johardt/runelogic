import { eq } from "drizzle-orm";
import { db } from "..";
import { chunks } from "../schemas/chunks";

export async function getChunkByTitle(title: string) {
  const [chunkies] = await db
    .select()
    .from(chunks)
    .where(eq(chunks.title, title));
    return chunkies;
}
