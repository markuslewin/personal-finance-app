import { z } from "zod";

export const budgetSchema = z.object({
  maximum: z.number().positive().int(),
  category: z.string(),
  theme: z.string(),
});

export type BudgetSchema = z.infer<typeof budgetSchema>;

export const budgetSchemaWithId = budgetSchema.extend({
  id: z.string(),
});

export type BudgetSchemaWithId = z.infer<typeof budgetSchemaWithId>;
