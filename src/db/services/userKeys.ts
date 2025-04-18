import { db } from "@/db";
import { userKeys } from "@/db/schemas/userKeys";
import { eq } from "drizzle-orm";

export async function getOrCreateUserKey(userId: string) {
  const existing = await db
    .select()
    .from(userKeys)
    .where(eq(userKeys.id, userId));

  if (existing.length > 0) return existing[0].key;

  const [inserted] = await db
    .insert(userKeys)
    .values({ id: userId })
    .returning();

  return inserted.key;
}
