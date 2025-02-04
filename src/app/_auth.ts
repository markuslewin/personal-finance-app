import { cookies } from "next/headers";
import { env } from "~/env";

export const createSession = async (userId: string) => {
  const cookieStore = await cookies();
  // todo: Sign cookie
  cookieStore.set("userId", userId, {
    path: "/",
    // todo: maxAge/expires,
    sameSite: "lax",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
  });
};
