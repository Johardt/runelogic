import { db } from "@/db";
import { conversations } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { title } = body;

  if (!title || typeof title !== "string") {
    return new NextResponse(JSON.stringify({ error: "Invalid title" }), {
      status: 400,
    });
  }

  const [conversation] = await db
    .insert(conversations)
    .values({
      userId: data.user.id,
      title,
    })
    .returning();

  return NextResponse.json(conversation, { status: 201 });
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = data.user.id;

  const result = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(conversations.createdAt); // or descending, depending on UX

  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse(JSON.stringify({ error: "Missing id" }), {
      status: 400,
    });
  }

  await db
    .delete(conversations)
    .where(
      and(eq(conversations.id, id), eq(conversations.userId, data.user.id)),
    );

  return new NextResponse(null, { status: 204 });
}
