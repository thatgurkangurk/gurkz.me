import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const musicIds = pgTable("music_id", {
	id: varchar("id", { length: 21 })
		.primaryKey()
		.$defaultFn(() => nanoid(21)),
	robloxId: text("roblox_id").notNull(),
	createdById: varchar("created_by_id")
		.notNull()
		.references(() => users.id),
	name: varchar("name", { length: 128 }).notNull(),
	created: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	working: boolean("working").notNull().default(true),
	verified: boolean("verified").notNull().default(false),
	tags: text("tags").array().notNull().default([])
});

export const musicIdRelations = relations(musicIds, ({ one }) => ({
	creator: one(users, { fields: [musicIds.createdById], references: [users.id] })
}));
