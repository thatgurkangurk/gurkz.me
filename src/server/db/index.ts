import { drizzle } from "drizzle-orm/postgres-js";
import * as authSchema from "./schema/auth";
import * as musicSchema from "./schema/music";
import * as permissionsSchema from "./schema/permission";

const schema = { ...authSchema, ...musicSchema, ...permissionsSchema };

export const db = drizzle(Bun.env.DATABASE_URL!, { schema });
