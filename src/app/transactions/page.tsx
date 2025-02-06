import { cx } from "class-variance-authority";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { now } from "~/app/_now";
import SearchResultsSection from "~/app/transactions/_components/search-results-section";
import { db } from "~/server/db";
import IconCaretLeft from "~/app/_assets/icon-caret-left.svg";
import IconCaretRight from "~/app/_assets/icon-caret-right.svg";

export const metadata: Metadata = {
  title: "Transactions",
};

const TransactionsPage = async () => {
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
      take: 10,
    }),
  ]);

  return (
    <>
      <h1 className="text-preset-1">Transactions</h1>
      <article className="mt-[2.5625rem] rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400">
        <header>
          <h2 className="sr-only">Search</h2>
          <form>
            <label>
              Search:{" "}
              <input type="search" name="q" placeholder="Search transaction" />
            </label>
            <label>
              Sort by:{" "}
              <select name="sort" defaultValue={"latest"}>
                <option value={"latest"}>Latest</option>
                <option value={"oldest"}>Oldest</option>
                <option value={"a-to-z"}>A to Z</option>
                <option value={"z-to-a"}>Z to A</option>
                <option value={"highest"}>Highest</option>
                <option value={"lowest"}>Lowest</option>
              </select>
            </label>
            <label>
              Category{" "}
              <select name="category" defaultValue={"all-transactions"}>
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
          <table className="hidden tablet:table">
            <thead>
              <tr>
                <th className="text-preset-5">Recipient / Sender</th>
                <th className="text-preset-5">Category</th>
                <th className="text-preset-5">Transaction Date</th>
                <th className="text-preset-5">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                return (
                  <tr key={transaction.id}>
                    <td>
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
                    <td className="text-preset-5">
                      {transaction.category.name}
                    </td>
                    <td className="text-preset-5">
                      {transaction.date.toUTCString()}
                    </td>
                    <td
                      className={cx(
                        "text-preset-4-bold",
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
        <footer className="mt-[3rem] grid h-500 grid-cols-[1fr_max-content_1fr]">
          {/* todo: Pagination */}
          <p className="grid justify-start">
            <Link
              className="group inline-grid grid-cols-[auto_1fr] items-center gap-200 rounded-lg border-[0.0625rem] border-beige-500 px-[0.9375rem] transition-colors hocus:bg-beige-500 hocus:text-white"
              href={"/transactions?page=1"}
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
            {[1, 2, "...", 5].map((page) => {
              return (
                <li className="grid" key={page}>
                  {typeof page === "number" ? (
                    <Link
                      className="grid size-500 place-items-center rounded-lg border-[0.0625rem] border-beige-500 transition-colors hocus:bg-beige-500 hocus:text-white"
                      href={`/transactions?page=${page}`}
                      aria-current="true"
                    >
                      {page}
                    </Link>
                  ) : (
                    <p className="grid size-500 place-items-center rounded-lg border-[0.0625rem] border-beige-500">
                      {page}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="grid justify-end">
            <Link
              className="group inline-grid grid-cols-[1fr_auto] items-center gap-200 rounded-lg border-[0.0625rem] border-beige-500 px-[0.9375rem] transition-colors hocus:bg-beige-500 hocus:text-white"
              href={"/transactions?page=2"}
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

export default TransactionsPage;
