import { type Metadata } from "next";
import Link from "next/link";
import { db } from "~/server/db";
import IconCaretRight from "~/app/_assets/icon-caret-right.svg";
import IconPot from "~/app/_assets/icon-pot.svg";
import { type ComponentPropsWithRef } from "react";
import { cx } from "class-variance-authority";
import Image from "next/image";

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
        <div className="grow basis-0 rounded-xl bg-grey-900 p-250 text-white tablet:p-300">
          <h3>Current Balance</h3>
          <p className="mt-150 text-preset-1">{balance?.current}</p>
        </div>
        <div className="grow basis-0 rounded-xl bg-white p-250 tablet:p-300">
          <h3 className="text-grey-500">Income</h3>
          <p className="mt-150 text-preset-1">{balance?.income}</p>
        </div>
        <div className="grow basis-0 rounded-xl bg-white p-250 tablet:p-300">
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
          <CardContent className="mt-250 grid gap-250 tablet:grid-cols-[247fr_277fr]">
            <div className="grid grid-cols-[auto_1fr] items-center gap-200 rounded-xl bg-beige-100 px-200 py-250 text-grey-900">
              <div className="grid size-500 place-items-center">
                <IconPot />
              </div>
              <div>
                <h3 className="text-grey-500">Total Saved</h3>
                <p className="text-preset-1">{"todo"}</p>
              </div>
            </div>
            <h3 className="sr-only">Per Pot</h3>
            <ul className="grid grid-cols-2 gap-200 py-50" role="list">
              {pots.map((pot) => {
                return (
                  <LegendItem key={pot.id} color={pot.theme.color}>
                    <LegendName>{pot.name}</LegendName>
                    <LegendValue>{pot.total}</LegendValue>
                  </LegendItem>
                );
              })}
            </ul>
          </CardContent>
        </Card>
        <Card className="desktop:col-start-1 desktop:row-span-2 desktop:row-start-2">
          <CardHeader>
            <CardHeading>Transactions</CardHeading>
            <p>
              <CardLink href={"/transactions"}>View All</CardLink>
            </p>
          </CardHeader>
          <CardContent>
            <ul
              className="mt-400 [&>*+*]:mt-250 [&>*+*]:border-t-[0.0625rem] [&>*+*]:border-grey-100 [&>*+*]:pt-250"
              role="list"
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
                          transaction.amount > 0
                            ? "text-green"
                            : "text-grey-900",
                        )}
                      >
                        <span className="sr-only">Amount: </span>
                        <strong>{transaction.amount}</strong>
                      </p>
                      <p className="mt-100 text-preset-5">
                        <span className="sr-only">Date: </span>
                        {transaction.date.toUTCString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
        <Card className="desktop:row-span-2 desktop:row-start-1">
          <CardHeader>
            <CardHeading>Budgets</CardHeading>
            <p>
              <CardLink href={"/budgets"}>See Details</CardLink>
            </p>
          </CardHeader>
          <CardContent className="mt-250 grid">
            <div className="grid items-center gap-200 tablet:grid-cols-[1fr_auto]">
              <h3 className="sr-only">Total</h3>
              <div
                className="mx-auto grid aspect-square w-full max-w-[15rem] place-items-center rounded-full"
                style={{
                  background: `conic-gradient(${
                    [
                      { color: "blue", percent: 0.77 },
                      { color: "yellow", percent: 0.08 },
                      { color: "grey", percent: 0.1 },
                    ].reduce(
                      (last, current) => {
                        const end = last.end + current.percent;
                        return {
                          end,
                          string: `${last.string}, ${current.color} ${last.end}turn, ${current.color} ${end}turn`,
                        };
                      },
                      { end: 0.05, string: "green 0.05turn" },
                    ).string
                  })`,
                }}
              >
                <div className="grid size-[67.5%] items-center rounded-full bg-white text-center text-preset-5 text-grey-500 shadow-[0_0_0_0.8125rem_hsl(0_0%_100%/0.25)]">
                  <p>
                    <strong className="block text-preset-1 text-grey-900">
                      todo
                    </strong>{" "}
                    of todo
                  </p>
                </div>
              </div>
              <h3 className="sr-only">Per Budget</h3>
              <ul
                className="grid grid-cols-2 gap-200 tablet:grid-cols-none"
                role="list"
              >
                {budgets.map((budget) => {
                  return (
                    <LegendItem key={budget.id} color={budget.theme.color}>
                      <LegendName>{budget.category.name}</LegendName>
                      <LegendValue>{"todo"}</LegendValue>
                    </LegendItem>
                  );
                })}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardHeading>Recurring Bills</CardHeading>
            <p>
              <CardLink href={"/recurring-bills"}>See Details</CardLink>
            </p>
          </CardHeader>
          <CardContent className="mt-400 grid gap-150">
            <div className="grid grid-cols-[1fr_auto] rounded-lg border-l-[0.25rem] border-green bg-beige-100 py-250 pl-150 pr-200 text-grey-500">
              <h3>Paid Bills</h3>
              <p className="text-preset-4-bold text-grey-900">190</p>
            </div>
            <div className="grid grid-cols-[1fr_auto] rounded-lg border-l-[0.25rem] border-yellow bg-beige-100 py-250 pl-150 pr-200 text-grey-500">
              <h3>Total Upcoming</h3>
              <p className="text-preset-4-bold text-grey-900">194.98</p>
            </div>
            <div className="grid grid-cols-[1fr_auto] rounded-lg border-l-[0.25rem] border-cyan bg-beige-100 py-250 pl-150 pr-200 text-grey-500">
              <h3>Due Soon</h3>
              <p className="text-preset-4-bold text-grey-900">59.98</p>
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
        "grid grid-rows-[auto_1fr] rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400",
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
        <IconCaretRight />
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
      className={cx(className, "grid grid-cols-[auto_1fr] gap-200")}
    >
      <div
        className="rounded-full border-l-[0.25rem]"
        style={{ borderColor: color }}
      />
      <div>{children}</div>
    </li>
  );
};

type LegendNameProps = ComponentPropsWithRef<"h4">;

const LegendName = ({ className, ...props }: LegendNameProps) => {
  return <h4 {...props} className={cx(className, "text-preset-5")} />;
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

export default OverviewPage;
