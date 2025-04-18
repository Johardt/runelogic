import { getUser } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import {
  createMessage,
  deleteMessageById,
  getMessageWithOwner,
  getMessagesForConversation,
  verifyUserOwnsAdventure,
} from "@/db/services/messages";
import {
  insertMessageSchema,
  getMessagesSchema,
  deleteMessageSchema,
} from "@/db/validators/messages";

export async function POST(req: NextRequest) {
  const { error, user } = await getUser();
  if (error || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = insertMessageSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );

  const { conversationId, role, content } = parsed.data;

  const allowed = await verifyUserOwnsAdventure(conversationId, user.id);
  if (!allowed)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await createMessage({ conversationId, role, content });
  return new NextResponse(null, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { error, user } = await getUser();
  if (error || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversationId = new URL(req.url).searchParams.get("conversationId");
  const parsed = getMessagesSchema.safeParse({ conversationId });
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );

  const allowed = await verifyUserOwnsAdventure(
    parsed.data.conversationId,
    user.id,
  );
  if (!allowed)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const convoMessages = await getMessagesForConversation(
    parsed.data.conversationId,
  );
  return NextResponse.json(convoMessages);
}

export async function DELETE(req: NextRequest) {
  const { error, user } = await getUser();
  if (error || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messageId = new URL(req.url).searchParams.get("messageId");
  const parsed = deleteMessageSchema.safeParse({ messageId });
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );

  const msg = await getMessageWithOwner(parsed.data.messageId);
  if (!msg)
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  if (msg.userId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await deleteMessageById(parsed.data.messageId);
  return new NextResponse(null, { status: 204 });
}
