import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { characters } from "@/db/schema";
import { CharacterSheet } from "@/types/character";
import { getUser } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function CharactersPage() {
  const { error, user } = await getUser();
  if (error || !user) {
    console.log(error);
    return <div>Something went wrong.</div>;
  }

  const chars = await db
    .select()
    .from(characters)
    .where(eq(characters.userId, user.id));

  return (
    <div>
      <Link href="/characters/new">
        <Button size="lg" className="w-full text-xl py-6 cursor-pointer">
          ➕ Create new character
        </Button>
      </Link>

      {chars.map((char) => {
        const characterSheet = char.characterSheet as CharacterSheet;
        return (
          <Card key={char.characterId} className="mb-4 p-4 w-80 mx-auto">
            <div className="font-bold text-lg">{characterSheet.name}</div>
            <div className="text-sm text-gray-600">
              {characterSheet.className} &middot; {characterSheet.race} &middot;
              Level {characterSheet.level}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
