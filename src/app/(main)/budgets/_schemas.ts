import { z } from "zod";
import { maxInt } from "~/app/_prisma";

export const budgetSchema = z.object({
  maximum: z.number().positive().int().lte(maxInt),
  category: z.string(),
  theme: z.string(),
});

export type BudgetSchema = z.infer<typeof budgetSchema>;

export const budgetIdSchema = z.object({
  id: z.string(),
});

export type BudgetIdSchema = z.infer<typeof budgetIdSchema>;

export const budgetSchemaWithId = budgetSchema.merge(budgetIdSchema);

export type BudgetSchemaWithId = z.infer<typeof budgetSchemaWithId>;
