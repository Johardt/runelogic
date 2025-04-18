import { getUser } from "@/utils/supabase/server";
import { deleteCharacter } from "@/db/services/characters";
import { deleteCharacterSchema } from "@/db/validators/characters";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const characterId = req.nextUrl.pathname.split("/").pop();

  const parsed = deleteCharacterSchema.safeParse({ characterId });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { user, error: authError } = await getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await deleteCharacter(parsed.data.characterId, user.id);

    if (!result) {
      return NextResponse.json(
        { error: "Not found or forbidden" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete character:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
