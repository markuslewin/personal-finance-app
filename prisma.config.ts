import "dotenv/config";
import { defineConfig } from "prisma/config";
import { createConnectionString } from "./src/app/_prisma";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: createConnectionString(),
  },
});
