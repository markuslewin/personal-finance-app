import { type Prisma } from "@prisma/client";
import "server-only";
import { DEFAULT_SORT, getOrderBy } from "~/app/(main)/transactions/_search";
import { inUTCMonth } from "~/app/_prisma";
import { type SortingOption } from "~/app/_sort";
import { db } from "~/server/db";
import { getUser } from "~/server/user";

export const getTransactions = (options?: { take?: number }) => {
  return db.transaction.findMany({
    select: {
      id: true,
      amount: true,
      avatar: true,
      date: true,
      name: true,
    },
    orderBy: {
      date: "desc",
    },
    take: options?.take,
  });
};

export const getTransactionsForMonth = async (date: Date) => {
  const user = await getUser();
  const transactions = await db.transaction.findMany({
    select: {
      id: true,
      amount: true,
      category: {
        select: {
          Budget: {
            select: {
              id: true,
            },
            where: {
              userId: user.id,
            },
          },
        },
      },
    },
    where: {
      date: inUTCMonth(date),
    },
    orderBy: {
      date: "desc",
    },
  });
  return transactions.map((transaction) => {
    if (transaction.category.Budget.length > 1) {
      throw new Error(
        `A user can have at most one budget related to a category, but user ${user.id} has ${transaction.category.Budget.length}`,
      );
    }

    const budget = transaction.category.Budget[0];
    return {
      id: transaction.id,
      amount: transaction.amount,
      category: { budget: budget ? { id: budget.id } : null },
    };
  });
};

const PAGE_SIZE = 10;

export const getPaginatedTransactions = async (options: {
  name?: string;
  category?: string;
  sort?: SortingOption;
  page?: number;
}) => {
  const where: Prisma.TransactionWhereInput = {
    name: {
      contains: options.name,
    },
    category: {
      name: options.category,
    },
  };
  const [transactions, count] = await Promise.all([
    db.transaction.findMany({
      select: {
        id: true,
        amount: true,
        avatar: true,
        date: true,
        name: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      where,
      orderBy: getOrderBy(options.sort ?? DEFAULT_SORT),
      skip: (options.page === undefined ? 0 : options.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.transaction.count({ where }),
  ]);

  return {
    transactions,
    totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE)),
  };
};

export const getSumByCategoryForMonth = async (
  categoryIds: string[],
  date: Date,
) => {
  const result = await db.transaction.groupBy({
    by: "categoryId",
    _sum: {
      amount: true,
    },
    where: {
      AND: [
        {
          categoryId: {
            in: categoryIds,
          },
        },
        {
          amount: {
            lt: 0,
          },
          date: inUTCMonth(date),
        },
      ],
    },
  });

  return Object.fromEntries(
    result.map((item) => [item.categoryId, item._sum.amount ?? 0]),
  );
};
