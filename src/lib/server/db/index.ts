import { drizzle } from "drizzle-orm/postgres-js";
import { DATABASE_URL } from "$app/env/private";
import { relations } from "./relations";

export const db = drizzle(DATABASE_URL, { relations: relations });
