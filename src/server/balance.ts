import "server-only";
import { db } from "~/server/db";
import { getUser } from "~/server/user";

export const getBalance = async () => {
  const user = await getUser();
  return db.balance.findUniqueOrThrow({
    select: {
      current: true,
    },
    where: {
      userId: user.id,
    },
  });
};
