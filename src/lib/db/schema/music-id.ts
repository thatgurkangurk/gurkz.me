import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const musicIds = pgTable("music_id", {
	id: text("id").primaryKey(),
	robloxId: integer("roblox_id").unique(),
	approved: boolean("approved").default(false).notNull(),
	working: boolean("working").default(true).notNull(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" })
});

export const musicIdsRelations = relations(musicIds, ({ one }) => ({
	owner: one(users, {
		fields: [musicIds.ownerId],
		references: [users.id]
	})
}));
