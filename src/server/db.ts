import * as schema from "./db/schema";
import {
    drizzle,
    NodePgDatabase,
    type NodePgClient,
} from "drizzle-orm/node-postgres";
import { env } from "~/env";

export type DbSchema = typeof schema;

export type DbType = NodePgDatabase<DbSchema> & {
    $client: NodePgClient;
};

export const db: DbType = drizzle(env.DATABASE_URL, {
    schema: schema,
});
