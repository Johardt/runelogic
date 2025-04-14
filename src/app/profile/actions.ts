import { db } from "@/db";
import { users_info, AiModelType } from "@/db/schema";
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
    ai_api_key: user.ai_api_key ? decrypt(user.ai_api_key) : null,
  }));
}

export async function insertUserInfo(user_id: string) {
  const initialApiKey = "";
  const encryptedInitialApiKey = encrypt(initialApiKey);

  return db.insert(users_info).values({
    id: user_id,
    username: "",
    ai_api_key: encryptedInitialApiKey,
    ai_model: "gpt-4o-mini",
  });
}

export async function updateUserInfo({
  id,
  username,
  ai_api_key,
  ai_model,
}: {
  id: string;
  username: string;
  ai_api_key: string;
  ai_model: AiModelType;
}) {
  // Only encrypt if the API key has changed
  // First get the current (encrypted) value from DB
  const currentUserInfo = await db
    .select({ ai_api_key: users_info.ai_api_key })
    .from(users_info)
    .where(eq(users_info.id, id))
    .then((results) => results[0]);

  // Decrypt the current API key
  const currentDecryptedKey = currentUserInfo?.ai_api_key
    ? decrypt(currentUserInfo.ai_api_key)
    : "";

  // Only re-encrypt if the key has changed or if we need to encrypt the first time
  let finalApiKey = currentUserInfo?.ai_api_key || "";
  if (ai_api_key !== currentDecryptedKey) {
    finalApiKey = encrypt(ai_api_key);
  }

  return db
    .update(users_info)
    .set({
      username,
      ai_api_key: finalApiKey,
      ai_model,
    })
    .where(eq(users_info.id, id))
    .returning();
}
