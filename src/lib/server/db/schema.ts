import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
	boolean,
	foreignKey,
	primaryKey,
	unique
} from "drizzle-orm/pg-core";
import { sql, type InferSelectModel } from "drizzle-orm";
import { ulid } from "ulid";

export const permissionsEnum = pgEnum("permission", [
	"DEFAULT",
	"VIEW_MUSIC_IDS",
	"CREATE_MUSIC_IDS",
	"MANAGE_MUSIC_IDS"
]);

export const account = pgTable("account", {
	id: text().primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const musicIds = pgTable("music_id", {
	id: text()
		.primaryKey()
		.$defaultFn(() => ulid()),
	robloxId: text("roblox_id").notNull(),
	createdById: varchar("created_by_id")
		.notNull()
		.references(() => user.id),
	name: varchar({ length: 128 }).notNull(),
	createdAt: timestamp("created_at")
		.default(sql`now()`)
		.notNull(),
	working: boolean().default(true).notNull(),
	tags: text().array().default([]).notNull()
});

export const session = pgTable(
	"session",
	{
		id: text().primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text().notNull(),
		createdAt: timestamp("created_at")
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		impersonatedBy: text("impersonated_by")
	},
	(table) => [unique("session_token_unique").on(table.token)]
);

export const user = pgTable(
	"user",
	{
		id: text().primaryKey(),
		name: text().notNull(),
		email: text().notNull(),
		emailVerified: boolean("email_verified").default(false).notNull(),
		image: text(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		role: text(),
		banned: boolean().default(false),
		banReason: text("ban_reason"),
		banExpires: timestamp("ban_expires"),
		permissions: permissionsEnum()
			.array()
			.default(sql`ARRAY['DEFAULT'::permission]`)
			.notNull()
	},
	(table) => [unique("user_email_unique").on(table.email)]
);

export const verification = pgTable("verification", {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export type MusicId = InferSelectModel<typeof musicIds>;
export type MusicIdWithCreator = MusicId & {
	creator: Pick<InferSelectModel<typeof user>, "id" | "name" | "image">;
};
