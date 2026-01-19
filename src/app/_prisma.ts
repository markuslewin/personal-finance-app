import * as z from "zod";
import { type Prisma } from "~/../prisma/generated/prisma/client";

export const maxInt = 2_147_483_647;

export const inUTCMonth = (date: Date): Prisma.DateTimeFilter => {
  return {
    gte: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth())),
    lt: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1)),
  };
};

const envSchema = z
  .object({
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_SERVER: z.string(),
    DB_DATABASE: z.string(),
    DB_TRUST_SERVER_CERT: z.string(),
  })
  .transform((val) => {
    return {
      user: val.DB_USER,
      password: val.DB_PASSWORD,
      database: val.DB_DATABASE,
      server: val.DB_SERVER,
      options: {
        trustServerCertificate:
          val.DB_TRUST_SERVER_CERT.toLowerCase() === "true",
      },
    };
  });

export type ConfigEnv = z.input<typeof envSchema>;

// Prisma's connection string parsing [doesn't support escaping values](https://github.com/prisma/prisma/issues/28932) and [doesn't convert timeouts to milliseconds](https://github.com/prisma/prisma/issues/29029)
// Use a config object instead
export const createConfig = () => {
  return envSchema.parse(process.env);
};
