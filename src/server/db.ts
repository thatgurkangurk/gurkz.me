import * as schema from "./db/schema";
import type { SQL } from "bun";
import { drizzle, BunSQLDatabase } from "drizzle-orm/bun-sql";
import { env } from "~/env";

export type DbSchema = typeof schema;

export type DbType = BunSQLDatabase<DbSchema> & {
    $client: SQL;
};

export const db = drizzle(env.DATABASE_URL, {
    schema: schema,
});
