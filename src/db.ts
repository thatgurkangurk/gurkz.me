import * as schema from "./db/schema";
import { DATABASE_URL } from "astro:env/server";
import {
    drizzle,
    NodePgDatabase,
    type NodePgClient,
} from "drizzle-orm/node-postgres";

export type DbSchema = typeof schema;

export type DbType = NodePgDatabase<DbSchema> & {
    $client: NodePgClient;
};

export const db: DbType = drizzle(DATABASE_URL, {
    schema: schema,
});
