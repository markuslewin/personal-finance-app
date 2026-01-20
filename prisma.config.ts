import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: `sqlserver://${process.env.DB_SERVER}${typeof process.env.DB_PORT === "string" ? `:${process.env.DB_PORT}` : ""};database={${process.env.DB_DATABASE}};user={${process.env.DB_USER}};password={${process.env.DB_PASSWORD}};trustServerCertificate={${process.env.DB_TRUST_SERVER_CERT}}`,
  },
});
