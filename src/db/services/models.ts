import { db } from "@/db";
import { models } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchModels(modelName?: string) {
  if (modelName) {
    return await db.select().from(models).where(eq(models.modelId, modelName));
  }
  return await db.select().from(models);
}
