"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { schema } from "~/app/signup/_schema";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export const signup = async (prevState: unknown, formData: FormData) => {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: schema.refine(
      async (val) => {
        const user = await db.user.findUnique({
          select: {
            id: true,
          },
          where: {
            email: val.email,
          },
        });
        return !user;
      },
      // todo: Don't expose this information. Send email with link to onboarding
      { path: ["email"], message: "This email is already in use" },
    ),
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const hashedPassword = await bcrypt.hash(
    submission.value["create-password"],
    10,
  );
  // todo: Seed tables of mutable data with `user.id`
  const user = await db.user.create({
    data: {
      email: submission.value.email,
      name: submission.value.name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
    select: {
      id: true,
    },
  });

  const cookieStore = await cookies();
  // todo: Sign cookie
  cookieStore.set("userId", user.id, {
    // todo: Options
  });

  redirect("/");
};
