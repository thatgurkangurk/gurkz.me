import { drizzle } from "drizzle-orm/postgres-js";
import { relations } from "./relations.js";

// @ts-expect-error i dont care
export const db = drizzle(process.env.DATABASE_URL!, { relations: relations });
