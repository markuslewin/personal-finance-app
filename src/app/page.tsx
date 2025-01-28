import { type Metadata } from "next";
import { db } from "~/server/db";

export const metadata: Metadata = {
  title: "Frontend Mentor | Personal finance app - Overview",
};

const OverviewPage = async () => {
  const [balance, pots, transactions, budgets, recurringBills] =
    await Promise.all([
      db.balance.findFirst({
        select: {
          current: true,
          expenses: true,
          income: true,
        },
      }),
      db.pot.findMany({
        select: {
          id: true,
          name: true,
          theme: {
            select: {
              color: true,
            },
          },
          total: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      db.transaction.findMany({
        take: 5,
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
      }),
      db.budget.findMany({
        select: {
          id: true,
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
      }),
      db.recurringBill.findMany({
        select: {
          amount: true,
          day: true,
        },
      }),
    ]);

  return (
    <>
      <h1 className="text-preset-1">Overview</h1>
      <h2 className="text-preset-2">Balance</h2>
      <pre>{JSON.stringify(balance, undefined, "\t")}</pre>
      <h2 className="text-preset-2">Pots</h2>
      <pre>{JSON.stringify(pots, undefined, "\t")}</pre>
      <h2 className="text-preset-2">Budgets</h2>
      <pre>{JSON.stringify(budgets, undefined, "\t")}</pre>
      <h2 className="text-preset-2">Transactions</h2>
      <pre>{JSON.stringify(transactions, undefined, "\t")}</pre>
      <h2 className="text-preset-2">Recurring Bills</h2>
      <pre>{JSON.stringify(recurringBills, undefined, "\t")}</pre>
    </>
  );
};

export default OverviewPage;
