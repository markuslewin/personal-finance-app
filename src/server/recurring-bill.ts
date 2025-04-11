import "server-only";
import { db } from "~/server/db";

export const getRecurringBills = () => {
  return db.recurringBill.findMany({
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
};
