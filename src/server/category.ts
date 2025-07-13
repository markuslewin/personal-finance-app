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
            Budget: {
              none: {
                userId: user.id,
              },
            },
          }
        : {
            OR: [
              {
                Budget: {
                  none: {
                    userId: user.id,
                  },
                },
              },
              {
                Budget: {
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
