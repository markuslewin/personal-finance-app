import * as z from "zod";
import { requiredParams } from "~/app/_zod";

export const schema = z.object({
  name: z.string(requiredParams),
  email: z.email(requiredParams),
  "create-password": z
    .string(requiredParams)
    .min(8, "Passwords must be at least 8 characters")
    // `bcrypt` uses only the first 72 bytes
    .refine(
      (val) => new TextEncoder().encode(val).length <= 72,
      "Password is too long",
    ),
});

export type Schema = z.infer<typeof schema>;
