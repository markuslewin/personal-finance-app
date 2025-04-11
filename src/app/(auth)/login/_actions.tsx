"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { type Schema, schema } from "~/app/(auth)/login/_schema";
import { z } from "zod";
import { logIn as _logIn, UserError } from "~/server/user";

export const logIn = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: schema.transform(async (val, ctx) => {
      try {
        await _logIn({
          email: val.email,
          password: val.password,
        });

        return true;
      } catch (error) {
        if (error instanceof UserError) {
          ctx.addIssue({
            path: [error.cause.field] satisfies [keyof Schema],
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
    return submission.reply({
      hideFields: ["password"] satisfies (keyof Schema)[],
    });
  }

  redirect("/");
};
