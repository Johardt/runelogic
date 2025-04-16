import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { characters, conversations } from "@/db/schema";
import { CharacterSheet } from "@/types/character";
import { getUser } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function NewAdventurePage() {
  const { error, user } = await getUser();
  
  if (error || !user) {
    redirect("/login");
  }

  // Fetch user's characters
  const userCharacters = await db
    .select()
    .from(characters)
    .where(eq(characters.userId, user.id));

  // Server action to create a new adventure with selected character
  async function startNewAdventure(formData: FormData) {
    "use server";
    
    const characterId = formData.get("characterId") as string;
    
    if (!characterId) {
      // Handle the case where no character is selected
      throw new Error("Please select a character to start your adventure");
    }
    
    const { user } = await getUser();
    if (!user) redirect("/login");
    
    // Create new conversation/adventure with the selected character
    const [newConvo] = await db
      .insert(conversations)
      .values({
        userId: user.id,
        title: "Untitled Adventure",
        characterId: characterId,
      })
      .returning();
    
    // Redirect to the new adventure page
    redirect(`/adventures/${newConvo.id}`);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Start a New Adventure</h1>
      
      {userCharacters.length === 0 ? (
        <div className="text-center p-8">
          <p className="mb-4">You need to create a character before starting an adventure.</p>
          <Button asChild>
            <a href="/characters/new">Create Your First Character</a>
          </Button>
        </div>
      ) : (
        <form action={startNewAdventure} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select your character:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userCharacters.map((char) => {
                const characterSheet = char.characterSheet as CharacterSheet;
                return (
                  <div key={char.characterId} className="relative">
                    <input
                      type="radio"
                      id={char.characterId}
                      name="characterId"
                      value={char.characterId}
                      className="peer sr-only"
                      required
                    />
                    <label
                      htmlFor={char.characterId}
                      className="block cursor-pointer p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-bold text-lg">{characterSheet.name}</div>
                      <div className="text-sm text-gray-600">
                        {characterSheet.className} • {characterSheet.race} • Level {characterSheet.level}
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Adventure Settings</h2>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Difficulty</p>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="difficulty" value="easy" defaultChecked className="text-primary" />
                  <span>Easy</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="difficulty" value="medium" className="text-primary" />
                  <span>Medium</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="difficulty" value="hard" className="text-primary" />
                  <span>Hard</span>
                </label>
              </div>
            </div>
          </div>
          
          <Button type="submit" size="lg" className="w-full text-xl py-6 cursor-pointer">
            Begin Adventure
          </Button>
        </form>
      )}
    </div>
  );
}
