import { drizzle } from "drizzle-orm/postgres-js";
import { relations } from "./relations.js";

export const db = drizzle(process.env.DATABASE_URL!, { relations: relations });
