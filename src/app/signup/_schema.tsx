import { z } from "zod";

export const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  "create-password": z
    .string()
    // `bcrypt` uses only the first 72 bytes
    .refine(
      (val) => new TextEncoder().encode(val).length <= 72,
      "Password is too long",
    ),
});

export type Schema = z.infer<typeof schema>;
