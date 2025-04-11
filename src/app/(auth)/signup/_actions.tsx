"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { type Schema, schema } from "~/app/(auth)/signup/_schema";
import { signUp as _signUp, UserError } from "~/server/user";
import { z } from "zod";

export const signUp = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: schema.transform(async (val, ctx) => {
      try {
        await _signUp({
          name: val.name,
          email: val.email,
          password: val["create-password"],
        });
      } catch (error) {
        if (error instanceof UserError) {
          // todo: Utility
          const field = schema.keyof().safeParse(error.cause.field);
          ctx.addIssue({
            path: field.success
              ? ([field.data] satisfies [keyof Schema])
              : undefined,
            code: z.ZodIssueCode.custom,
            message: error.message,
          });
        }

        throw error;
      }

      return true;
    }),
  });
  if (submission.status !== "success") {
    return submission.reply({
      hideFields: ["create-password"] satisfies [keyof Schema],
    });
  }

  redirect("/");
};
