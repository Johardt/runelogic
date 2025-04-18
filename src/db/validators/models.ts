import { models } from "../schema";
import { createSelectSchema } from "drizzle-zod";

export const selectModelSchema = createSelectSchema(models)