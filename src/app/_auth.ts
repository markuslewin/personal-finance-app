import { cookies } from "next/headers";
import { env } from "~/env";
import { sign, unsign } from "cookie-signature";

const name = "userId";

export const createSession = async (userId: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    path: "/",
    name,
    // todo: Encode
    value: sign(userId, env.SESSION_SECRET[0]),
    // todo: maxAge/expires,
    sameSite: "lax",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
  });
};

export const getSession = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  if (!cookie) {
    return null;
  }
  for (const secret of env.SESSION_SECRET) {
    const unsigned = unsign(cookie.value, secret);
    if (unsigned !== false) {
      return unsigned;
    }
  }
  return null;
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
