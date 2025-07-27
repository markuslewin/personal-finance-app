import "server-only";
import { db } from "~/server/db";
import { getUser } from "~/server/user";

export const getCategories = () => {
  return db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getAvailableCategories = async (includeCategoryId?: string) => {
  const user = await getUser();
  return db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    where:
      includeCategoryId === undefined
        ? {
            budgets: {
              none: {
                userId: user.id,
              },
            },
          }
        : {
            OR: [
              {
                budgets: {
                  none: {
                    userId: user.id,
                  },
                },
              },
              {
                budgets: {
                  some: {
                    categoryId: includeCategoryId,
                    userId: user.id,
                  },
                },
              },
            ],
          },
    orderBy: {
      createdAt: "asc",
    },
  });
};
