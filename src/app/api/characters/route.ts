import { NextResponse } from "next/server";
import { db } from "@/db"; // adjust this to your actual db import
import { characters } from "@/db/schema"; // the drizzle schema you provided

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, character_sheet } = body;

    if (!userId || !character_sheet) {
      return NextResponse.json(
        { error: "Missing userId or character_sheet" },
        { status: 400 },
      );
    }

    const [inserted] = await db
      .insert(characters)
      .values({
        userId,
        characterSheet: character_sheet,
      })
      .returning();

    return NextResponse.json(
      { success: true, characterId: inserted.characterId },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating character:", err);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 },
    );
  }
}
