-- Find all of this month's transaction for each budget. Pad with earlier transactions until we've found 3.
-- @param {Int} $1:year
-- @param {Int} $2:month
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
      WHERE date < MAKE_DATE(
        CAST($1 AS INTEGER),
        CAST($2 AS INTEGER),
        1
      ) + INTERVAL '1 month'
    ) t
      ON "Budget"."categoryId" = t."categoryId"
WHERE (
  DATE_PART('year', t.date) = $1
    AND DATE_PART('month', t.date) = $2
)
  OR t.row_number <= 3
ORDER BY
  "Budget"."createdAt",
  date DESC