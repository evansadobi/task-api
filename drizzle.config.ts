import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:mypassword@localhost:5432/task",
  },
  schema: "./src/db/schema.ts",
});
