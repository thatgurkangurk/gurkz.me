import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../../env";
import * as userSchema from "./schema/user";
import * as sessionSchema from "./schema/session";

const schema = {
	...userSchema,
	...sessionSchema
};

const queryClient = postgres(env.DATABASE_URL);
const db = drizzle(queryClient, { schema: schema });

export { queryClient, db };
