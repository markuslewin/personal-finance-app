"use server";

import { parseWithZod } from "@conform-to/zod";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  budgetIdSchema,
  type BudgetSchema,
  budgetSchema,
  budgetSchemaWithId,
} from "~/app/(main)/budgets/_schemas";
import { db } from "~/server/db";

export const add = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: budgetSchema.transform(async (val, ctx) => {
      try {
        return await db.budget.create({
          data: {
            maximum: val.maximum,
            category: {
              connect: {
                id: val.category,
              },
            },
            theme: {
              connect: {
                id: val.theme,
              },
            },
          },
          select: {
            id: true,
          },
        });
      } catch (error) {
        // todo: Check `category` and `theme` constraints. See Pot actions
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            ctx.addIssue({
              path: ["category"] satisfies [keyof BudgetSchema],
              code: z.ZodIssueCode.custom,
              message: "A budget of this category already exists",
            });
            return z.NEVER;
          }
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

export const edit = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: budgetSchemaWithId,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await db.budget.update({
    data: {
      maximum: submission.value.maximum,
      category: {
        connect: {
          id: submission.value.category,
        },
      },
      theme: {
        connect: {
          id: submission.value.theme,
        },
      },
    },
    where: {
      id: submission.value.id,
    },
  });

  revalidatePath("/budgets");
  redirect("/budgets");
};

export const remove = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: budgetIdSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await db.budget.delete({
    where: {
      id: submission.value.id,
    },
  });

  revalidatePath("/budgets");
  redirect("/budgets");
};
