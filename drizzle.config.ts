import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.REMOTE
    ? process.env.REMOTE_DATABASE_URL
    : process.env.DATABASE_URL;

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: databaseUrl!,
    },
});
