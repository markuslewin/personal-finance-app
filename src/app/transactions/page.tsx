import { cx } from "class-variance-authority";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "~/server/db";
// import IconCaretDown from "~/app/_assets/icon-caret-down.svg";
import IconCaretLeft from "~/app/_assets/icon-caret-left.svg";
import IconCaretRight from "~/app/_assets/icon-caret-right.svg";
import { type ComponentPropsWithRef, useId } from "react";
import { currency, date } from "~/app/_format";
import TransactionsSearchForm from "~/app/transactions/_components/transactions-search-form";
import { getOrderBy, searchSchema } from "~/app/transactions/_search";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Transactions",
};

const PAGE_SIZE = 10;

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
          z.coerce.number().int().positive(),
        )
        .catch(1),
    })
    .parse(await searchParams);

  const [categories, transactions] = await Promise.all([
    db.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
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
        name: {
          contains: name,
          mode: "insensitive",
        },
        category: {
          name: category,
        },
      },
      orderBy: getOrderBy(sort),
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
          <TransactionsSearchForm
            categories={categories}
            defaultValues={{
              name,
              sort,
              category,
            }}
          />
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
                      {currency(transaction.amount, {
                        signDisplay: "always",
                      })}
                    </p>
                    <p className="text-preset-5">
                      <span className="sr-only">Date: </span>
                      {date(transaction.date)}
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
                      {date(transaction.date)}
                    </td>
                    <td
                      className={cx(
                        "py-200 text-end text-preset-4-bold desktop:px-200",
                        transaction.amount > 0 ? "text-green" : "text-grey-900",
                      )}
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
