import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as musicSchema from "./schema/music";
import * as sessionsSchema from "./schema/session";
import * as usersSchema from "./schema/user";
import { env } from "$env/dynamic/private";

const schema = {
	...usersSchema,
	...musicSchema,
	...sessionsSchema,
};

const pool = postgres(env.DATABASE_URL, { max: 1 });
export const db = drizzle(pool, { schema: schema });