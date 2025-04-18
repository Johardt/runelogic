import { getUser } from "@/utils/supabase/server";
import { getOrCreateUserKey } from "@/db/services/userKeys";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  const { error, user } = await getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const key = await getOrCreateUserKey(user.id);
    return NextResponse.json({ key });
  } catch (err) {
    console.error("Failed to handle encryption key:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
