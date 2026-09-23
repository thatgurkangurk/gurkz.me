import { pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";

import { user } from "./auth.js";

export const shortLink = pgTable("short_link", (t) => ({
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => ulid()),
	title: t.text().notNull().unique(),
	createdAt: t.timestamp("created_at").defaultNow().notNull(),
	createdById: t
		.text("created_by_id")
		.notNull()
		.references(() => user.id),
	slug: t.text().notNull().unique(),
	uses: t.integer().notNull().default(0),
	location: t.text().notNull()
}));
