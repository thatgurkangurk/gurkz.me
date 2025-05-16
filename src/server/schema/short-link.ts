import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const shortLinks = pgTable("short_link", {
	id: varchar("id", { length: 48 })
		.primaryKey()
		.$defaultFn(() => nanoid(48)),
	slug: varchar("slug", { length: 32 }).unique(),
	redirectTo: text("redirect_to"),
	creatorId: varchar("creator_id")
		.notNull()
		.references(() => users.id, { onUpdate: "cascade" }),
	clicks: integer("clicks").notNull().default(0)
});

export const shortLinkRelations = relations(shortLinks, ({ one }) => ({
	creator: one(users, { fields: [shortLinks.creatorId], references: [users.id] })
}));