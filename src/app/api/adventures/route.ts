import {
  insertAdventureSchema,
  deleteAdventureSchema,
} from "@/db/validators/adventures";
import {
  createAdventure,
  deleteAdventure,
  fetchAdventuresByUser,
} from "@/db/services/adventures";
import { getUser } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { error, user } = await getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await fetchAdventuresByUser(user.id);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { error, user } = await getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = insertAdventureSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const newAdventure = await createAdventure(user.id, parsed.data.title);
  return NextResponse.json(newAdventure, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { error, user } = await getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  const parsed = deleteAdventureSchema.safeParse({ id });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await deleteAdventure(parsed.data.id, user.id);
  return new NextResponse(null, { status: 204 });
}
