import { type Metadata } from "next";
import Link from "next/link";
import { db } from "~/server/db";
import IconCaretRight from "~/app/_assets/icon-caret-right.svg";
import IconPot from "~/app/_assets/icon-pot.svg";
import { type ComponentPropsWithRef } from "react";
import { cx } from "class-variance-authority";

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
      <h2 className="sr-only">Balance</h2>
      <div className="mt-400 flex flex-col gap-150 tablet:mt-[2.625rem] tablet:flex-row tablet:flex-wrap tablet:gap-300">
        <div className="basis-0 grow rounded-xl bg-grey-900 p-250 text-white tablet:p-300">
          <h3>Current Balance</h3>
          <p className="mt-150 text-preset-1">{balance?.current}</p>
        </div>
        <div className="basis-0 grow rounded-xl bg-white p-250 tablet:p-300">
          <h3 className="text-grey-500">Income</h3>
          <p className="mt-150 text-preset-1">{balance?.income}</p>
        </div>
        <div className="basis-0 grow rounded-xl bg-white p-250 tablet:p-300">
          <h3 className="text-grey-500">Expenses</h3>
          <p className="mt-150 text-preset-1">{balance?.expenses}</p>
        </div>
      </div>
      <div className="mt-400 grid gap-200 tablet:gap-300 desktop:grid-cols-[608fr_428fr] desktop:grid-rows-[auto_1fr_auto]">
        <Card>
          <CardHeader>
            <CardHeading>Pots</CardHeading>
            <p>
              {/* todo: Details of `pot` */}
              <CardLink href={"#"}>See Details</CardLink>
            </p>
          </CardHeader>
          <div className="mt-250 grid gap-250 tablet:grid-cols-[247fr_277fr]">
            <div className="grid grid-cols-[auto_1fr] items-center gap-200 rounded-xl bg-beige-100 px-200 py-250 text-grey-900">
              <div className="grid size-500 place-items-center">
                <IconPot />
              </div>
              <div>
                <h3 className="text-grey-500">Total Saved</h3>
                <p className="text-preset-1">{"todo"}</p>
              </div>
            </div>
            <h3 className="sr-only">Saved by Pot</h3>
            <ul className="grid grid-cols-2 gap-200 py-50" role="list">
              {pots.map((pot) => {
                return (
                  <li
                    className="grid grid-cols-[auto_1fr] gap-200"
                    key={pot.id}
                  >
                    <div
                      className="rounded-full border-l-[0.25rem]"
                      style={{ borderColor: pot.theme.color }}
                    />
                    <div>
                      <h4 className="text-preset-5">{pot.name}</h4>
                      <p className="text-preset-4-bold text-grey-900">
                        {pot.total}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>
        {/* <h2 className="text-preset-2">Transactions</h2> */}
        {/* <pre>{JSON.stringify(transactions, undefined, "\t")}</pre> */}
        <Card className="desktop:col-start-1 desktop:row-span-2 desktop:row-start-2">
          <CardHeader>
            <CardHeading>Transactions</CardHeading>
            <p>
              <CardLink href={"/transactions"}>View All</CardLink>
            </p>
          </CardHeader>
        </Card>
        {/* <h2 className="text-preset-2">Budgets</h2> */}
        {/* <pre>{JSON.stringify(budgets, undefined, "\t")}</pre> */}
        <Card className="desktop:row-span-2 desktop:row-start-1">
          <CardHeader>
            <CardHeading>Budgets</CardHeading>
            <p>
              <CardLink href={"/budgets"}>See Details</CardLink>
            </p>
          </CardHeader>
        </Card>
        {/* <h2 className="text-preset-2">Recurring Bills</h2> */}
        {/* <pre>{JSON.stringify(recurringBills, undefined, "\t")}</pre> */}
        <Card>
          <CardHeader>
            <CardHeading>Recurring Bills</CardHeading>
            <p>
              <CardLink href={"/recurring-bills"}>See Details</CardLink>
            </p>
          </CardHeader>
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
        "rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400",
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
        "hocus:text-grey-900 inline-grid grid-cols-[1fr_auto] items-center gap-150 transition-colors",
      )}
    >
      {children}
      <span className="grid size-150 place-items-center">
        <IconCaretRight />
      </span>
    </Link>
  );
};

export default OverviewPage;
