import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "~/server/db";
import { getUser } from "~/server/user";
import { requireRealUser } from "~/app/_auth";

export const getBudget = async (id: string) => {
  const user = await getUser();
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
      userId: user.id,
    },
  });
};

export const getBudgets = async () => {
  const user = await getUser();
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
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getBudgetsWithTransactions = async () => {
  const user = await getUser();
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
    where: {
      userId: user.id,
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
    const user = await requireRealUser();
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
        user: {
          connect: {
            id: user.id,
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
  const user = await requireRealUser();
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
      userId: user.id,
    },
  });
};

export const deleteBudget = async (id: string) => {
  const user = await requireRealUser();
  await db.budget.delete({
    where: {
      id,
      userId: user.id,
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
