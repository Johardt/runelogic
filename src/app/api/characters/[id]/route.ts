import { db } from "@/db";
import { characters } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const characterId = params.id;
  if (!characterId) {
    return NextResponse.json(
      { error: "Character ID is required" },
      { status: 400 }
    );
  }

  const { user, error: userError } = await getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await db
      .delete(characters)
      .where(
        and(
          eq(characters.characterId, characterId),
          eq(characters.userId, user.id) // Ensure user owns the character
        )
      )
      .returning(); // Return the deleted record to check if deletion happened

    if (deleted.length === 0) {
      // Either character not found or user doesn't own it
      return NextResponse.json(
        { error: "Character not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete character:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
