"use server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { removePotSchema, potSchema, editPotSchema } from "~/app/pots/_schemas";
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
