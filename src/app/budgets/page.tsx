import Link from "next/link";
import { Fragment } from "react";
import { now } from "~/app/_now";
import { db } from "~/server/db";

const BudgetsPage = async () => {
  // Find all of this month's transaction for each budget. Pad with earlier transactions until we've found 3.
  // todo: Types
  // todo: Filter future transactions
  const month = now.getUTCMonth() + 1;
  const test = await db.$queryRaw`
    SELECT
      "Budget".id,
      "Budget".maximum,
      "Category".name AS "categoryName",
      "Theme".color AS "themeColor",
      t.id AS "transactionId",
      t.amount AS "transactionAmount",
      t.avatar AS "transactionAvatar",
      t.date AS "transactionDate",
      t.name AS "transactionName"
    FROM
      "Budget"
        INNER JOIN "Category"
          ON "Budget"."categoryId" = "Category".id
        INNER JOIN "Theme"
          ON "Budget"."themeId" = "Theme".id
        INNER JOIN (
          SELECT
            *,
            ROW_NUMBER () OVER (
              PARTITION BY "categoryId"
              ORDER BY date DESC
            )
          FROM "Transaction"
        ) t
          ON "Budget"."categoryId" = t."categoryId"
    WHERE
      DATE_PART('month', t.date) = ${month}
        OR t.row_number <= 3
    ORDER BY
      "Budget"."createdAt",
      date DESC
    `;

  return (
    <>
      <h1 className="text-preset-1">Budgets</h1>
      <p>
        <Link href={"/budgets/add"}>
          <span aria-hidden="true">+ </span>Add New Budget
        </Link>
      </p>
      {Object.entries(Object.groupBy(test, (t) => t.id)).map(([id, rows]) => {
        return (
          <Fragment key={id}>
            <h2 className="text-preset-2">{rows[0].categoryName}</h2>
            <div
              className="size-500"
              style={{ background: rows[0].themeColor }}
            />
            <pre>{JSON.stringify(rows, undefined, "\t")}</pre>
          </Fragment>
        );
      })}
      <p>
        <Link href={"/budgets/edit"}>Edit Budget</Link>
      </p>
    </>
  );
};

export default BudgetsPage;
