"use server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  removePotSchema,
  potSchema,
  editPotSchema,
  addMoneySchema,
  type AddMoneySchema,
  withdrawSchema,
  type PotSchema,
} from "~/app/(main)/pots/_schemas";
import { db } from "~/server/db";
import {
  createPot,
  deletePot,
  getPot,
  PotError,
  updatePot,
} from "~/server/pot";

export const add = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: potSchema.transform(async (val, ctx) => {
      try {
        return await createPot({
          name: val.name,
          target: val.target,
          themeId: val.theme,
        });
      } catch (error) {
        if (error instanceof PotError) {
          ctx.addIssue({
            path: [error.cause.field] satisfies [keyof PotSchema],
            code: z.ZodIssueCode.custom,
            message: error.message,
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

  revalidatePath("/pots");
  redirect("/pots");
};

export const edit = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: editPotSchema.transform(async (val, ctx) => {
      try {
        await updatePot({
          id: val.id,
          name: val.name,
          target: val.target,
          themeId: val.theme,
        });
        return true;
      } catch (error) {
        if (error instanceof PotError) {
          ctx.addIssue({
            path: [error.cause.field] satisfies [keyof PotSchema],
            code: z.ZodIssueCode.custom,
            message: error.message,
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

  revalidatePath("/pots");
  redirect("/pots");
};

export const remove = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: removePotSchema.transform(async (val) => {
      await deletePot(val.id);
      return true;
    }),
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  revalidatePath("/pots");
  redirect("/pots");
};

export const addMoney = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: addMoneySchema.transform(async (val, ctx) => {
      // todo: Transaction
      // todo: Lock
      const balance = await db.balance.findFirstOrThrow({
        select: {
          id: true,
          current: true,
        },
      });
      if (balance.current < val.amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["amount"] satisfies [keyof AddMoneySchema],
          message: "Insufficient funds",
        });
        return z.NEVER;
      }

      await db.balance.update({
        data: {
          current: balance.current - val.amount,
        },
        where: {
          id: balance.id,
        },
      });

      const pot = await getPot(val.id);
      if (!pot) {
        throw new Error("Pot not found");
      }

      await updatePot({
        id: pot.id,
        total: pot.total + val.amount,
      });

      return true;
    }),
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  revalidatePath("/pots");
  redirect("/pots");
};

export const withdraw = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: withdrawSchema.transform(async (val, ctx) => {
      // todo: Transaction
      // todo: Lock
      const pot = await getPot(val.id);
      if (!pot) {
        throw new Error("Pot not found");
      }

      if (pot.total < val.amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["amount"] satisfies [keyof AddMoneySchema],
          message: "Insufficient funds",
        });
        return z.NEVER;
      }

      await updatePot({
        id: pot.id,
        total: pot.total - val.amount,
      });

      const balance = await db.balance.findFirstOrThrow({
        select: {
          id: true,
          current: true,
        },
      });
      await db.balance.update({
        data: {
          current: balance.current + val.amount,
        },
        where: {
          id: balance.id,
        },
      });

      return true;
    }),
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  revalidatePath("/pots");
  redirect("/pots");
};
