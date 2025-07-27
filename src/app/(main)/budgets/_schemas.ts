import { z } from "zod";
import { centsSchema } from "~/app/_currency";

export const budgetSchema = z.object({
  maximum: centsSchema,
  category: z.string(),
  theme: z.string(),
});

export type BudgetSchema = z.infer<typeof budgetSchema>;

export const budgetIdSchema = z.object({
  id: z.string(),
});

export type BudgetIdSchema = z.infer<typeof budgetIdSchema>;

export const budgetSchemaWithId = budgetSchema.merge(budgetIdSchema);

export type BudgetSchemaWithId = z.input<typeof budgetSchemaWithId>;
