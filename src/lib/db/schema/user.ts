import { pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: text("id").primaryKey(),
    username: text("username").unique(),
})