import { cx } from "class-variance-authority";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { now } from "~/app/_now";
import { db } from "~/server/db";
// import IconCaretDown from "~/app/_assets/icon-caret-down.svg";
import IconCaretLeft from "~/app/_assets/icon-caret-left.svg";
import IconCaretRight from "~/app/_assets/icon-caret-right.svg";
import IconFilterMobile from "~/app/_assets/icon-filter-mobile.svg";
import IconSearch from "~/app/_assets/icon-search.svg";
import IconSortMobile from "~/app/_assets/icon-sort-mobile.svg";
import { z } from "zod";
import { type ComponentPropsWithRef, useId } from "react";

const PAGE_SIZE = 10;

export const metadata: Metadata = {
  title: "Transactions",
};

const TransactionsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string | string[] | undefined }>;
}) => {
  const page = pageSchema.parse((await searchParams).page);
  const [categories, transactions] = await Promise.all([
    db.category.findMany(),
    db.transaction.findMany({
      select: {
        id: true,
        amount: true,
        avatar: true,
        date: true,
        name: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      where: {
        date: {
          lte: new Date(now),
        },
      },
      orderBy: {
        date: "desc",
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return (
    <>
      <h1 className="text-preset-1">Transactions</h1>
      <article className="mt-[2.5625rem] rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400">
        <header>
          <h2 className="sr-only">Search</h2>
          <form className="flex flex-wrap items-center gap-300">
            <label className="grow">
              <span className="sr-only">Search: </span>
              <span className="relative text-grey-900">
                <input
                  className="h-[2.8125rem] w-full max-w-[20rem] rounded-xl border-[0.0625rem] border-beige-500 pl-[1.1875rem] pr-[3.25rem] placeholder:text-beige-500"
                  type="text"
                  name="q"
                  placeholder="Search transaction"
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
            <label className="inline-flex items-center gap-100">
              <span className="sr-only tablet:not-sr-only">Category </span>
              <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
                <IconFilterMobile />
              </span>
              <select
                className="hidden tablet:block"
                name="category"
                defaultValue={"all-transactions"}
              >
                <option value={"all-transactions"}>All Transactions</option>
                {categories.map((category) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
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
            {transactions.map((transaction) => {
              return (
                <li
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-150"
                  key={transaction.id}
                >
                  <Image
                    className="size-400 rounded-full object-cover"
                    alt=""
                    src={transaction.avatar}
                    width={160}
                    height={160}
                  />
                  <div className="grid gap-50">
                    <h3 className="text-preset-4-bold text-grey-900">
                      {transaction.name}
                    </h3>
                    <p className="text-preset-5">
                      <span className="sr-only">Category: </span>
                      {transaction.category.name}
                    </p>
                  </div>
                  <div className="grid gap-50 text-end">
                    <p
                      className={cx(
                        "text-preset-4-bold",
                        transaction.amount > 0 ? "text-green" : "text-grey-900",
                      )}
                    >
                      <span className="sr-only">Amount: </span>
                      {transaction.amount}
                    </p>
                    <p className="text-preset-5">
                      <span className="sr-only">Date: </span>
                      {transaction.date.toUTCString()}
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
                  Recipient / Sender
                </th>
                <th className="pb-[0.6875rem] pt-150 text-start text-preset-5 desktop:px-200">
                  Category
                </th>
                <th className="pb-[0.6875rem] pt-150 text-start text-preset-5 desktop:px-200">
                  Transaction Date
                </th>
                <th className="pb-[0.6875rem] pt-150 text-end text-preset-5 desktop:px-200">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="mt-100 [&>*+*]:border-t-[0.0625rem] [&>*+*]:border-grey-100">
              {transactions.map((transaction) => {
                return (
                  <tr key={transaction.id}>
                    <td className="py-200 desktop:px-200">
                      <div className="grid grid-cols-[auto_1fr] items-center gap-200">
                        <Image
                          className="size-500 rounded-full object-cover"
                          alt=""
                          src={transaction.avatar}
                          width={160}
                          height={160}
                        />
                        <p className="text-preset-4-bold text-grey-900">
                          {transaction.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-200 text-preset-5 desktop:px-200">
                      {transaction.category.name}
                    </td>
                    <td className="py-200 text-preset-5 desktop:px-200">
                      {transaction.date.toUTCString()}
                    </td>
                    <td
                      className={cx(
                        "py-200 text-end text-preset-4-bold desktop:px-200",
                        transaction.amount > 0 ? "text-green" : "text-grey-900",
                      )}
                    >
                      {transaction.amount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SearchResultsSection>
        <footer className="mt-[3rem] flex flex-wrap gap-200 tablet:mt-400">
          {/* todo: Pagination */}
          <p className="grid grow justify-start">
            <Link
              className="group grid h-500 items-center gap-200 rounded-lg border-[0.0625rem] border-beige-500 px-[0.9375rem] transition-colors hocus:bg-beige-500 hocus:text-white tablet:grid-cols-[auto_1fr]"
              href={`/transactions?page=${page - 1}`}
            >
              <span className="grid size-200 place-items-center">
                <IconCaretLeft />
              </span>
              <span className="sr-only text-grey-900 transition-colors group-hocus:text-white tablet:not-sr-only">
                Prev
              </span>
            </Link>
          </p>
          <ol className="flex gap-100" role="list">
            {[1, 2, "...", 5].map((p) => {
              const isCurrent = p === page;
              return (
                <li className="grid" key={p}>
                  {typeof p === "number" ? (
                    <Link
                      className={cx(
                        "grid size-500 place-items-center rounded-lg border-[0.0625rem] transition-colors",
                        isCurrent
                          ? "border-grey-900 bg-grey-900 text-white"
                          : "border-beige-500 hocus:bg-beige-500 hocus:text-white",
                      )}
                      href={`/transactions?page=${p}`}
                      aria-current={isCurrent ? "true" : undefined}
                    >
                      {p}
                    </Link>
                  ) : (
                    <p className="grid size-500 place-items-center rounded-lg border-[0.0625rem] border-beige-500">
                      {p}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="grid grow justify-end">
            <Link
              className="group grid h-500 items-center gap-200 rounded-lg border-[0.0625rem] border-beige-500 px-[0.9375rem] transition-colors hocus:bg-beige-500 hocus:text-white tablet:grid-cols-[1fr_auto]"
              href={`/transactions?page=${page + 1}`}
            >
              <span className="sr-only text-grey-900 transition-colors group-hocus:text-white tablet:not-sr-only">
                Next
              </span>
              <span className="grid size-200 place-items-center">
                <IconCaretRight />
              </span>
            </Link>
          </p>
        </footer>
      </article>
    </>
  );
};

const pageSchema = z
  .preprocess(
    (val) => (Array.isArray(val) ? val[0] : val),
    z.coerce.number().int().positive(),
  )
  .catch(1);

type SearchResultsSectionProps = ComponentPropsWithRef<"section">;

const SearchResultsSection = ({
  className,
  children,
  ...props
}: SearchResultsSectionProps) => {
  const labelId = useId();

  return (
    <section aria-labelledby={labelId} {...props} className={cx(className, "")}>
      <h2 className="sr-only" id={labelId}>
        Search results
      </h2>
      {children}
    </section>
  );
};

export default TransactionsPage;
