import * as z from "zod";
import { centsSchema } from "~/app/_currency";
import { requiredParams } from "~/app/_zod";

export const NAME_MAX_LENGTH = 30;

const id = z.string();
const name = z.string(requiredParams).max(NAME_MAX_LENGTH);
const target = centsSchema;
const theme = z.string(requiredParams);

export const amount = centsSchema;

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

export type EditPotSchema = z.input<typeof editPotSchema>;

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
