import { insertCharacterSchema } from "@/db/validators/characters";
import { createCharacter } from "@/db/services/characters";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  const parsed = insertCharacterSchema.safeParse(body);
  console.log("Parsed: " + parsed);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const characterId = await createCharacter(
      parsed.data.userId,
      parsed.data.characterSheet,
    );

    return NextResponse.json({ success: true, characterId }, { status: 201 });
  } catch (err) {
    console.error("Error creating character:", err);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 },
    );
  }
}
