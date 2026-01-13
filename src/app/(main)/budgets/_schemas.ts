import * as z from "zod";
import { centsSchema } from "~/app/_currency";
import { requiredParams } from "~/app/_zod";

const id = z.string();
const maximum = centsSchema;
const category = z.string(requiredParams);
const theme = z.string(requiredParams);

export const budgetSchema = z.object({
  maximum,
  category,
  theme,
});

export type BudgetSchema = z.infer<typeof budgetSchema>;

export const budgetIdSchema = z.object({
  id,
});

export type BudgetIdSchema = z.infer<typeof budgetIdSchema>;

export const editBudgetSchema = z.object({
  id,
  maximum,
  category,
  theme,
});
export type EditBudget = z.input<typeof editBudgetSchema>;
