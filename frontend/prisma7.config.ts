import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/external/prisma/schema.prisma",

  datasource: {
    url: process.env["DATABASE_URL"],
  },

  migrations: {
    path: "src/external/prisma/migrations",
    seed: "tsx src/external/prisma/seed.ts",
  },
});
