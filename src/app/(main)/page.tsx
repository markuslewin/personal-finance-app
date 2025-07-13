import { type Metadata } from "next";
import Link from "next/link";
import IconCaretRight from "~/app/_assets/icon-caret-right.svg";
import IconPot from "~/app/_assets/icon-pot.svg";
import { useId, type ComponentPropsWithRef } from "react";
import { cx } from "class-variance-authority";
import Image from "next/image";
import * as Donut from "~/app/_components/ui/donut";
import { currency, date } from "~/app/_format";
import { nowDate } from "~/app/_now";
import { clamp, sum } from "~/app/_math";
import {
  getIsDueSoon,
  getIsPaid,
} from "~/app/(main)/recurring-bills/_utils/bills";
import { getBudgets } from "~/server/budget";
import { getPots } from "~/server/pot";
import { getTransactions, getTransactionsForMonth } from "~/server/transaction";
import { getBalance } from "~/server/balance";
import { getRecurringBills } from "~/server/recurring-bill";

export const metadata: Metadata = {
  title: "Overview",
};

const OverviewPage = async () => {
  const [
    balance,
    pots,
    transactions,
    transactionsThisMonth,
    budgets,
    recurringBills,
  ] = await Promise.all([
    getBalance(),
    getPots(),
    getTransactions({
      take: 5,
    }),
    getTransactionsForMonth(nowDate),
    getBudgets(),
    getRecurringBills(),
  ]);

  // Intro
  const income = sum(
    transactionsThisMonth.filter((t) => t.amount > 0),
    (t) => t.amount,
  );
  const expenses = sum(
    transactionsThisMonth.filter((t) => t.amount < 0),
    (t) => t.amount,
  );

  // Pots
  const totalSaved = sum(pots, (p) => p.total);

  // Budgets
  const totalByBudgetId = transactionsThisMonth.reduce(
    (acc, transaction) => {
      if (transaction.category.budget === null) {
        return acc;
      }

      const budgetId = transaction.category.budget.id;
      const budgetTotal = acc[budgetId] ?? 0;

      return { ...acc, [budgetId]: budgetTotal + transaction.amount };
    },
    {} as Record<string, number>,
  );
  const budgetsWithSpent = budgets.map((budget) => {
    return { ...budget, spent: totalByBudgetId[budget.id] ?? 0 };
  });
  const budgetsTotal = sum(Object.values(totalByBudgetId), (n) => n);
  const budgetsLimit = sum(budgets, (b) => b.maximum);

  // Recurring bills
  const currentDate = nowDate.getUTCDate();
  const totalPaid = sum(
    recurringBills.filter((bill) => getIsPaid(currentDate, bill)),
    (b) => b.amount,
  );
  const totalUpcoming = sum(
    recurringBills.filter((bill) => !getIsPaid(currentDate, bill)),
    (b) => b.amount,
  );
  const totalDueSoon = sum(
    recurringBills.filter((bill) => getIsDueSoon(currentDate, bill)),
    (b) => b.amount,
  );

  return (
    <>
      <h1 className="text-preset-1">Overview</h1>
      <h2 className="sr-only">Balance</h2>
      <div className="mt-400 the-grid-[15rem] gap-150 tablet:mt-[2.625rem] tablet:flex-row tablet:flex-wrap tablet:gap-300">
        <div className="rounded-xl bg-grey-900 p-250 text-white tablet:p-300 forced-colors:border-[0.0625rem]">
          <h3>Current Balance</h3>
          <p className="mt-150 text-preset-1" data-testid="current-balance">
            {currency(balance.current)}
          </p>
        </div>
        <div className="rounded-xl bg-white p-250 tablet:p-300 forced-colors:border-[0.0625rem]">
          <h3 className="text-grey-500">Income</h3>
          <p className="mt-150 text-preset-1" data-testid="income">
            {currency(income)}
          </p>
        </div>
        <div className="rounded-xl bg-white p-250 tablet:p-300 forced-colors:border-[0.0625rem]">
          <h3 className="text-grey-500">Expenses</h3>
          <p className="mt-150 text-preset-1" data-testid="expenses">
            {currency(Math.abs(expenses))}
          </p>
        </div>
      </div>
      <div className="mt-400 grid gap-200 tablet:gap-300 desktop:grid-cols-[608fr_428fr] desktop:grid-rows-[auto_1fr_auto]">
        <PotsCard totalSaved={totalSaved} pots={pots} />
        <TransactionsCard transactions={transactions} />
        <BudgetsCard
          total={budgetsTotal}
          limit={budgetsLimit}
          budgets={budgetsWithSpent}
        />
        <Card>
          <CardHeader>
            <CardHeading>Recurring Bills</CardHeading>
            <p>
              <CardLink href={"/recurring-bills"}>See Details</CardLink>
            </p>
          </CardHeader>
          <CardContent className="mt-400 grid gap-150">
            <div className="grid grid-cols-[1fr_auto] rounded-lg border-l-[0.25rem] border-green bg-beige-100 py-250 pr-200 pl-150 text-grey-500 forced-colors:border-[0.0625rem] forced-colors:border-l-[0.25rem]">
              <h3>Paid Bills</h3>
              <p
                className="text-preset-4-bold text-grey-900"
                data-testid="paid-bills"
              >
                {currency(totalPaid)}
              </p>
            </div>
            <div className="grid grid-cols-[1fr_auto] rounded-lg border-l-[0.25rem] border-yellow bg-beige-100 py-250 pr-200 pl-150 text-grey-500 forced-colors:border-[0.0625rem] forced-colors:border-l-[0.25rem]">
              <h3>Total Upcoming</h3>
              <p
                className="text-preset-4-bold text-grey-900"
                data-testid="total-upcoming"
              >
                {currency(totalUpcoming)}
              </p>
            </div>
            <div className="grid grid-cols-[1fr_auto] rounded-lg border-l-[0.25rem] border-cyan bg-beige-100 py-250 pr-200 pl-150 text-grey-500 forced-colors:border-[0.0625rem] forced-colors:border-l-[0.25rem]">
              <h3>Due Soon</h3>
              <p
                className="text-preset-4-bold text-grey-900"
                data-testid="due-soon"
              >
                {currency(totalDueSoon)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

type CardProps = ComponentPropsWithRef<"article">;

const Card = ({ className, ...props }: CardProps) => {
  return (
    <article
      {...props}
      className={cx(
        className,
        "grid grid-rows-[auto_1fr] rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400 forced-colors:border-[0.0625rem]",
      )}
    />
  );
};

type CardHeaderProps = ComponentPropsWithRef<"header">;

const CardHeader = ({ className, ...props }: CardHeaderProps) => {
  return (
    <header
      {...props}
      className={cx(className, "flex flex-wrap items-center justify-between")}
    />
  );
};

type CardContentProps = ComponentPropsWithRef<"div">;

const CardContent = ({ className, ...props }: CardContentProps) => {
  return <div {...props} className={cx(className, "")} />;
};

type CardHeadingProps = ComponentPropsWithRef<"h2">;

const CardHeading = ({ className, ...props }: CardHeadingProps) => {
  return (
    <h2 {...props} className={cx(className, "text-preset-2 text-grey-900")} />
  );
};

type CardLinkProps = ComponentPropsWithRef<typeof Link>;

const CardLink = ({ className, children, ...props }: CardLinkProps) => {
  return (
    <Link
      {...props}
      className={cx(
        className,
        "inline-grid grid-cols-[1fr_auto] items-center gap-150 transition-colors hocus:text-grey-900",
      )}
    >
      {children}
      <span className="grid size-150 place-items-center">
        <IconCaretRight className="h-[0.6875rem]" />
      </span>
    </Link>
  );
};

type LegendItemProps = ComponentPropsWithRef<"li"> & { color: string };

const LegendItem = ({
  className,
  children,
  color,
  ...props
}: LegendItemProps) => {
  return (
    <li
      {...props}
      className={cx(className, "grid grid-cols-[auto_minmax(0,1fr)] gap-200")}
    >
      <div
        className="rounded-full border-l-[0.25rem] forced-color-adjust-none"
        style={{ borderColor: color }}
      />
      <div>{children}</div>
    </li>
  );
};

type LegendNameProps = ComponentPropsWithRef<"h4">;

const LegendName = ({ className, ...props }: LegendNameProps) => {
  return <h4 {...props} className={cx(className, "truncate text-preset-5")} />;
};

type LegendValueProps = ComponentPropsWithRef<"p">;

const LegendValue = ({ className, ...props }: LegendValueProps) => {
  return (
    <p
      {...props}
      className={cx(className, "text-preset-4-bold text-grey-900")}
    />
  );
};

type PotsCardProps = {
  totalSaved: number;
  pots: {
    id: string;
    name: string;
    total: number;
    theme: { color: string };
  }[];
};

const PotsCard = ({ totalSaved, pots }: PotsCardProps) => {
  const headingId = useId();

  return (
    <Card>
      <CardHeader>
        <CardHeading id={headingId}>Pots</CardHeading>
        <p>
          <CardLink href={"/pots"}>See Details</CardLink>
        </p>
      </CardHeader>
      <CardContent className="mt-250 flex flex-wrap gap-250">
        <div className="grid grow basis-[15.4375rem] grid-cols-[auto_1fr] items-center gap-200 rounded-xl bg-beige-100 px-200 py-250 text-grey-900 forced-colors:border-[0.0625rem]">
          <div className="grid size-500 place-items-center text-green">
            <IconPot className="h-[2.25rem]" />
          </div>
          <div>
            <h3 className="text-grey-500">Total Saved</h3>
            <p className="text-preset-1">
              {currency(totalSaved, {
                trailingZeroDisplay: "stripIfInteger",
              })}
            </p>
          </div>
        </div>
        <h3 className="sr-only">Per Pot</h3>
        <ul
          className="grid grow basis-[17.3125rem] grid-cols-2 gap-200 py-50"
          role="list"
          aria-labelledby={headingId}
        >
          {pots.map((pot) => {
            return (
              <LegendItem key={pot.id} color={pot.theme.color}>
                <LegendName>{pot.name}</LegendName>
                <LegendValue>
                  {currency(pot.total, {
                    trailingZeroDisplay: "stripIfInteger",
                  })}
                </LegendValue>
              </LegendItem>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

type TransactionsCardProps = {
  transactions: {
    id: string;
    avatar: string;
    name: string;
    amount: number;
    date: Date;
  }[];
};

const TransactionsCard = ({ transactions }: TransactionsCardProps) => {
  const headingId = useId();

  return (
    <Card className="desktop:col-start-1 desktop:row-span-2 desktop:row-start-2">
      <CardHeader>
        <CardHeading id={headingId}>Transactions</CardHeading>
        <p>
          <CardLink href={"/transactions"}>View All</CardLink>
        </p>
      </CardHeader>
      <CardContent>
        <ul
          className="mt-400 space-y-250 divide-y-[0.0625rem] divide-grey-100 add-space-y-250"
          role="list"
          aria-labelledby={headingId}
        >
          {transactions.map((transaction) => {
            return (
              <li
                className="grid grid-cols-[auto_1fr_auto] items-center gap-200"
                key={transaction.id}
              >
                <Image
                  className="size-400 rounded-full object-cover tablet:size-500"
                  alt=""
                  src={transaction.avatar}
                  width={160}
                  height={160}
                />
                <h3 className="text-preset-4-bold text-grey-900">
                  {transaction.name}
                </h3>
                <div className="text-end">
                  <p
                    className={cx(
                      "text-preset-4-bold",
                      transaction.amount > 0 ? "text-green" : "text-grey-900",
                    )}
                  >
                    <span className="sr-only">Amount: </span>
                    <strong>
                      {currency(transaction.amount, {
                        signDisplay: "always",
                      })}
                    </strong>
                  </p>
                  <p className="mt-100 text-preset-5">
                    <span className="sr-only">Date: </span>
                    {date(transaction.date)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

type BudgetsCardProps = {
  total: number;
  limit: number;
  budgets: {
    id: string;
    spent: number;
    category: {
      name: string;
    };
    theme: {
      color: string;
    };
  }[];
};

const BudgetsCard = ({ total, limit, budgets }: BudgetsCardProps) => {
  const headingId = useId();

  return (
    <Card className="desktop:row-span-2 desktop:row-start-1">
      <CardHeader>
        <CardHeading id={headingId}>Budgets</CardHeading>
        <p>
          <CardLink href={"/budgets"}>See Details</CardLink>
        </p>
      </CardHeader>
      <CardContent className="mt-250 grid items-center">
        <div className="flex flex-wrap items-center gap-200">
          <h3 className="sr-only">Total</h3>
          <div className="grow-[999]">
            <Donut.Root
              data={budgets.map((budget) => {
                return {
                  color: budget.theme.color,
                  percent: clamp(0, 1, budget.spent / total),
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
                  {currency(limit, {
                    trailingZeroDisplay: "stripIfInteger",
                  })}{" "}
                  limit
                </p>
              </Donut.Hole>
            </Donut.Root>
          </div>
          <h3 className="sr-only">Per Budget</h3>
          <ul
            className="the-grid-[7rem] grow gap-200"
            role="list"
            aria-labelledby={headingId}
          >
            {budgets.map((budget) => {
              return (
                <LegendItem key={budget.id} color={budget.theme.color}>
                  <LegendName>{budget.category.name}</LegendName>
                  <LegendValue>{currency(-1 * budget.spent)}</LegendValue>
                </LegendItem>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewPage;
