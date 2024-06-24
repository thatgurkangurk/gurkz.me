import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as usersSchema from "./schema/user";
import * as musicSchema from "./schema/music";
import * as sessionsSchema from "./schema/session";
import { getSecret } from "astro:env/server";

const schema = {
  ...usersSchema,
  ...musicSchema,
  ...sessionsSchema,
};

const pool = postgres(getSecret("DATABASE_URL"), { max: 1 });
export const db = drizzle(pool, { schema: schema });
