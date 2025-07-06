import { type Metadata } from "next";
import Link from "next/link";
import { nowDate } from "~/app/_now";
import * as Donut from "~/app/_components/ui/donut";
import { currency } from "~/app/_format";
import Button from "~/app/_components/ui/button";
import { clamp, sum } from "~/app/_math";
import { getBudgetsWithTransactions } from "~/server/budget";
import { getSumByCategoryForMonth } from "~/server/transaction";
import { Budget } from "~/app/(main)/budgets/_components/budget";

export const metadata: Metadata = {
  title: "Budgets",
};

const BudgetsPage = async () => {
  const budgets = await getBudgetsWithTransactions();
  const sumByCategory = await getSumByCategoryForMonth(
    budgets.map((b) => b.category.id),
    nowDate,
  );

  const total = sum(Object.values(sumByCategory), (s) => s);
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
        <div className="grid items-center gap-400 rounded-xl bg-white px-250 pt-300 pb-200 text-grey-500 tablet:grid-cols-2 tablet:p-400 desktop:grid-cols-none forced-colors:border-[0.0625rem]">
          <h2 className="sr-only">Spending</h2>
          <div className="py-250">
            <Donut.Root
              data={budgets.map((budget) => {
                return {
                  color: budget.theme.color,
                  percent: clamp(
                    0,
                    1,
                    total === 0
                      ? 0
                      : (sumByCategory[budget.category.id] ?? 0) / total,
                  ),
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
              className="mt-300 space-y-200 divide-y-[0.0625rem] divide-grey-100 add-space-y-200"
              role="list"
            >
              {budgets.map((budget) => {
                const sum = sumByCategory[budget.category.id] ?? 0;

                return (
                  <li className="flex gap-200" key={budget.id}>
                    <div
                      className="w-50 rounded-full forced-color-adjust-none"
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
            const sum = sumByCategory[budget.category.id] ?? 0;

            return <Budget key={budget.id} budget={budget} spent={-1 * sum} />;
          })}
        </div>
      </div>
    </article>
  );
};

export default BudgetsPage;
