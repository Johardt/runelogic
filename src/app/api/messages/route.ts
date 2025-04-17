// app/api/messages/route.ts (or similar)
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { error, user } = await getUser();

  if (error || !user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { conversationId, role, content } = body;

  if (!conversationId || !role || !content) {
    return new NextResponse(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  // Verify ownership
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, user.id),
      ),
    )
    .limit(1);

  if (!conversation) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  // Insert message
  await db.insert(messages).values({
    conversationId,
    role,
    content,
  });

  return new NextResponse(null, { status: 201 });
}

// Returns ALL messages belonging to the conversationId from the query
export async function GET(req: Request) {
  try {
    const { error, user } = await getUser();

    if (error || !user) {
      console.error(error);
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return new NextResponse(
        JSON.stringify({ error: "Missing conversationId" }),
        { status: 400 },
      );
    }

    // Check that the conversation belongs to the user
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, user.id),
        ),
      )
      .limit(1);

    if (!conversation) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    // Fetch messages for that conversation
    const convoMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    return NextResponse.json(convoMessages);
  } catch (err) {
    console.error("/api/messages GET error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  const { error, user } = await getUser();

  if (error || !user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get("messageId");

  if (!messageId) {
    return new NextResponse(JSON.stringify({ error: "Missing messageId" }), {
      status: 400,
    });
  }

  // First, fetch the message and join with conversation to check ownership
  const [messageWithConvo] = await db
    .select({
      messageId: messages.id,
      conversationId: messages.conversationId,
      userId: conversations.userId,
    })
    .from(messages)
    .innerJoin(conversations, eq(messages.conversationId, conversations.id))
    .where(eq(messages.id, messageId))
    .limit(1);

  if (!messageWithConvo) {
    return new NextResponse(JSON.stringify({ error: "Message not found" }), {
      status: 404,
    });
  }

  if (messageWithConvo.userId !== user.id) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  // Proceed to delete
  await db.delete(messages).where(eq(messages.id, messageId));

  return new NextResponse(null, { status: 204 });
}
