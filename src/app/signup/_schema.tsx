import { z } from "zod";

export const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  "create-password": z.string(),
});

export type Schema = z.infer<typeof schema>;
