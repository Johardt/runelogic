import { db } from "@/db";
import { adventures } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchAdventuresByUser(userId: string) {
  return db
    .select()
    .from(adventures)
    .where(eq(adventures.userId, userId))
    .orderBy(adventures.createdAt);
}

export async function createAdventure(userId: string, title: string) {
  const [adventure] = await db
    .insert(adventures)
    .values({ userId, title })
    .returning();
  return adventure;
}

export async function deleteAdventure(adventureId: string, userId: string) {
  return db
    .delete(adventures)
    .where(and(eq(adventures.id, adventureId), eq(adventures.userId, userId)));
}
