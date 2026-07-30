import { drizzle } from "drizzle-orm/postgres-js";
import { DATABASE_URL } from "$app/env/private";
import * as authSchema from "./schema/auth";
import * as musicSchema from "./schema/music";
import * as permissionsSchema from "./schema/permission";

export const schema = { ...authSchema, ...musicSchema, ...permissionsSchema };

export const db = drizzle(DATABASE_URL, { schema });
