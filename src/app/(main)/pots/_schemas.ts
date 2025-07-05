import { z } from "zod";
import { maxInt } from "~/app/_prisma";

export const NAME_MAX_LENGTH = 30;

const id = z.string();
const name = z.string().max(NAME_MAX_LENGTH);
const target = z.number().positive().int().lte(maxInt);
const theme = z.string();

export const amount = z.number().positive().int().lte(maxInt);

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

export const addMoneySchema = z.object({
  id,
  amount,
});

export type AddMoneySchema = z.infer<typeof addMoneySchema>;

export const withdrawSchema = z.object({
  id,
  amount,
});

export type WithdrawSchema = z.infer<typeof withdrawSchema>;
