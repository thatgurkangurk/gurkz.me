import { pgTable } from "drizzle-orm/pg-core";

export const profile = pgTable("profile", (t) => ({
	id: t.uuid().defaultRandom().primaryKey(),
	line1: t.text().notNull(),
	line2: t.text().notNull()
}));
