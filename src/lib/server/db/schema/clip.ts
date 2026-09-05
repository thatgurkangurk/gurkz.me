import { pgTable } from "drizzle-orm/pg-core";

import { profile } from "./profile.js";

export const clip = pgTable("clip", (t) => ({
	id: t.uuid().defaultRandom().primaryKey(),
	createdById: t.text("created_by_id").notNull(),
	videoId: t.text("video_id").notNull(),
	url: t.text("url").notNull().unique(),
	title: t.text().notNull(),
	selected: t.boolean().notNull().default(false),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
	overriddenProfileDataId: t.uuid("overridden_profile_data_id").references(() => profile.id),
	songs: t.text().array().default([]).notNull(),
	note: t.text()
}));
