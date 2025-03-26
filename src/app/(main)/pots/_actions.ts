"use server";

import { parseWithZod } from "@conform-to/zod";
import { Prisma } from "@prisma/client";
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

export const add = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: potSchema.transform(async (val, ctx) => {
      try {
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
      } catch (error) {
        // Currently no way to check related fields
        // https://github.com/prisma/prisma/issues/5040
        // Assume `theme` constraint failed
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2014") {
            ctx.addIssue({
              path: ["theme"] satisfies [keyof PotSchema],
              code: z.ZodIssueCode.custom,
              message: "Theme already in use.",
            });
            return z.NEVER;
          } else if (error.code === "P2025") {
            ctx.addIssue({
              path: ["theme"] satisfies [keyof PotSchema],
              code: z.ZodIssueCode.custom,
              message: "Theme doesn't exist.",
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
        return await db.pot.update({
          select: {
            id: true,
          },
          data: {
            name: val.name,
            target: val.target,
            theme: {
              connect: {
                id: val.theme,
              },
            },
          },
          where: {
            id: val.id,
          },
        });
      } catch (error) {
        // Currently no way to check related fields
        // https://github.com/prisma/prisma/issues/5040
        // Assume `theme` constraint failed
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2014") {
            ctx.addIssue({
              path: ["theme"] satisfies [keyof PotSchema],
              code: z.ZodIssueCode.custom,
              message: "Theme already in use.",
            });
            return z.NEVER;
          } else if (error.code === "P2025") {
            ctx.addIssue({
              path: ["theme"] satisfies [keyof PotSchema],
              code: z.ZodIssueCode.custom,
              message: "Theme doesn't exist.",
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
      // todo: Transaction
      const pot = await db.pot.delete({
        select: {
          total: true,
        },
        where: {
          id: val.id,
        },
      });

      const balance = await db.balance.findFirstOrThrow();
      await db.balance.update({
        data: {
          current: balance.current + pot.total,
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
      const pot = await db.pot.findUniqueOrThrow({
        select: {
          id: true,
          total: true,
        },
        where: { id: val.id },
      });
      if (pot.total < val.amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["amount"] satisfies [keyof AddMoneySchema],
          message: "Insufficient funds",
        });
        return z.NEVER;
      }

      await db.pot.update({
        data: {
          total: pot.total - val.amount,
        },
        where: {
          id: pot.id,
        },
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
