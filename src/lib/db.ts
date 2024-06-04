import postgres from "postgres";
import { env } from "../env";
import { drizzle } from "drizzle-orm/postgres-js";
import { schema } from "./schema";

const queryClient = postgres(env.DATABASE_URL);
const db = drizzle(queryClient, { schema: schema });

export { db };
