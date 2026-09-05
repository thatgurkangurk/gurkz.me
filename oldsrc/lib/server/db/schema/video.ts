import { sql } from "drizzle-orm";
import { pgTable, check } from "drizzle-orm/pg-core";
import { ulid } from "ulid";

export const video = pgTable(
	"video",
	(t) => ({
		id: t
			.text()
			.primaryKey()
			.$defaultFn(() => ulid()),
		title: t.text().notNull().unique(),
		submissionsOpen: t.boolean("submissions_open").notNull().default(true),
		createdAt: t.timestamp("created_at").defaultNow().notNull(),
		message: t.text(),
		messageUpdatedAt: t.timestamp("message_updated_at")
	}),
	(table) => [
		check(
			"linked_message_check",
			sql`(${table.message} IS NULL AND ${table.messageUpdatedAt} IS NULL) OR (${table.message} IS NOT NULL AND ${table.messageUpdatedAt} IS NOT NULL)`
		)
	]
);
