"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import {
  budgetIdSchema,
  type BudgetSchema,
  budgetSchema,
  editBudgetSchema,
} from "~/app/(main)/budgets/_schemas";
import {
  BudgetError,
  createBudget,
  deleteBudget,
  updateBudget,
} from "~/server/budget";

export const add = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: budgetSchema.transform(async (val, ctx) => {
      try {
        return await createBudget({
          maximum: val.maximum,
          categoryId: val.category,
          themeId: val.theme,
        });
      } catch (error) {
        if (error instanceof BudgetError) {
          ctx.issues.push({
            code: "custom",
            input: val,
            message: error.message,
            path: [error.cause.field] satisfies [keyof BudgetSchema],
          });
          return z.NEVER;
        }
        throw error;
      }
    }),
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  revalidatePath("/budgets");
  redirect("/budgets");
};

// todo: Restructure, see Pot action
export const edit = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: editBudgetSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await updateBudget({
    id: submission.value.id,
    maximum: submission.value.maximum,
    categoryId: submission.value.category,
    themeId: submission.value.theme,
  });

  revalidatePath("/budgets");
  redirect("/budgets");
};

// todo: Restructure, see Pot action
export const remove = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: budgetIdSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await deleteBudget(submission.value.id);

  revalidatePath("/budgets");
  redirect("/budgets");
};
