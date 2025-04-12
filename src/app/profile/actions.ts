import { db } from "@/db";
import { users_info, InsertUsersInfo } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function selectUserInfo(user_id: string) {
  return await db.select().from(users_info).where(eq(users_info.id, user_id));
}

export async function insertUserInfo(user_id: string) {
  return db.insert(users_info).values({
    id: user_id,
    username: "",
    ai_api_key: "",
    ai_model: "gpt-4o-mini",
  });
}

export async function updateUserInfo(user: InsertUsersInfo) {
  const { id, ...updateFields } = user;
  return db
    .update(users_info)
    .set(updateFields)
    .where(eq(users_info.id, id))
    .returning();
}
