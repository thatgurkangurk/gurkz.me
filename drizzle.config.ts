import { defineConfig } from "drizzle-kit";
import { env } from "std-env";

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: { url: env.DATABASE_URL! },
	schema: "./src/server/schema/**"
});