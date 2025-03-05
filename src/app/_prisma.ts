import { type Prisma } from "@prisma/client";

export const inUTCMonth = (date: Date): Prisma.DateTimeFilter => {
  return {
    gte: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth())),
    lt: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1)),
  };
};
