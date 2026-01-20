import { faker } from "@faker-js/faker";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "~/../prisma/generated/prisma/client";
import { toCentsFromNumber } from "~/app/_currency";
import { createConfig } from "~/app/_prisma";
import { categories, themes, transactions, userSeed } from "~/data/data";

const db = new PrismaClient({
  adapter: new PrismaMssql(
    createConfig(process.env as Partial<Record<string, string>>),
  ),
  log: ["error"],
});

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

  for (const transaction of transactions) {
    await db.transaction.create({
      data: {
        amount: toCentsFromNumber(transaction.amount),
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
                  amount: toCentsFromNumber(Math.abs(transaction.amount)),
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

  await db.user.create({
    data: {
      ...userSeed(createdAtBase),
      name: "Demo",
      email: faker.internet.email(),
      demo: true,
    },
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
