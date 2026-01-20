import * as z from "zod";
import { type Prisma } from "~/../prisma/generated/prisma/client";

export const maxInt = 2_147_483_647;

export const inUTCMonth = (date: Date): Prisma.DateTimeFilter => {
  return {
    gte: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth())),
    lt: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1)),
  };
};

export const config = {
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_SERVER: z.string(),
  DB_PORT: z.string(),
  DB_DATABASE: z.string(),
  DB_TRUST_SERVER_CERT: z.string(),
};

export type Config = {
  [K in keyof typeof config]: z.infer<(typeof config)[K]>;
};

// Prisma's connection string parsing [doesn't support escaping values](https://github.com/prisma/prisma/issues/28932) and [doesn't convert timeouts to milliseconds](https://github.com/prisma/prisma/issues/29029)
// Use a config object instead
export const createConfig = (env: Partial<Config>) => {
  return {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    server: env.DB_SERVER,
    port: Number(env.DB_PORT),
    options: {
      trustServerCertificate:
        env.DB_TRUST_SERVER_CERT?.toLowerCase() === "true",
    },
  };
};
