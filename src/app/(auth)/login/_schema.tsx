import * as z from "zod";
import { requiredParams } from "~/app/_zod";

export const schema = z.object({
  email: z.email(requiredParams),
  password: z.string(requiredParams),
});

export type Schema = z.infer<typeof schema>;
