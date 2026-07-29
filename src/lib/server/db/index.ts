import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "$lib/env";
import * as authSchema from "./schema/auth";
import * as musicSchema from "./schema/music";
import * as permissionsSchema from "./schema/permission";

export const schema = { ...authSchema, ...musicSchema, ...permissionsSchema };

export const db = drizzle(env.DATABASE_URL, { schema });
