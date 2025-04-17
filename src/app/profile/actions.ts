import { db } from "@/db";
import { users_info, InsertUsersInfo } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encrypt, decrypt } from "@/utils/server-encryption";

export async function selectUserInfo(user_id: string) {
  const userInfos = await db
    .select()
    .from(users_info)
    .where(eq(users_info.id, user_id));

  return userInfos.map((user) => ({
    ...user,
    // If performance becomes an issue, consider caching decrypted values in a secure manner
    openaiApiKey: user.openaiApiKey ? decrypt(user.openaiApiKey) : null,
  }));
}

export async function insertUserInfo(user_id: string) {
  const initialApiKey = "";
  const encryptedInitialApiKey = encrypt(initialApiKey);

  return db.insert(users_info).values({
    id: user_id,
    username: "",
    openaiApiKey: encryptedInitialApiKey,
    aiModel: "gpt-4o-mini",
  });
}

export async function updateUserInfo({
  id,
  username,
  openaiApiKey,
  aiModel,
}: InsertUsersInfo) {
  // Only encrypt if the API key has changed
  // First get the current (encrypted) value from DB
  const currentUserInfo = await db
    .select({ openaiApiKey: users_info.openaiApiKey })
    .from(users_info)
    .where(eq(users_info.id, id))
    .then((results) => results[0]);

  // Decrypt the current API key
  const currentDecryptedKey = currentUserInfo?.openaiApiKey
    ? decrypt(currentUserInfo.openaiApiKey)
    : "";

  // Only re-encrypt if the key has changed or if we need to encrypt the first time
  let finalApiKey = currentUserInfo?.openaiApiKey || "";
  if (openaiApiKey && openaiApiKey !== currentDecryptedKey) {
    finalApiKey = encrypt(openaiApiKey);
  }

  const updateData: Record<string, unknown> = {};
  if (typeof username === "string") updateData.username = username;
  if (openaiApiKey !== undefined) updateData.openaiApiKey = finalApiKey;
  if (aiModel !== undefined) updateData.aiModel = aiModel;

  return db
    .update(users_info)
    .set(updateData)
    .where(eq(users_info.id, id))
    .returning();
}
