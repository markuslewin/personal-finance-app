"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("userId");

  // todo: Fix redirect
  redirect("/login");
};
