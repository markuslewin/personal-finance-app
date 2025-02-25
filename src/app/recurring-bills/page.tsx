import { type Metadata } from "next";
import { db } from "~/server/db";
import IconRecurringBills from "~/app/_assets/icon-recurring-bills.svg";
import { type ComponentPropsWithRef, useId } from "react";
import { cx } from "class-variance-authority";
import Image from "next/image";
import IconBillDue from "~/app/_assets/icon-bill-due.svg";
import IconBillPaid from "~/app/_assets/icon-bill-paid.svg";
import IconSearch from "~/app/_assets/icon-search.svg";
import IconSortMobile from "~/app/_assets/icon-sort-mobile.svg";
import { currency } from "~/app/_format";
import { nowDate } from "~/app/_now";
import { sum } from "~/app/_math";
import { getIsDueSoon, getIsPaid } from "~/app/recurring-bills/_utils/bills";

export const metadata: Metadata = {
  title: "Recurring bills",
};

const date = nowDate.getDate();

const RecurringBillsPage = async () => {
  const recurringBills = await db.recurringBill.findMany({
    select: {
      id: true,
      amount: true,
      avatar: true,
      day: true,
      name: true,
    },
    orderBy: {
      day: "asc",
    },
  });

  const total = sum(recurringBills, (b) => b.amount);

  const billByDueType = Object.groupBy(recurringBills, (bill) =>
    getIsPaid(date, bill) ? "paid" : "upcoming",
  );
  const billsDueSoon =
    billByDueType.upcoming?.filter((b) => getIsDueSoon(date, b)) ?? [];

  return (
    <>
      <h1 className="text-preset-1">Recurring Bills</h1>
      <div className="mt-500 grid gap-300 desktop:grid-cols-[337fr_699fr] desktop:items-start">
        <div className="grid gap-150 tablet:grid-cols-2 tablet:gap-300 desktop:grid-cols-none">
          <div className="grid grid-cols-[auto_1fr] items-center gap-250 rounded-xl bg-grey-900 px-250 py-300 text-white tablet:grid-cols-none tablet:gap-400 tablet:px-300">
            <div className="grid size-500 place-items-center">
              <IconRecurringBills />
            </div>
            <div className="grid gap-150">
              <h2>Total Bills</h2>
              <p className="text-preset-1">{currency(total)}</p>
            </div>
          </div>
          <div className="rounded-xl bg-white p-250 text-grey-500">
            <h2 className="text-preset-3 text-grey-900">Summary</h2>
            <div className="mt-250 text-preset-5 [&>*+*]:mt-200 [&>*+*]:border-t-[0.0625rem] [&>*+*]:border-grey-500/15 [&>*+*]:pt-200">
              <div className="flex flex-wrap items-center justify-between">
                <h3>Paid Bills</h3>
                <p className="text-end text-preset-5-bold text-grey-900">
                  {billByDueType.paid?.length ?? 0} (
                  {currency(sum(billByDueType.paid ?? [], (b) => b.amount))})
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between">
                <h3>Total Upcoming</h3>
                <p className="text-end text-preset-5-bold text-grey-900">
                  {billByDueType.upcoming?.length ?? 0} (
                  {currency(sum(billByDueType.upcoming ?? [], (b) => b.amount))}
                  )
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between text-red">
                <h3>Due Soon</h3>
                <p className="text-end text-preset-5-bold">
                  {billsDueSoon.length} (
                  {currency(sum(billsDueSoon, (b) => b.amount))})
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400 tablet:pb-150">
          <h2 className="sr-only">Bills</h2>
          <header>
            <h3 className="sr-only">Search</h3>
            <form className="flex flex-wrap items-center gap-300">
              <label className="grow">
                <span className="sr-only">Search: </span>
                <span className="relative text-grey-900">
                  <input
                    className="h-[2.8125rem] w-full max-w-[20rem] rounded-xl border-[0.0625rem] border-beige-500 pl-[1.1875rem] pr-[3.25rem] placeholder:text-beige-500"
                    type="text"
                    name="q"
                    placeholder="Search bills"
                  />
                  <span className="absolute inset-y-0 right-250 grid size-200 place-items-center">
                    <IconSearch />
                  </span>
                </span>
              </label>
              <label className="inline-flex items-center gap-100">
                <span className="sr-only tablet:not-sr-only">Sort by </span>
                <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
                  <IconSortMobile />
                </span>
                <select
                  className="hidden tablet:block"
                  name="sort"
                  defaultValue={"latest"}
                >
                  <option value={"latest"}>Latest</option>
                  <option value={"oldest"}>Oldest</option>
                  <option value={"a-to-z"}>A to Z</option>
                  <option value={"z-to-a"}>Z to A</option>
                  <option value={"highest"}>Highest</option>
                  <option value={"lowest"}>Lowest</option>
                </select>
              </label>
            </form>
          </header>
          <SearchResultsSection className="mt-300">
            {/* Duplicate HTML to match the design */}
            {/* A list on mobile turns into a table on tablet */}
            <ul
              className="tablet:hidden [&>*+*]:mt-200 [&>*+*]:border-t-[0.0625rem] [&>*+*]:border-grey-100 [&>*+*]:pt-200"
              role="list"
            >
              {recurringBills.map((bill) => {
                const isPaid = getIsPaid(date, bill);
                const isDueSoon = getIsDueSoon(date, bill);

                return (
                  <li className="grid gap-100" key={bill.id}>
                    <div className="grid grid-cols-[auto_1fr] items-center gap-200">
                      <Image
                        className="size-400 rounded-full object-cover"
                        alt=""
                        src={bill.avatar}
                        width={160}
                        height={160}
                      />
                      <h4 className="text-preset-4-bold text-grey-900">
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
                            <IconBillPaid />
                            <span className="sr-only">(Paid)</span>
                          </span>
                        ) : isDueSoon ? (
                          <span className="text-red">
                            <IconBillDue />
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
                        {currency(bill.amount)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <table className="hidden w-full tablet:table">
              <thead className="border-b-[0.0625rem] border-grey-100">
                <tr>
                  <th className="pb-[0.6875rem] pt-150 text-start text-preset-5 desktop:px-200">
                    Bill Title
                  </th>
                  <th className="pb-[0.6875rem] pt-150 text-start text-preset-5 desktop:px-200">
                    Due Date
                  </th>
                  <th className="pb-[0.6875rem] pt-150 text-end text-preset-5 desktop:px-200">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="mt-100 [&>*+*]:border-t-[0.0625rem] [&>*+*]:border-grey-100">
                {recurringBills.map((bill) => {
                  const isPaid = getIsPaid(date, bill);
                  const isDueSoon = getIsDueSoon(date, bill);

                  return (
                    <tr key={bill.id}>
                      <td className="py-250 desktop:px-200">
                        <div className="grid grid-cols-[auto_1fr] items-center gap-200">
                          <Image
                            className="size-400 rounded-full object-cover"
                            alt=""
                            src={bill.avatar}
                            width={160}
                            height={160}
                          />
                          <p className="text-preset-4-bold text-grey-900">
                            {bill.name}
                          </p>
                        </div>
                      </td>
                      <td
                        className={cx(
                          "py-200 text-preset-5 desktop:px-200",
                          isPaid ? "text-green" : null,
                        )}
                      >
                        <span className="flex flex-wrap items-center gap-100">
                          Monthly-{bill.day}
                          {isPaid ? (
                            <span>
                              <IconBillPaid />
                              <span className="sr-only">(Paid)</span>
                            </span>
                          ) : isDueSoon ? (
                            <span className="text-red">
                              <IconBillDue />
                              <span className="sr-only">(Due soon)</span>
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td
                        className={cx(
                          "py-200 text-end text-preset-4-bold text-grey-900 desktop:px-200",
                          isDueSoon ? "text-red" : null,
                        )}
                      >
                        {currency(bill.amount)}
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
