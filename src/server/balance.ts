import "server-only";
import { db } from "~/server/db";

export const getBalance = () => {
  return db.balance.findFirstOrThrow({
    select: {
      current: true,
    },
  });
};
