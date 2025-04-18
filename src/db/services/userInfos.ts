import { db } from "@/db";
import { userInfos } from "@/db/schemas/userInfos";
import { eq } from "drizzle-orm";
import { decrypt, encrypt } from "@/utils/server-encryption";
import type { InsertUserInfo } from "@/db/schemas/userInfos";

export async function getUserInfo(userId: string) {
  const users = await db
    .select()
    .from(userInfos)
    .where(eq(userInfos.id, userId));

  return users.map((user) => ({
    ...user,
    openaiApiKey: user.openaiApiKey ? decrypt(user.openaiApiKey) : null,
    googleApiKey: user.googleApiKey ? decrypt(user.googleApiKey) : null,
  }));
}

export async function updateUserInfoSecure({
  id,
  username,
  openaiApiKey,
  googleApiKey,
  aiModel,
}: InsertUserInfo) {
  const [current] = await db
    .select({
      openaiApiKey: userInfos.openaiApiKey,
      googleApiKey: userInfos.googleApiKey,
    })
    .from(userInfos)
    .where(eq(userInfos.id, id));

  const updates: Record<string, unknown> = {};

  if (typeof username === "string") updates.username = username;

  if (typeof openaiApiKey === "string") {
    const currentKey = current?.openaiApiKey
      ? decrypt(current.openaiApiKey)
      : "";
    if (openaiApiKey !== currentKey) {
      updates.openaiApiKey = encrypt(openaiApiKey);
    }
  }

  if (typeof googleApiKey === "string") {
    const currentKey = current?.googleApiKey
      ? decrypt(current.googleApiKey)
      : "";
    if (googleApiKey !== currentKey) {
      updates.googleApiKey = encrypt(googleApiKey);
    }
  }

  if (aiModel !== undefined) updates.aiModel = aiModel;

  return db
    .update(userInfos)
    .set(updates)
    .where(eq(userInfos.id, id))
    .returning();
}
