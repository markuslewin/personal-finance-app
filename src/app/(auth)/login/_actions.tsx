"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "next/navigation";
import * as z from "zod";
import { type Schema, schema } from "~/app/(auth)/login/_schema";
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
          ctx.issues.push({
            code: "custom",
            input: val,
            message: error.message,
            path: [error.cause.field] satisfies [keyof Schema],
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
