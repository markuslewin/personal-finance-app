import { getBudgetsWithTransactions } from "@prisma/client/sql";
import { type Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { now } from "~/app/_now";
import { db } from "~/server/db";

export const metadata: Metadata = {
  title: "Budgets",
};

const BudgetsPage = async () => {
  const nowDate = new Date(now);
  const budgetsResult = await db.$queryRawTyped(
    getBudgetsWithTransactions(nowDate.getFullYear(), nowDate.getMonth() + 1),
  );

  const budgets = Object.values(
    budgetsResult.reduce(
      (acc, cur) => {
        return {
          ...acc,
          [cur.id]: {
            id: cur.id,
            maximum: cur.maximum,
            category: {
              name: cur.categoryName,
              Transaction: [
                ...(acc[cur.id]?.category.Transaction ?? []),
                {
                  id: cur.transactionId,
                  amount: cur.transactionAmount,
                  avatar: cur.transactionAvatar,
                  date: cur.transactionDate,
                  name: cur.transactionName,
                },
              ],
            },
            theme: {
              color: cur.themeColor,
            },
          } satisfies BudgetModel,
        };
      },
      {} as Record<string, BudgetModel>,
    ),
  );

  return (
    <>
      <h1 className="text-preset-1">Budgets</h1>
      <p>
        <Link href={"/budgets/add"}>
          <span aria-hidden="true">+ </span>Add New Budget
        </Link>
      </p>
      {budgets.map((budget) => {
        return (
          <Fragment key={budget.id}>
            <h2 className="text-preset-2">{budget.category.name}</h2>
            <div
              className="size-500"
              style={{ background: budget.theme.color }}
            />
            <pre>{JSON.stringify(budget, undefined, "\t")}</pre>
          </Fragment>
        );
      })}
      <p>
        <Link href={"/budgets/edit"}>Edit Budget</Link>
      </p>
    </>
  );
};

export default BudgetsPage;

interface BudgetModel {
  id: string;
  maximum: number;
  category: {
    name: string;
    Transaction: {
      id: string;
      amount: number;
      avatar: string;
      date: Date;
      name: string;
    }[];
  };
  theme: { color: string };
}
