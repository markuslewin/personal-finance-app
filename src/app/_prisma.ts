import { type Prisma } from "~/../prisma/generated/prisma/client";

export const maxInt = 2_147_483_647;

export const inUTCMonth = (date: Date): Prisma.DateTimeFilter => {
  return {
    gte: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth())),
    lt: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1)),
  };
};
