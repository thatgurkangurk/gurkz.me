import { pgTable } from "drizzle-orm/pg-core";
import { sql, type InferSelectModel } from "drizzle-orm";
import { ulid } from "ulid";
import { user } from "./auth.js";

export const musicIds = pgTable("music_id", (t) => ({
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => ulid()),
	robloxId: t.text("roblox_id").notNull(),
	createdById: t
		.varchar("created_by_id")
		.notNull()
		.references(() => user.id),
	name: t.varchar({ length: 128 }).notNull(),
	createdAt: t
		.timestamp("created_at")
		.default(sql`now()`)
		.notNull(),
	working: t.boolean().default(true).notNull(),
	tags: t.text().array().default([]).notNull()
}));

export type MusicId = InferSelectModel<typeof musicIds>;
export type MusicIdWithCreator = MusicId & {
	creator: Pick<InferSelectModel<typeof user>, "id" | "name" | "image">;
};
