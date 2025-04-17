import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { characters } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { eq, and } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  const characterId = request.nextUrl.pathname.split("/").pop(); // Extract the [id] from the path
  if (!characterId) {
    return NextResponse.json(
      { error: "Character ID is required" },
      { status: 400 },
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
          eq(characters.userId, user.id),
        ),
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Character not found or access denied" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete character:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
