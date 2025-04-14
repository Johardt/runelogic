import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { user_keys } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // First, try to find an existing key
    const existingKeys = await db
      .select()
      .from(user_keys)
      .where(eq(user_keys.id, data.user.id));

    if (existingKeys.length > 0) {
      // Return the existing key
      return NextResponse.json({ key: existingKeys[0].key });
    }

    // If no key exists, create a new one
    const [newKey] = await db.insert(user_keys)
      .values({
        id: data.user.id,
      })
      .returning();

    return NextResponse.json({ key: newKey.key });
  } catch (error) {
    console.error("Failed to generate/retrieve key:", error);
    return NextResponse.json(
      { error: "Failed to handle encryption key" },
      { status: 500 }
    );
  }
} 