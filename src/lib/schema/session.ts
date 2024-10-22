import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const sessions = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export type Session = typeof sessions.$inferSelect;
