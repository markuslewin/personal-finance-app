import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "~/server/db";

export const getBudget = async (id: string) => {
  return db.budget.findUnique({
    select: {
      id: true,
      maximum: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      theme: {
        select: {
          id: true,
        },
      },
    },
    where: {
      id,
    },
  });
};

export const getBudgets = () => {
  return db.budget.findMany({
    select: {
      id: true,
      maximum: true,
      theme: {
        select: {
          color: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getBudgetsWithTransactions = () => {
  return db.budget.findMany({
    select: {
      id: true,
      maximum: true,
      category: {
        select: {
          id: true,
          name: true,
          Transaction: {
            select: {
              id: true,
              name: true,
              avatar: true,
              amount: true,
              date: true,
            },
            orderBy: {
              date: "desc",
            },
            take: 3,
          },
        },
      },
      theme: {
        select: {
          color: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const createBudget = async (data: {
  maximum: number;
  categoryId: string;
  themeId: string;
}) => {
  try {
    return await db.budget.create({
      data: {
        maximum: data.maximum,
        category: {
          connect: {
            id: data.categoryId,
          },
        },
        theme: {
          connect: {
            id: data.themeId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    // todo: Check `category` and `theme` constraints. See Pot actions
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new BudgetError("A budget of this category already exists", {
          cause: { field: "category", error },
        });
      }
    }
    throw error;
  }
};

export const updateBudget = async (data: {
  id: string;
  maximum: number;
  categoryId: string;
  themeId: string;
}) => {
  await db.budget.update({
    data: {
      maximum: data.maximum,
      category: {
        connect: {
          id: data.categoryId,
        },
      },
      theme: {
        connect: {
          id: data.themeId,
        },
      },
    },
    where: {
      id: data.id,
    },
  });
};

export const deleteBudget = async (id: string) => {
  await db.budget.delete({
    where: {
      id,
    },
  });
};

export class BudgetError extends Error {
  cause: Cause;

  constructor(message: string, options: ErrorOptions & { cause: Cause }) {
    super(message, options);
    this.name = "BudgetError";
    this.cause = options.cause;
  }
}

type Cause = {
  field: "category";
  error: Error;
};
