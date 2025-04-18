import { db } from "@/db";
import { characters } from "@/db/schemas/characters";
import { eq, and } from "drizzle-orm";
import type { CharacterSheet } from "@/db/validators/characters";

export async function createCharacter(
  userId: string,
  characterSheet: CharacterSheet,
) {
  const [inserted] = await db
    .insert(characters)
    .values({ userId, characterSheet })
    .returning();

  return inserted.characterId;
}

export async function deleteCharacter(characterId: string, userId: string) {
  const [deleted] = await db
    .delete(characters)
    .where(
      and(
        eq(characters.characterId, characterId),
        eq(characters.userId, userId),
      ),
    )
    .returning();

  return deleted;
}
