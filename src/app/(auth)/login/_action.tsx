"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { type Schema, schema } from "~/app/(auth)/login/_schema";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createSession } from "~/app/_auth";

export const login = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: schema.transform(async (val, ctx) => {
      const user = await db.user.findUnique({
        select: {
          id: true,
          password: {
            select: {
              hash: true,
            },
          },
        },
        where: {
          email: val.email,
        },
      });
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (!user || user.password === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid credentials",
        });
        return z.NEVER;
      }

      const isSuccess = await bcrypt.compare(val.password, user.password.hash);
      if (!isSuccess) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid credentials",
        });
        return z.NEVER;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }),
  });
  if (submission.status !== "success") {
    return submission.reply({
      hideFields: ["password"] satisfies (keyof Schema)[],
    });
  }

  await createSession(submission.value.id);

  redirect("/");
};
