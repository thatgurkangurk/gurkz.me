import { type InferSelectModel, relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { user } from "./auth";

export const musicIds = pgTable("music_id", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => ulid()),
	robloxId: text("roblox_id").notNull(),
	createdById: varchar("created_by_id")
		.notNull()
		.references(() => user.id),
	name: varchar("name", { length: 128 }).notNull(),
	created: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	working: boolean("working").notNull().default(true),
	tags: text("tags").array().notNull().default([])
});

export const musicIdRelations = relations(musicIds, ({ one }) => ({
	creator: one(user, { fields: [musicIds.createdById], references: [user.id] })
}));

export type MusicId = InferSelectModel<typeof musicIds>;
export type MusicIdWithCreator = MusicId & {
	creator: Pick<InferSelectModel<typeof user>, "id" | "name" | "image">;
};
