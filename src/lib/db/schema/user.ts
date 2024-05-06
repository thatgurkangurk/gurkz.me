import { bigint, pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").unique(),
	email: text("email").unique(),
	discordId: bigint("discord_id", {
		mode: "number"
	}).unique()
});
