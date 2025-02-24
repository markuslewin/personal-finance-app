import { type Metadata } from "next";
import Link from "next/link";
import { nowDate } from "~/app/_now";
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
import { useId } from "react";
import { clamp, sum } from "~/app/_math";

export const metadata: Metadata = {
  title: "Budgets",
};

const BudgetsPage = async () => {
  const budgets = await db.budget.findMany({
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
  const categorySums = await db.transaction.groupBy({
    by: "categoryId",
    _sum: {
      amount: true,
    },
    where: {
      AND: [
        {
          categoryId: {
            in: budgets.map((b) => b.category.id),
          },
        },
        {
          date: {
            gte: new Date(Date.UTC(nowDate.getFullYear(), nowDate.getMonth())),
          },
        },
        {
          date: {
            lt: new Date(
              Date.UTC(nowDate.getFullYear(), nowDate.getMonth() + 1),
            ),
          },
        },
      ],
    },
  });

  const getSum = (categoryId: string) => {
    return (
      categorySums.find((t) => t.categoryId === categoryId)?._sum.amount ?? 0
    );
  };

  const total = sum(categorySums, (s) => s._sum.amount ?? 0);
  const limit = sum(budgets, (b) => b.maximum);

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
              data={budgets.map((budget) => {
                return {
                  color: budget.theme.color,
                  percent: clamp(0, 1, getSum(budget.category.id) / total),
                };
              })}
            >
              <Donut.Hole>
                <p>
                  <strong className="block text-preset-1 text-grey-900">
                    {currency(-1 * total, {
                      trailingZeroDisplay: "stripIfInteger",
                    })}
                  </strong>{" "}
                  of{" "}
                  {currency(limit, { trailingZeroDisplay: "stripIfInteger" })}{" "}
                  limit
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
                const sum = getSum(budget.category.id);

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
                      <p className="flex items-center gap-100">
                        <strong className="text-preset-3 text-grey-900">
                          {currency(-1 * sum)}
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
            const sum = getSum(budget.category.id);

            return <Budget key={budget.id} budget={budget} spent={-1 * sum} />;
          })}
        </div>
      </div>
    </article>
  );
};

type BudgetProps = {
  budget: {
    id: string;
    maximum: number;
    category: {
      name: string;
      Transaction: {
        id: string;
        name: string;
        avatar: string;
        amount: number;
        date: Date;
      }[];
    };
    theme: {
      color: string;
    };
  };
  spent: number;
};

const Budget = ({ budget, spent }: BudgetProps) => {
  const meterLabelId = useId();

  const free = Math.max(0, budget.maximum - spent);

  return (
    <article className="rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400">
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-200">
        <div
          className="size-200 rounded-full"
          style={{ background: budget.theme.color }}
        />
        <h3 className="text-preset-2 text-grey-900">{budget.category.name}</h3>
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
        <span className="sr-only" id={meterLabelId}>
          Amount spent
        </span>
        <Meter.Root
          className="grid h-400 rounded bg-beige-100 p-50"
          min={0}
          max={budget.maximum}
          value={spent}
          aria-labelledby={meterLabelId}
        >
          <Meter.Indicator
            className="rounded"
            style={{
              background: budget.theme.color,
              width: `${clamp(0, 100, (spent / budget.maximum) * 100)}%`,
            }}
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
              {currency(spent)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-200">
          <div className="w-50 rounded-full bg-beige-100" />
          <div className="grid gap-50">
            <h4>Free</h4>
            <p className="text-preset-4-bold text-grey-900">{currency(free)}</p>
          </div>
        </div>
      </div>
      <article className="mt-250 rounded-xl bg-beige-100 p-200 text-grey-500 tablet:p-250">
        <header className="flex flex-wrap justify-between">
          <h4 className="text-preset-3 text-grey-900">Latest Spending</h4>
          <Link
            className="grid grid-cols-[1fr_auto] items-center gap-150 transition-colors hocus:text-grey-900"
            href={`/transactions?category=${encodeURIComponent(budget.category.name)}`}
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
};

export default BudgetsPage;
