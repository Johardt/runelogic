import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";
import { z } from "zod";
import { userInfos } from "../schemas/userInfos";

export const insertUserInfoSchema = createInsertSchema(userInfos);
export const updateUserInfoSchema = createUpdateSchema(userInfos);
export const selectUserInfoSchema = createSelectSchema(userInfos);

// Optional: lean schema for frontend (optional instead of required)
export const userSettingsSchema = z.object({
  aiModel: z.string().nullable(),
  openaiApiKey: z.string().optional(),
  googleApiKey: z.string().optional(),
});
