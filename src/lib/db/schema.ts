import { relations, sql } from "drizzle-orm";
import { bigint, boolean, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

const permissions = ["DEFAULT", "CREATE_MUSIC_IDS", "MANAGE_MUSIC_IDS"] as const;
export const permissionsEnum = pgEnum("permission", permissions);

export type Permission = (typeof permissions)[number];

export const users = pgTable("user", {
	id: varchar("id", {
		length: 21,
	})
		.$defaultFn(() => nanoid())
		.notNull()
		.primaryKey(),
	username: varchar("username", {
		length: 48,
	})
		.notNull()
		.unique(),
	email: varchar("email", {
		length: 64,
	})
		.notNull()
		.unique(),
	profilePictureUrl: varchar("profile_picture_url").notNull(),
	discordId: varchar("discord_id").unique(),
	permissions: permissionsEnum("permissions")
		.array()
		.notNull()
		.default(sql`ARRAY['DEFAULT']::permission[]`),
});

export const musicIds = pgTable("music_id", {
	id: varchar("id", {
		length: 21,
	})
		.primaryKey()
		.$defaultFn(() => nanoid(21)),
	robloxId: bigint("roblox_id", {
		mode: "number",
	}).notNull(),
	createdById: varchar("created_by_id", {
		length: 21,
	})
		.notNull()
		.references(() => users.id),
	name: varchar("name", {
		length: 128,
	}).notNull(),
	created: timestamp("created_at", {
		mode: "date",
	})
		.notNull()
		.defaultNow(),
	working: boolean("working").notNull().default(true),
});

export const musicIdRelations = relations(musicIds, ({ one }) => ({
	creator: one(users, {
		fields: [musicIds.createdById],
		references: [users.id],
	}),
}));

export const sessions = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type User = typeof users.$inferSelect;