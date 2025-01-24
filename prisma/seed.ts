import { db } from "../src/server/db";
import data from "./data.json";
import { type RecurringBill } from "@prisma/client";

// All categories mentioned in the data
const categories = [
  ...new Set([...data.budgets, ...data.transactions].map((d) => d.category)),
];

type RecurringBillData = Omit<RecurringBill, "id" | "createdAt" | "updatedAt">;

// Derives recurring bill data from the last transaction of the recipient. Should probably be its own collection
const recurringBills = Object.values(
  data.transactions
    .filter((t) => t.recurring)
    .reduce(
      (bills, transaction) => {
        return {
          ...bills,
          [transaction.name]: {
            amount: transaction.amount,
            avatar: transaction.avatar,
            name: transaction.name,
            day: new Date(transaction.date).getDate(),
          } satisfies RecurringBillData,
        };
      },
      {} as Record<RecurringBillData["name"], RecurringBillData>,
    ),
);

const themes = [
  { name: "Green", color: "#277C78" },
  { name: "Cyan", color: "#82C9D7" },
  { name: "Yellow", color: "#F2CDAC" },
  { name: "Navy", color: "#626070" },
  { name: "Purple", color: "#826CB0" },
];

async function main() {
  const persistedThemes = await db.theme.createManyAndReturn({
    data: themes,
  });
  const themeIdByColor = new Map(persistedThemes.map((c) => [c.color, c.id]));

  const persistedCategories = await db.category.createManyAndReturn({
    data: categories.map((name) => ({ name })),
    select: {
      id: true,
      name: true,
    },
  });
  const categoryIdByName = new Map(
    persistedCategories.map((c) => [c.name, c.id]),
  );

  const persistedRecurringBills = await db.recurringBill.createManyAndReturn({
    data: recurringBills,
    select: {
      id: true,
      name: true,
    },
  });
  const recurringBillIdByName = new Map(
    persistedRecurringBills.map((c) => [c.name, c.id]),
  );

  await db.balance.create({
    data: data.balance,
  });

  await db.transaction.createMany({
    data: data.transactions.map((transaction) => {
      const categoryId = categoryIdByName.get(transaction.category);
      if (categoryId === undefined) {
        throw new Error(
          `Could not find category with name "${transaction.category}"`,
        );
      }

      let recurringBillId = undefined;
      if (transaction.recurring) {
        recurringBillId = recurringBillIdByName.get(transaction.name);
        if (recurringBillId === undefined) {
          throw new Error(
            `Could not find recurring bill with name "${transaction.name}"`,
          );
        }
      }

      return {
        amount: transaction.amount,
        avatar: transaction.avatar,
        date: transaction.date,
        name: transaction.name,
        categoryId,
        recurringBillId,
      };
    }),
  });

  await db.budget.createMany({
    data: data.budgets.map((budget) => {
      const categoryId = categoryIdByName.get(budget.category);
      if (categoryId === undefined) {
        throw new Error(
          `Could not find category with name "${budget.category}"`,
        );
      }

      const themeId = themeIdByColor.get(budget.theme);
      if (themeId === undefined) {
        throw new Error(`Could not find theme with color "${budget.theme}"`);
      }

      return {
        maximum: budget.maximum,
        categoryId,
        themeId,
      };
    }),
  });

  await db.pot.createMany({
    data: data.pots.map((pot) => {
      const themeId = themeIdByColor.get(pot.theme);
      if (themeId === undefined) {
        throw new Error(`Could not find theme with color "${pot.theme}"`);
      }

      return {
        name: pot.name,
        target: pot.target,
        total: pot.total,
        themeId,
      };
    }),
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
