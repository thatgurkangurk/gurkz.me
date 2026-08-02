import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/lib/server/db/schema",
	dbCredentials: {
		// @ts-expect-error i dont care
		url: process.env.DATABASE_URL!
	}
});
