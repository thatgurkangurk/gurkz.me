import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(import.meta.env.DB_URI!);
const db = drizzle(queryClient);

export { db }
