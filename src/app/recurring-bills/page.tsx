import { type Metadata } from "next";
import { db } from "~/server/db";

export const metadata: Metadata = {
  title: "Recurring bills",
};

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

  return (
    <>
      <h1 className="text-preset-1">Recurring Bills</h1>
      <pre>{JSON.stringify(recurringBills, undefined, "\t")}</pre>
    </>
  );
};

export default RecurringBillsPage;
