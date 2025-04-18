import { selectModelSchema } from "@/db/validators/models";
import { z } from "zod";

export type ModelResponse = z.infer<typeof selectModelSchema>;
