import { now } from "~/app/_now";
import { db } from "~/server/db";

const TransactionsPage = async () => {
  const transactions = await db.transaction.findMany({
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
  });

  return (
    <>
      <h1 className="text-preset-1">Transactions</h1>
      <pre>{JSON.stringify(transactions, undefined, "\t")}</pre>
    </>
  );
};

export default TransactionsPage;
