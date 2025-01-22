import { relations, sql } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    boolean,
    pgEnum,
    varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const permissions = [
    "DEFAULT",
    "CREATE_MUSIC_IDS",
    "MANAGE_MUSIC_IDS",
] as const;

export const roles = ["USER", "ADMIN"] as const;

export type Permission = (typeof permissions)[number];
export const permissionsEnum = pgEnum("permission", permissions);

export type Role = (typeof roles)[number];
export const rolesEnum = pgEnum("role", roles);

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    permissions: permissionsEnum("permissions")
        .array()
        .notNull()
        .default(sql`ARRAY['DEFAULT']::permission[]`),
    role: rolesEnum("role").notNull().default("USER"),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

export const musicId = pgTable("music_id", {
    id: varchar("id", {
        length: 21,
    })
        .primaryKey()
        .$defaultFn(() => nanoid(21)),
    robloxId: text("roblox_id").notNull(),
    createdById: varchar("created_by_id")
        .notNull()
        .references(() => user.id),
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

export const musicIdRelations = relations(musicId, ({ one }) => ({
    creator: one(user, {
        fields: [musicId.createdById],
        references: [user.id],
    }),
}));
