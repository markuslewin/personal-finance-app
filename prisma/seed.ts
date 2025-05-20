import { db } from "../src/server/db";
import data from "./data.json";

// All categories mentioned in the data
const categories = [
  ...new Set([...data.budgets, ...data.transactions].map((d) => d.category)),
];

// Point transaction avatars to `/public`
const transactions = data.transactions.map((t) => ({
  ...t,
  avatar: t.avatar.replace(/^\./, ""),
}));

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

const getThemeNameByHex = (hex: string) => {
  const name = themeNameByHex.get(hex);
  if (typeof name !== "string") {
    throw new Error(`No name found for theme with hex "${hex}"`);
  }

  return name;
};

// We sort on `createdAt` in the app, so we make sure entities in a collection have unique values for that field
// Might want to introduce `order` field instead
const createdAtBase = new Date();

async function main() {
  await db.theme.createMany({
    data: themes.map((theme, i) => {
      return { ...theme, createdAt: new Date(createdAtBase.getTime() + i) };
    }),
  });

  await db.category.createMany({
    data: categories.map((name, i) => {
      return {
        name,
        createdAt: new Date(createdAtBase.getTime() + i),
      };
    }),
  });

  await db.balance.create({
    data: data.balance,
  });

  for (const transaction of transactions) {
    await db.transaction.create({
      data: {
        amount: transaction.amount,
        avatar: transaction.avatar,
        date: transaction.date,
        name: transaction.name,
        category: {
          connect: {
            name: transaction.category,
          },
        },
        recurringBill: transaction.recurring
          ? {
              connectOrCreate: {
                where: {
                  name: transaction.name,
                },
                create: {
                  amount: Math.abs(transaction.amount),
                  avatar: transaction.avatar,
                  day: new Date(transaction.date).getUTCDate(),
                  name: transaction.name,
                },
              },
            }
          : undefined,
      },
    });
  }

  for (let i = 0; i < data.budgets.length; ++i) {
    const budget = data.budgets[i]!;
    const themeName = getThemeNameByHex(budget.theme);

    await db.budget.create({
      data: {
        maximum: budget.maximum,
        createdAt: new Date(createdAtBase.getTime() + i),
        category: {
          connect: {
            name: budget.category,
          },
        },
        theme: {
          connect: {
            name: themeName,
          },
        },
      },
    });
  }

  for (let i = 0; i < data.pots.length; ++i) {
    const pot = data.pots[i]!;
    const themeName = getThemeNameByHex(pot.theme);

    await db.pot.create({
      data: {
        name: pot.name,
        target: pot.target,
        total: pot.total,
        createdAt: new Date(createdAtBase.getTime() + i),
        theme: {
          connect: {
            name: themeName,
          },
        },
      },
    });
  }
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
