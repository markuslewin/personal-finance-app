import { z } from "zod";

export const NAME_MAX_LENGTH = 30;

const id = z.string();
const name = z.string().max(NAME_MAX_LENGTH);
const target = z.number().positive().int();
const theme = z.string();

export const potSchema = z.object({
  name,
  target,
  theme,
});

export type PotSchema = z.infer<typeof potSchema>;

export const removePotSchema = z.object({
  id,
});

export type RemovePotSchema = z.infer<typeof removePotSchema>;

export const editPotSchema = z.object({
  id,
  name,
  target,
  theme,
});

export type EditPotSchema = z.infer<typeof editPotSchema>;
