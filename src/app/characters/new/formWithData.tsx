import {
  CharacterCreationForm,
  CharacterClass,
} from "@/components/character-creation-form";
import { db } from "@/db";
import { classes } from "@/db/schema";

export default async function CharacterFormWithData() {
  let allClasses: CharacterClass[] = [];
  try {
    const result = await db.select().from(classes);
    allClasses = result.map((row) => ({
      id: row.id,
      className: row.className,
      description: row.description as string,
      raceOptions: row.raceOptions as string[],
      nameOptions: row.nameOptions as Record<string, string[]>,
      lookOptions: row.lookOptions as Record<string, string[]>,
      stats: row.stats as Record<string, string>,
      alignmentOptions: row.alignmentOptions as {
        alignment: string;
        trigger: string;
      }[],
    }));
  } catch (error) {
    console.error("Error loading classes:", error);
    return <div>Error loading classes.</div>;
  }
  return <CharacterCreationForm classes={allClasses} />;
}
