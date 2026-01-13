import { type Metadata } from "next";
import IconRecurringBills from "~/app/_assets/icon-recurring-bills.svg";
import { type ComponentPropsWithRef, useId } from "react";
import { cx } from "class-variance-authority";
import Image from "next/image";
import IconBillDue from "~/app/_assets/icon-bill-due.svg";
import IconBillPaid from "~/app/_assets/icon-bill-paid.svg";
import { nowDate } from "~/app/_now";
import { sum } from "~/app/_math";
import {
  getIsDueSoon,
  getIsPaid,
} from "~/app/(main)/recurring-bills/_utils/bills";
import * as z from "zod";
import { type SortingOption, sortingOptions } from "~/app/_sort";
import { BillsSearchForm } from "~/app/(main)/recurring-bills/_components/bills-search-form";
import { getRecurringBills } from "~/server/recurring-bill";
import { formatCents } from "~/app/_currency";

export const metadata: Metadata = {
  title: "Recurring bills",
};

const date = nowDate.getUTCDate();

const DEFAULT_SORTING: SortingOption = "Oldest";

type Bill = {
  name: string;
  amount: number;
  day: number;
};

const getSortFn = (option: SortingOption): ((a: Bill, b: Bill) => number) => {
  switch (option) {
    case "A to Z":
      return (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    case "Highest":
      return (a, b) => b.amount - a.amount;
    case "Latest":
      return (a, b) => b.day - a.day;
    case "Lowest":
      return (a, b) => a.amount - b.amount;
    case "Oldest":
      return (a, b) => a.day - b.day;
    case "Z to A":
      return (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1);
  }
};

const RecurringBillsPage = async ({
  searchParams,
}: PageProps<"/recurring-bills">) => {
  const { name, sort } = z
    .object({
      name: z.optional(z.string()).catch(undefined),
      sort: z.optional(z.enum(sortingOptions)).catch(undefined),
    })
    .parse(await searchParams);

  const allRecurringBills = await getRecurringBills();

  const total = sum(allRecurringBills, (b) => b.amount);
  const billByDueType = Object.groupBy(allRecurringBills, (bill) =>
    getIsPaid(date, bill) ? "paid" : "upcoming",
  );
  const billsDueSoon =
    billByDueType.upcoming?.filter((b) => getIsDueSoon(date, b)) ?? [];

  const recurringBills = (
    name === undefined
      ? [...allRecurringBills]
      : allRecurringBills.filter((b) =>
          b.name.toLowerCase().includes(name.toLowerCase()),
        )
  ).sort(getSortFn(sort ?? DEFAULT_SORTING));

  return (
    <>
      <h1 className="text-preset-1">Recurring Bills</h1>
      <div className="mt-500 grid gap-300 desktop:grid-cols-[337fr_699fr] desktop:items-start">
        <div className="grid gap-150 tablet:grid-cols-2 tablet:gap-300 desktop:grid-cols-none">
          <div className="grid grid-cols-[auto_1fr] items-center gap-250 rounded-xl bg-grey-900 px-250 py-300 text-white tablet:grid-cols-none tablet:gap-400 tablet:px-300 forced-colors:border-[0.0625rem]">
            <div className="grid size-500 place-items-center">
              <IconRecurringBills className="h-[1.75rem]" />
            </div>
            <div className="grid gap-150">
              <h2>Total Bills</h2>
              <p className="text-preset-1">{formatCents(total)}</p>
            </div>
          </div>
          <div className="rounded-xl bg-white p-250 text-grey-500 forced-colors:border-[0.0625rem]">
            <h2 className="text-preset-3 text-grey-900">Summary</h2>
            <div className="mt-250 space-y-200 divide-y-[0.0625rem] divide-grey-500/15 text-preset-5 add-space-y-200">
              <div className="flex flex-wrap items-center justify-between">
                <h3>Paid Bills</h3>
                <p className="text-end text-preset-5-bold text-grey-900">
                  {billByDueType.paid?.length ?? 0} (
                  {formatCents(sum(billByDueType.paid ?? [], (b) => b.amount))})
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between">
                <h3>Total Upcoming</h3>
                <p className="text-end text-preset-5-bold text-grey-900">
                  {billByDueType.upcoming?.length ?? 0} (
                  {formatCents(
                    sum(billByDueType.upcoming ?? [], (b) => b.amount),
                  )}
                  )
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between text-red">
                <h3>Due Soon</h3>
                <p className="text-end text-preset-5-bold">
                  {billsDueSoon.length} (
                  {formatCents(sum(billsDueSoon, (b) => b.amount))})
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400 forced-colors:border-[0.0625rem]">
          <h2 className="sr-only">Bills</h2>
          <header>
            <h3 className="sr-only">Search</h3>
            <BillsSearchForm defaultSort={DEFAULT_SORTING} />
          </header>
          <SearchResultsSection>
            {/* Duplicate HTML to match the design */}
            {/* A list on mobile turns into a table on tablet */}
            <ul
              className={cx(
                "space-y-200 divide-y-[0.0625rem] divide-grey-100 add-space-y-200 tablet:hidden",
                recurringBills.length ? "mt-300" : null,
              )}
              role="list"
            >
              {recurringBills.map((bill) => {
                const isPaid = getIsPaid(date, bill);
                const isDueSoon = getIsDueSoon(date, bill);

                return (
                  <li className="grid gap-100" key={bill.id} data-testid="bill">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-200">
                      <Image
                        className="size-400 rounded-full object-cover"
                        alt=""
                        src={bill.avatar}
                        width={160}
                        height={160}
                      />
                      <h4
                        className="text-preset-4-bold text-grey-900"
                        data-testid="name"
                      >
                        {bill.name}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center justify-between">
                      <p
                        className={cx(
                          "flex flex-wrap items-center gap-100 text-preset-5",
                          isPaid ? "text-green" : null,
                        )}
                      >
                        <span className="sr-only">Due Date: </span>
                        Monthly-{bill.day}
                        {isPaid ? (
                          <span>
                            <IconBillPaid className="h-[0.875rem]" />
                            <span className="sr-only">(Paid)</span>
                          </span>
                        ) : isDueSoon ? (
                          <span className="text-red">
                            <IconBillDue className="h-[0.875rem]" />
                            <span className="sr-only">(Due soon)</span>
                          </span>
                        ) : null}
                      </p>
                      <p
                        className={cx(
                          "text-end text-preset-4-bold text-grey-900",
                          isDueSoon ? "text-red" : null,
                        )}
                      >
                        <span className="sr-only">Amount: </span>
                        <span data-testid="amount">
                          {formatCents(bill.amount)}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <table className="mt-300 hidden w-full tablet:table">
              <thead className="border-b-[0.0625rem] border-grey-100">
                <tr>
                  <th className="pt-150 pb-[0.6875rem] text-start text-preset-5 desktop:px-200">
                    Bill Title
                  </th>
                  <th className="pt-150 pb-[0.6875rem] text-start text-preset-5 desktop:px-200">
                    Due Date
                  </th>
                  <th className="pt-150 pb-[0.6875rem] text-end text-preset-5 desktop:px-200">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="mt-100 divide-y-[0.0625rem] divide-grey-100">
                {recurringBills.map((bill) => {
                  const isPaid = getIsPaid(date, bill);
                  const isDueSoon = getIsDueSoon(date, bill);

                  return (
                    <tr className="group" key={bill.id} data-testid="bill">
                      <td className="py-250 group-last:pb-0 desktop:px-200">
                        <div className="grid grid-cols-[auto_1fr] items-center gap-200">
                          <Image
                            className="size-400 rounded-full object-cover"
                            alt=""
                            src={bill.avatar}
                            width={160}
                            height={160}
                          />
                          <p
                            className="text-preset-4-bold text-grey-900"
                            data-testid="name"
                          >
                            {bill.name}
                          </p>
                        </div>
                      </td>
                      <td
                        className={cx(
                          "py-250 text-preset-5 group-last:pb-0 desktop:px-200",
                          isPaid ? "text-green" : null,
                        )}
                      >
                        <span className="flex flex-wrap items-center gap-100">
                          Monthly-{bill.day}
                          {isPaid ? (
                            <span>
                              <IconBillPaid className="h-[0.875rem]" />
                              <span className="sr-only">(Paid)</span>
                            </span>
                          ) : isDueSoon ? (
                            <span className="text-red">
                              <IconBillDue className="h-[0.875rem]" />
                              <span className="sr-only">(Due soon)</span>
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td
                        className={cx(
                          "py-250 text-end text-preset-4-bold text-grey-900 group-last:pb-0 desktop:px-200",
                          isDueSoon ? "text-red" : null,
                        )}
                        data-testid="amount"
                      >
                        {formatCents(bill.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </SearchResultsSection>
        </div>
      </div>
    </>
  );
};

type SearchResultsSectionProps = ComponentPropsWithRef<"section">;

const SearchResultsSection = ({
  className,
  children,
  ...props
}: SearchResultsSectionProps) => {
  const labelId = useId();

  return (
    <section aria-labelledby={labelId} {...props} className={cx(className, "")}>
      <h3 className="sr-only" id={labelId}>
        Search results
      </h3>
      {children}
    </section>
  );
};

export default RecurringBillsPage;
