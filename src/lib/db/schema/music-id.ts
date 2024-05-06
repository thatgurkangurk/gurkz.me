import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const musicIds = pgTable("music_id", {
	id: text("id").primaryKey(),
	robloxId: text("roblox_id").unique().notNull(),
	approved: boolean("approved").default(false).notNull(),
	working: boolean("working").default(true).notNull(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	name: varchar("description", {
		length: 48
	}).notNull(),
	ownerUsername: text("owner_username")
		.notNull()
		.references(() => users.username, { onDelete: "cascade" })
});

export const musicIdsRelations = relations(musicIds, ({ one }) => ({
	owner: one(users, {
		fields: [musicIds.ownerId, musicIds.ownerUsername],
		references: [users.id, users.username]
	})
}));
