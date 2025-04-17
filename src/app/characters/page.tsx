import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { characters } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CharacterCard } from "@/components/character-card";
import { PlusCircle } from "lucide-react";

export default async function CharactersPage() {
  const { error, user } = await getUser();
  if (error || !user) {
    // Consider redirecting to login or showing a more specific error
    console.error("User fetch error:", error);
    return (
      <div className="text-center text-red-500 mt-10">
        Authentication error. Please try logging in again.
      </div>
    );
  }

  let chars = [];
  try {
    chars = await db
      .select()
      .from(characters)
      .where(eq(characters.userId, user.id));
  } catch (dbError) {
    console.error("Database fetch error:", dbError);
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load characters. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Link href="/characters/new" passHref>
        <Button
          size="lg"
          className="w-full text-lg md:text-xl py-4 md:py-6 mb-6 md:mb-8 flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" /> Create New Character
        </Button>
      </Link>

      {chars.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          You haven&apos;t created any characters yet. Get started above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {chars.map((char) => (
            <CharacterCard key={char.characterId} character={char} />
          ))}
        </div>
      )}
    </div>
  );
}
