import { integer, pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./user";

export const providerEnum = pgEnum("provider", ["discord"]);

export const accounts = pgTable("account", {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider: providerEnum("provider").notNull(),
    providerAccountId: integer("provider_account_id").notNull()
}, (account) => ({
    compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId]
    })
}))