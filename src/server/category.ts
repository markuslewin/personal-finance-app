import "server-only";
import { db } from "~/server/db";

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

export const getAvailableCategories = (includeCategoryId?: string) => {
  return db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    where:
      includeCategoryId === undefined
        ? {
            Budget: { is: null },
          }
        : {
            OR: [
              { Budget: { is: null } },
              {
                Budget: {
                  categoryId: includeCategoryId,
                },
              },
            ],
          },
    orderBy: {
      createdAt: "asc",
    },
  });
};
