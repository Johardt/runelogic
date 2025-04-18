import { db } from "@/db";
import { messages } from "@/db/schemas/messages";
import { adventures } from "@/db/schemas/adventures";
import { and, eq } from "drizzle-orm";

export async function verifyUserOwnsAdventure(
  adventureId: string,
  userId: string,
) {
  const result = await db
    .select()
    .from(adventures)
    .where(and(eq(adventures.id, adventureId), eq(adventures.userId, userId)))
    .limit(1);

  return result.length > 0;
}

export async function createMessage({
  conversationId,
  role,
  content,
}: {
  conversationId: string;
  role: string;
  content: string;
}) {
  await db.insert(messages).values({ conversationId, role, content });
}

export async function getMessagesForConversation(conversationId: string) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function getMessageWithOwner(messageId: string) {
  const [result] = await db
    .select({
      messageId: messages.id,
      conversationId: messages.conversationId,
      userId: adventures.userId,
    })
    .from(messages)
    .innerJoin(adventures, eq(messages.conversationId, adventures.id))
    .where(eq(messages.id, messageId))
    .limit(1);

  return result;
}

export async function deleteMessageById(messageId: string) {
  await db.delete(messages).where(eq(messages.id, messageId));
}
