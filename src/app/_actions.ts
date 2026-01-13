"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import { deleteSession } from "~/app/_auth";
import { setIsSidebarOpen } from "~/app/_sidebar";

export const logOut = async () => {
  await deleteSession();
  redirect("/login");
};

const minimizeMenuSchema = z.object({
  redirectTo: z.optional(z.string()),
  value: z.preprocess((val) => val === "true", z.boolean()),
});

export const minimizeMenu = async (formData: FormData) => {
  const result = minimizeMenuSchema.parse(Object.fromEntries(formData));

  setIsSidebarOpen(result.value, await cookies());

  if (typeof result.redirectTo === "string") {
    // todo: Unsafe?
    redirect(result.redirectTo);
  }
};
