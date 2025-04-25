import { createSelectSchema } from "drizzle-zod";
import { chunks } from "../schemas/chunks";

export const selectChunkSchema = createSelectSchema(chunks);

