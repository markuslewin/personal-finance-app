import { z } from "zod";

export const NAME_MAX_LENGTH = 30;

export const potSchema = z.object({
  name: z.string().max(NAME_MAX_LENGTH),
  target: z.number().positive().int(),
  theme: z.string(),
});

export type PotSchema = z.infer<typeof potSchema>;

export const removePotSchema = z.object({
  id: z.string(),
});

export type RemovePotSchema = z.infer<typeof removePotSchema>;

export const potSchemaWithId = potSchema.merge(removePotSchema);

export type PotSchemaWithId = z.infer<typeof potSchemaWithId>;
