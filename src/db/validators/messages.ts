import { z } from "zod";

export const insertMessageSchema = z.object({
  conversationId: z.string().uuid(),
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

export const deleteMessageSchema = z.object({
  messageId: z.string().uuid(),
});

export const getMessagesSchema = z.object({
  conversationId: z.string().uuid(),
});
