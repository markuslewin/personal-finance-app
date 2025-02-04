"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "~/app/_auth";

export const logOut = async () => {
  await deleteSession();
  redirect("/login");
};
