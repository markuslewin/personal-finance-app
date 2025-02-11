import { z } from "zod";

export const schema = z.object({
  maximum: z.number().positive().int(),
  category: z.string(),
  theme: z.string(),
});

export type Schema = z.infer<typeof schema>;
