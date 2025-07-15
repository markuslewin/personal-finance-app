import { cx } from "class-variance-authority";
import { type Metadata } from "next";
import Image from "next/image";
import { Link } from "~/app/_components/link";
import IconCaretLeft from "~/app/_assets/icon-caret-left.svg";
import IconCaretRight from "~/app/_assets/icon-caret-right.svg";
import { type ComponentPropsWithRef, useId } from "react";
import { currency, date } from "~/app/_format";
import TransactionsSearchForm from "~/app/(main)/transactions/_components/transactions-search-form";
import { searchSchema } from "~/app/(main)/transactions/_search";
import { z } from "zod";
import { getPaginatedTransactions } from "~/server/transaction";
import { getCategories } from "~/server/category";
import { maxInt } from "~/app/_prisma";

export const metadata: Metadata = {
  title: "Transactions",
};

const TransactionsPage = async ({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) => {
  const { name, sort, category, page } = searchSchema
    .extend({
      page: z
        .preprocess(
          (val) => (Array.isArray(val) ? val[0] : val),
          z.coerce.number().int().positive().lte(maxInt),
        )
        .catch(1),
    })
    .parse(await searchParams);

  const [categories, { transactions, totalPages }] = await Promise.all([
    getCategories(),
    getPaginatedTransactions({
      name,
      category,
      sort,
      page,
    }),
  ]);

  const createSearchParams = (page: number) => {
    return new URLSearchParams({
      ...(name === undefined ? {} : { name }),
      ...(sort === undefined ? {} : { sort }),
      ...(category === undefined ? {} : { category }),
      page: page.toString(),
    });
  };

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <>
      <h1 className="text-preset-1">Transactions</h1>
      <article className="mt-[2.5625rem] rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400 forced-colors:border-[0.0625rem]">
        <header>
          <h2 className="sr-only">Search</h2>
          <TransactionsSearchForm categories={categories} />
        </header>
        <SearchResultsSection className="mt-300">
          {/* Duplicate HTML to match the design */}
          {/* A list on mobile turns into a table on tablet */}
          <ul
            className="space-y-200 divide-y-[0.0625rem] divide-grey-100 add-space-y-200 tablet:hidden"
            role="list"
          >
            {transactions.map((transaction) => {
              return (
                <li
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-150"
                  key={transaction.id}
                  data-testid="transaction"
                >
                  <Image
                    className="size-400 rounded-full object-cover"
                    alt=""
                    src={transaction.avatar}
                    width={160}
                    height={160}
                  />
                  <div className="grid gap-50">
                    <h3
                      className="text-preset-4-bold text-grey-900"
                      data-testid="name"
                    >
                      {transaction.name}
                    </h3>
                    <p className="text-preset-5">
                      <span className="sr-only">Category: </span>
                      <span data-testid="category">
                        {transaction.category.name}
                      </span>
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
                      <span data-testid="amount">
                        {currency(transaction.amount, {
                          signDisplay: "always",
                        })}
                      </span>
                    </p>
                    <p className="text-preset-5">
                      <span className="sr-only">Date: </span>
                      <span data-testid="date">{date(transaction.date)}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <table className="hidden w-full tablet:table">
            <thead className="border-b-[0.0625rem] border-grey-100">
              <tr>
                <th className="pt-150 pb-[0.6875rem] text-start text-preset-5 desktop:px-200">
                  Recipient / Sender
                </th>
                <th className="pt-150 pb-[0.6875rem] text-start text-preset-5 desktop:px-200">
                  Category
                </th>
                <th className="pt-150 pb-[0.6875rem] text-start text-preset-5 desktop:px-200">
                  Transaction Date
                </th>
                <th className="pt-150 pb-[0.6875rem] text-end text-preset-5 desktop:px-200">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="mt-100 divide-y-[0.0625rem] divide-grey-100">
              {transactions.map((transaction) => {
                return (
                  <tr key={transaction.id} data-testid="transaction">
                    <td className="py-200 desktop:px-200">
                      <div className="grid grid-cols-[auto_1fr] items-center gap-200">
                        <Image
                          className="size-500 rounded-full object-cover"
                          alt=""
                          src={transaction.avatar}
                          width={160}
                          height={160}
                        />
                        <p
                          className="text-preset-4-bold text-grey-900"
                          data-testid="name"
                        >
                          {transaction.name}
                        </p>
                      </div>
                    </td>
                    <td
                      className="py-200 text-preset-5 desktop:px-200"
                      data-testid="category"
                    >
                      {transaction.category.name}
                    </td>
                    <td
                      className="py-200 text-preset-5 desktop:px-200"
                      data-testid="date"
                    >
                      {date(transaction.date)}
                    </td>
                    <td
                      className={cx(
                        "py-200 text-end text-preset-4-bold desktop:px-200",
                        transaction.amount > 0 ? "text-green" : "text-grey-900",
                      )}
                      data-testid="amount"
                    >
                      {currency(transaction.amount, {
                        signDisplay: "always",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SearchResultsSection>
        <footer className="mt-[3rem] grid grid-cols-[1fr_auto_1fr] items-center gap-200 tablet:mt-400">
          <p className="grid grow justify-start">
            <Link
              className={cx(
                "group grid h-500 items-center gap-200 rounded-lg border-[0.0625rem] border-beige-500 px-[0.9375rem] transition tablet:grid-cols-[auto_1fr]",
                isFirstPage
                  ? "opacity-50"
                  : "hocus:bg-beige-500 hocus:text-white",
              )}
              href={`/transactions?${createSearchParams(isFirstPage ? page : page - 1)}`}
              scroll={false}
              aria-current={isFirstPage ? "page" : undefined}
            >
              <span className="grid size-200 place-items-center">
                <IconCaretLeft className="h-[0.6875rem]" />
              </span>
              <span
                className={cx(
                  "sr-only text-grey-900 transition-colors tablet:not-sr-only",
                  !isFirstPage ? "group-hocus:text-white" : "",
                )}
                aria-hidden="true"
              >
                Prev
              </span>
              <span className="sr-only">Previous</span>
            </Link>
          </p>
          <Pages
            page={page}
            totalPages={totalPages}
            createSearchParams={createSearchParams}
          />
          <p className="grid grow justify-end">
            <Link
              className={cx(
                "group grid h-500 items-center gap-200 rounded-lg border-[0.0625rem] border-beige-500 px-[0.9375rem] transition tablet:grid-cols-[1fr_auto]",
                isLastPage
                  ? "opacity-50"
                  : "hocus:bg-beige-500 hocus:text-white",
              )}
              href={`/transactions?${createSearchParams(isLastPage ? page : page + 1)}`}
              scroll={false}
              aria-current={isLastPage ? "page" : undefined}
            >
              <span
                className={cx(
                  "sr-only text-grey-900 transition-colors tablet:not-sr-only",
                  !isLastPage ? "group-hocus:text-white" : "",
                )}
              >
                Next
              </span>
              <span className="grid size-200 place-items-center">
                <IconCaretRight className="h-[0.6875rem]" />
              </span>
            </Link>
          </p>
        </footer>
      </article>
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
      <h2 className="sr-only" id={labelId}>
        Search results
      </h2>
      {children}
    </section>
  );
};

type PagesProps = {
  page: number;
  totalPages: number;
  createSearchParams: (page: number) => URLSearchParams;
};

const Pages = ({ page, totalPages, createSearchParams }: PagesProps) => {
  const pagesId = useId();

  return (
    <>
      <p className="sr-only">
        <span id={pagesId}>Pages</span>:
      </p>
      <ol
        className="flex flex-wrap justify-center gap-100"
        role="list"
        aria-labelledby={pagesId}
      >
        {/* todo: Ellipsis */}
        {new Array(totalPages).fill(null).map((_, i) => {
          const p = i + 1;
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
                  href={`/transactions?${createSearchParams(p)}`}
                  scroll={false}
                  aria-current={isCurrent ? "page" : undefined}
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
    </>
  );
};

export default TransactionsPage;
