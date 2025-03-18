import { db } from "../src/server/db";
import data from "./data.json";
import { type RecurringBill } from "@prisma/client";

// All categories mentioned in the data
const categories = [
  ...new Set([...data.budgets, ...data.transactions].map((d) => d.category)),
];

// Point transaction avatars to `/public`
const transactions = data.transactions.map((t) => ({
  ...t,
  avatar: t.avatar.replace(/^\./, ""),
}));

type RecurringBillData = Omit<RecurringBill, "id" | "createdAt" | "updatedAt">;

// Derives recurring bill data from the last transaction of the recipient. Should probably be its own collection
const recurringBills = Object.values(
  transactions
    .filter((t) => t.recurring)
    .reduce(
      (bills, transaction) => {
        return {
          ...bills,
          [transaction.name]: {
            amount: Math.abs(transaction.amount),
            avatar: transaction.avatar,
            name: transaction.name,
            day: new Date(transaction.date).getUTCDate(),
          } satisfies RecurringBillData,
        };
      },
      {} as Record<RecurringBillData["name"], RecurringBillData>,
    ),
);

const themes = [
  { name: "Green", color: "var(--color-green)" },
  { name: "Yellow", color: "var(--color-yellow)" },
  { name: "Cyan", color: "var(--color-cyan)" },
  { name: "Navy", color: "var(--color-navy)" },
  { name: "Red", color: "var(--color-red)" },
  { name: "Purple", color: "var(--color-purple)" },
  { name: "Turquoise", color: "var(--color-turquoise)" },
  { name: "Brown", color: "var(--color-brown)" },
  { name: "Magenta", color: "var(--color-magenta)" },
  { name: "Blue", color: "var(--color-blue)" },
  { name: "Navy Grey", color: "var(--color-navy-grey)" },
  { name: "Army Green", color: "var(--color-army-green)" },
  { name: "Pink", color: "var(--color-pink)" },
  { name: "Gold", color: "var(--color-gold)" },
  { name: "Orange", color: "var(--color-orange)" },
];

const themeNameByHex = new Map([
  ["#277C78", "Green"],
  ["#82C9D7", "Cyan"],
  ["#F2CDAC", "Yellow"],
  ["#626070", "Navy"],
  ["#826CB0", "Purple"],
]);

const createdAtBase = new Date();

async function main() {
  const persistedThemes = await db.theme.createManyAndReturn({
    data: themes.map((theme, i) => {
      return { ...theme, createdAt: new Date(createdAtBase.getTime() + i) };
    }),
  });
  const themeIdByName = new Map(persistedThemes.map((c) => [c.name, c.id]));

  const persistedCategories = await db.category.createManyAndReturn({
    data: categories.map((name, i) => {
      return {
        name,
        createdAt: new Date(createdAtBase.getTime() + i),
      };
    }),
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
    data: transactions.map((transaction) => {
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
    data: data.budgets.map((budget, i) => {
      const categoryId = categoryIdByName.get(budget.category);
      if (categoryId === undefined) {
        throw new Error(
          `Could not find category with name "${budget.category}"`,
        );
      }

      const themeName = themeNameByHex.get(budget.theme);
      if (themeName === undefined) {
        throw new Error(`Could not find name with hex code "${budget.theme}"`);
      }
      const themeId = themeIdByName.get(themeName);
      if (themeId === undefined) {
        throw new Error(`Could not find theme with name "${themeName}"`);
      }

      return {
        maximum: budget.maximum,
        categoryId,
        themeId,
        createdAt: new Date(createdAtBase.getTime() + i),
      };
    }),
  });

  await db.pot.createMany({
    data: data.pots.map((pot, i) => {
      const themeName = themeNameByHex.get(pot.theme);
      if (themeName === undefined) {
        throw new Error(`Could not find name with hex code "${pot.theme}"`);
      }
      const themeId = themeIdByName.get(themeName);
      if (themeId === undefined) {
        throw new Error(`Could not find theme with name "${themeName}"`);
      }

      return {
        name: pot.name,
        target: pot.target,
        total: pot.total,
        themeId,
        createdAt: new Date(createdAtBase.getTime() + i),
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
