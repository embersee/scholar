import { z } from "zod";

export const institutionSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Institution = z.infer<typeof institutionSchema>;
