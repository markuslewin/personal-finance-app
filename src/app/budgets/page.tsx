import { getBudgetsWithTransactions } from "@prisma/client/sql";
import { type Metadata } from "next";
import Link from "next/link";
import { now } from "~/app/_now";
import { db } from "~/server/db";
import IconCaretRight from "~/app/_assets/icon-caret-right.svg";
import IconEllipsis from "~/app/_assets/icon-ellipsis.svg";
import Image from "next/image";
import * as Donut from "~/app/_components/ui/donut";
import * as Meter from "~/app/_components/meter";
import { currency, date } from "~/app/_format";
import Button from "~/app/_components/ui/button";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import BudgetActions from "~/app/budgets/_components/budget-actions-menu";

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
    <article>
      <header className="flex flex-wrap items-center justify-between">
        <h1 className="text-preset-1">Budgets</h1>
        {/* todo: Focus when navigating from dialog */}
        <Button asChild>
          <Link href={"/budgets/add"}>
            <span aria-hidden="true">+ </span>Add New Budget
          </Link>
        </Button>
      </header>
      <div className="mt-400 grid items-start gap-300 desktop:grid-cols-[428fr_608fr]">
        <div className="grid items-center gap-400 rounded-xl bg-white px-250 pb-200 pt-300 text-grey-500 tablet:grid-cols-2 tablet:p-400 desktop:grid-cols-none">
          <h2 className="sr-only">Spending</h2>
          <div className="py-250">
            <Donut.Root
              data={[
                { color: "green", percent: 0.05 },
                { color: "blue", percent: 0.77 },
                { color: "yellow", percent: 0.08 },
                { color: "grey", percent: 0.1 },
              ]}
            >
              <Donut.Hole>
                <p>
                  <strong className="block text-preset-1 text-grey-900">
                    todo
                  </strong>{" "}
                  of todo limit
                </p>
              </Donut.Hole>
            </Donut.Root>
          </div>
          <div>
            <h3 className="text-preset-2 text-grey-900">Spending Summary</h3>
            <ul
              className="mt-300 [&>*+*]:mt-200 [&>*+*]:border-t-[0.0625rem] [&>*+*]:border-grey-100 [&>*+*]:pt-200"
              role="list"
            >
              {budgets.map((budget) => {
                return (
                  <li className="flex gap-200" key={budget.id}>
                    <div
                      className="w-50 rounded-full"
                      style={{
                        background: budget.theme.color,
                      }}
                    />
                    <div className="flex grow flex-wrap items-center justify-between gap-100">
                      <h4>{budget.category.name}</h4>
                      <p>
                        <strong className="text-preset-3 text-grey-900">
                          {"todo"}
                        </strong>{" "}
                        of {currency(budget.maximum)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="grid gap-300">
          <h2 className="sr-only">Categories</h2>
          {budgets.map((budget) => {
            return (
              <article
                className="rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400"
                key={budget.id}
              >
                <header className="grid grid-cols-[auto_1fr_auto] items-center gap-200">
                  <div
                    className="size-200 rounded-full"
                    style={{ background: budget.theme.color }}
                  />
                  <h3 className="text-preset-2 text-grey-900">
                    {budget.category.name}
                  </h3>
                  <Hydrated>
                    <BudgetActions budget={budget} />
                  </Hydrated>
                  <Dehydrated>
                    <Link
                      className="transition-colors hocus:text-grey-900"
                      href={`/budgets/${budget.id}/edit`}
                    >
                      <span className="grid size-200 place-items-center">
                        <IconEllipsis />
                      </span>
                      <span className="sr-only">
                        {`Edit budget "${budget.category.name}"`}
                      </span>
                    </Link>
                  </Dehydrated>
                </header>
                <p className="mt-250">Maximum of {currency(budget.maximum)}</p>
                <p className="mt-200">
                  <Meter.Root
                    className="grid h-400 rounded bg-beige-100 p-50"
                    name="Amount spent"
                    min={0}
                    max={budget.maximum}
                    value={50}
                  >
                    <Meter.Indicator
                      className="w-1/2 rounded"
                      style={{ background: budget.theme.color }}
                    />
                  </Meter.Root>
                </p>
                <div className="mt-200 grid grid-cols-2 gap-200 text-preset-5">
                  <div className="grid grid-cols-[auto_1fr] gap-200">
                    <div
                      className="w-50 rounded-full"
                      style={{ background: budget.theme.color }}
                    />
                    <div className="grid gap-50">
                      <h4>Spent</h4>
                      <p className="text-preset-4-bold text-grey-900">
                        {"TODO"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-200">
                    <div className="w-50 rounded-full bg-beige-100" />
                    <div className="grid gap-50">
                      <h4>Free</h4>
                      <p className="text-preset-4-bold text-grey-900">
                        {"TODO"}
                      </p>
                    </div>
                  </div>
                </div>
                <article className="mt-250 rounded-xl bg-beige-100 p-200 text-grey-500 tablet:p-250">
                  <header className="flex flex-wrap justify-between">
                    <h4 className="text-preset-3 text-grey-900">
                      Latest Spending
                    </h4>
                    <Link
                      className="grid grid-cols-[1fr_auto] items-center gap-150 transition-colors hocus:text-grey-900"
                      href={"/transactions"}
                    >
                      See All
                      <span className="grid size-150 place-items-center">
                        <IconCaretRight />
                      </span>
                    </Link>
                  </header>
                  <ol
                    className="mt-250 text-preset-5 [&>*+*]:mt-150 [&>*+*]:border-t-[0.0625rem] [&>*+*]:border-grey-500/15 [&>*+*]:pt-150"
                    role="list"
                  >
                    {budget.category.Transaction.map((transaction) => {
                      return (
                        <li
                          className="grid grid-cols-[1fr_auto] items-center gap-200 tablet:grid-cols-[auto_1fr_auto]"
                          key={transaction.id}
                        >
                          <Image
                            className="hidden size-400 rounded-full tablet:block"
                            alt=""
                            src={transaction.avatar}
                            width={160}
                            height={160}
                          />
                          <h5 className="text-preset-5-bold text-grey-900">
                            {transaction.name}
                          </h5>
                          <div className="grid gap-50 text-end">
                            <p className="text-preset-5-bold text-grey-900">
                              <span className="sr-only">Amount: </span>
                              {currency(transaction.amount)}
                            </p>
                            <p>
                              <span className="sr-only">Date: </span>
                              {date(transaction.date)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </article>
              </article>
            );
          })}
        </div>
      </div>
    </article>
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
