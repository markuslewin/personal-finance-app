import "server-only";
import { db } from "~/server/db";

export const getThemesWithBudget = () => {
  return db.theme.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      Budget: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getThemesWithPot = () => {
  return db.theme.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      Pot: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
