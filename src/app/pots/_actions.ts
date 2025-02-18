"use server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  removePotSchema,
  potSchema,
  editPotSchema,
  addMoneySchema,
} from "~/app/pots/_schemas";
import { db } from "~/server/db";

export const add = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: potSchema.transform(async (val) => {
      return await db.pot.create({
        data: {
          name: val.name,
          target: val.target,
          total: 0,
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
    }),
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  revalidatePath("/pots");
  redirect("/pots");
};

export const edit = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: editPotSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await db.pot.update({
    data: {
      name: submission.value.name,
      target: submission.value.target,
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

  revalidatePath("/pots");
  redirect("/pots");
};

export const remove = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: removePotSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await db.pot.delete({
    where: {
      id: submission.value.id,
    },
  });

  revalidatePath("/pots");
  redirect("/pots");
};

export const addMoney = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: addMoneySchema.transform(async (val, ctx) => {
      // todo: Transaction
      try {
        const balance = await db.balance.findFirstOrThrow({
          select: {
            id: true,
            current: true,
          },
        });
        await db.balance.update({
          data: {
            current: balance.current - val.amount,
          },
          where: {
            id: balance.id,
          },
        });

        const pot = await db.pot.findUniqueOrThrow({
          select: {
            id: true,
            total: true,
          },
          where: { id: val.id },
        });
        await db.pot.update({
          data: {
            total: pot.total + val.amount,
          },
          where: {
            id: pot.id,
          },
        });

        return true;
      } catch (error) {
        // todo: ctx.addIssue "Insufficient funds"
        throw error;
      }
    }),
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  revalidatePath("/pots");
  redirect("/pots");
};
