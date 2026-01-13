"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  addMoneySchema,
  editPotSchema,
  potSchema,
  removePotSchema,
  withdrawSchema,
  type AddMoneySchema,
  type EditPotSchema,
  type PotSchema,
  type WithdrawSchema,
} from "~/app/(main)/pots/_schemas";
import {
  addMoneyToPot,
  createPot,
  deletePot,
  PotError,
  updatePot,
  withdrawMoneyFromPot,
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
          const result = potSchema.keyof().safeParse(error.cause.field);
          if (result.success) {
            ctx.addIssue({
              path: [result.data] satisfies [keyof PotSchema],
              code: z.ZodIssueCode.custom,
              message: error.message,
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
          const result = editPotSchema.keyof().safeParse(error.cause.field);
          if (result.success) {
            ctx.addIssue({
              path: [result.data] satisfies [keyof EditPotSchema],
              code: z.ZodIssueCode.custom,
              message: error.message,
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
      try {
        await addMoneyToPot(val);
        return true;
      } catch (error) {
        if (error instanceof PotError) {
          const result = addMoneySchema.keyof().safeParse(error.cause.field);
          if (result.success) {
            ctx.addIssue({
              path: [result.data] satisfies [keyof AddMoneySchema],
              code: z.ZodIssueCode.custom,
              message: error.message,
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

  revalidatePath("/pots");
  redirect("/pots");
};

export const withdraw = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: withdrawSchema.transform(async (val, ctx) => {
      try {
        await withdrawMoneyFromPot(val);
        return true;
      } catch (error) {
        if (error instanceof PotError) {
          const result = withdrawSchema.keyof().safeParse(error.cause.field);
          if (result.success) {
            ctx.addIssue({
              path: [result.data] satisfies [keyof WithdrawSchema],
              code: z.ZodIssueCode.custom,
              message: error.message,
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

  revalidatePath("/pots");
  redirect("/pots");
};
