import { drizzle } from "drizzle-orm/postgres-js";
import * as authSchema from "./schema/auth";
import * as musicSchema from "./schema/music";
import { env } from "$env/dynamic/private";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const schema = { ...authSchema, ...musicSchema };

export const db = drizzle(env.DATABASE_URL, { schema });
