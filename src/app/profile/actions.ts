import { db } from "@/db";
import { userInfos, InsertUsersInfo } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encrypt, decrypt } from "@/utils/server-encryption";

export async function selectUserInfo(user_id: string) {
  const userInfos = await db
    .select()
    .from(userInfos)
    .where(eq(userInfos.id, user_id));

  return userInfos.map((user) => ({
    ...user,
    // If performance becomes an issue, consider caching decrypted values in a secure manner
    openaiApiKey: user.openaiApiKey ? decrypt(user.openaiApiKey) : null,
    googleApiKey: user.googleApiKey ? decrypt(user.googleApiKey) : null,
  }));
}

export async function insertUserInfo(user_id: string) {
  const initialApiKey = "";
  const encryptedInitialApiKey = encrypt(initialApiKey);

  return db.insert(userInfos).values({
    id: user_id,
    username: "",
    openaiApiKey: encryptedInitialApiKey,
    googleApiKey: encryptedInitialApiKey,
    aiModel: "gpt-4o-mini",
  });
}

export async function updateUserInfo({
  id,
  username,
  openaiApiKey,
  googleApiKey,
  aiModel,
}: InsertUsersInfo) {
  // Only encrypt if the API key has changed
  // First get the current (encrypted) value from DB
  const currentUserInfo = await db
    .select({
      openaiApiKey: userInfos.openaiApiKey,
      googleApiKey: userInfos.googleApiKey,
    })
    .from(userInfos)
    .where(eq(userInfos.id, id))
    .then((results) => results[0]);

  const currentDecryptedOpenAIKey = currentUserInfo?.openaiApiKey
    ? decrypt(currentUserInfo.openaiApiKey)
    : "";
  const currentDecryptedGoogleKey = currentUserInfo?.googleApiKey
    ? decrypt(currentUserInfo.googleApiKey)
    : "";

  // Only re-encrypt if the key has changed or if we need to encrypt the first time
  let finalOpenAIKey = currentUserInfo?.openaiApiKey || "";
  if (openaiApiKey && openaiApiKey !== currentDecryptedOpenAIKey) {
    finalOpenAIKey = encrypt(openaiApiKey);
  }

  let finalGoogleKey = currentUserInfo?.googleApiKey || "";
  if (googleApiKey && googleApiKey !== currentDecryptedGoogleKey) {
    finalGoogleKey = encrypt(googleApiKey);
  }

  const updateData: Record<string, unknown> = {};
  if (typeof username === "string") updateData.username = username;
  if (openaiApiKey !== undefined) updateData.openaiApiKey = finalOpenAIKey;
  if (googleApiKey !== undefined) updateData.googleApiKey = finalGoogleKey;
  if (aiModel !== undefined) updateData.aiModel = aiModel;

  return db
    .update(userInfos)
    .set(updateData)
    .where(eq(userInfos.id, id))
    .returning();
}
