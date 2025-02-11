"use server";

import { parseWithZod } from "@conform-to/zod";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { type Schema, schema } from "~/app/budgets/add/_schema";
import { db } from "~/server/db";

export const add = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: schema.transform(async (val, ctx) => {
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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            ctx.addIssue({
              path: ["category"] satisfies [keyof Schema],
              code: z.ZodIssueCode.custom,
              message: "A budget of this category already exists",
            });
            return z.NEVER;
          }
        }
      }
    }),
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  // todo: `revalidatePath`?
  redirect("/budgets");
};
