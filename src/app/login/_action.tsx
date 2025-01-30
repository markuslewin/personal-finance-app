"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { schema } from "~/app/login/_schema";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { cookies } from "next/headers";

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
      if (!user) {
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
    // todo: Don't send password back
    return submission.reply();
  }

  const cookieStore = await cookies();
  cookieStore.set("userId", submission.value.id);

  redirect("/");
};
