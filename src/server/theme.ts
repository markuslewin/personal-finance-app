import "server-only";
import { db } from "~/server/db";
import { getUser } from "~/server/user";

export const getThemesWithBudget = async () => {
  const user = await getUser();
  const themes = await db.theme.findMany({
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
  return themes.map((theme) => {
    if (theme.Budget.length > 1) {
      throw new Error(
        `A user can have at most one budget related to a theme, but user ${user.id} has ${theme.Budget.length}`,
      );
    }
    return {
      id: theme.id,
      name: theme.name,
      color: theme.color,
      budget: theme.Budget[0] ?? null,
    };
  });
};

export const getThemesWithPot = async () => {
  const user = await getUser();
  const themes = await db.theme.findMany({
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
  return themes.map((theme) => {
    if (theme.Pot.length > 1) {
      throw new Error(
        `A user can have at most one pot related to a theme, but user ${user.id} has ${theme.Pot.length}`,
      );
    }
    return {
      id: theme.id,
      name: theme.name,
      color: theme.color,
      pot: theme.Pot[0] ?? null,
    };
  });
};
