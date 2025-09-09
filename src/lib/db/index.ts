import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/env";
import * as authSchema from "./schema/auth";
import * as musicSchema from "./schema/music";

const schema = { ...authSchema, ...musicSchema };

export const db = drizzle(env.DATABASE_URL, { schema });
