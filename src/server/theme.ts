import "server-only";
import { db } from "~/server/db";
import { getUser } from "~/server/user";

export const getThemesWithBudget = async () => {
  const user = await getUser();
  return db.theme.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      Budget: {
        select: {
          id: true,
        },
        where: {
          userId: user.id,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getThemesWithPot = async () => {
  const user = await getUser();
  return db.theme.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      Pot: {
        select: {
          id: true,
        },
        where: {
          userId: user.id,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
