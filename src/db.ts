import * as schema from "./db/schema";
import { DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(DATABASE_URL, {
    schema: schema,
});
