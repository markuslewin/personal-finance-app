import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "~/../prisma/generated/prisma/client";
import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaMssql(env.DATABASE_URL),
    log:
      env.NODE_ENV === "development"
        ? [
            // "query",
            "error",
            "warn",
          ]
        : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
