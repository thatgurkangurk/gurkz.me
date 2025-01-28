import type { AdapterAccountType } from "@auth/core/adapters";
import { relations, sql } from "drizzle-orm";
import {
    pgEnum,
    varchar,
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { permissionsSchema } from "~/lib/permissions";
import { rolesSchema } from "~/lib/roles";

export const permissionsEnum = pgEnum("permission", permissionsSchema.options);

export const rolesEnum = pgEnum("role", rolesSchema.options);

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => nanoid(21)),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    permissions: permissionsEnum("permissions")
        .array()
        .notNull()
        .default(sql`ARRAY['DEFAULT']::permission[]`),
    role: rolesEnum("role").notNull().default("USER"),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        primaryKey({
            columns: [account.provider, account.providerAccountId],
            name: "compoundKey",
        }),
    ]
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
        primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
            name: "compositePk",
        }),
    ]
);

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => [
        primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
            name: "compositePK",
        }),
    ]
);

export const musicIds = pgTable("music_id", {
    id: varchar("id", {
        length: 21,
    })
        .primaryKey()
        .$defaultFn(() => nanoid(21)),
    robloxId: text("roblox_id").notNull(),
    createdById: varchar("created_by_id")
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

export const shortLinks = pgTable("short_link", {
    id: varchar("id", {
        length: 48,
    })
        .primaryKey()
        .$defaultFn(() => nanoid(48)),
    slug: varchar("slug", {
        length: 32,
    }).unique(),
    redirectTo: text("redirect_to"),
    creatorId: varchar("creator_id")
        .notNull()
        .references(() => users.id),
    clicks: integer("clicks").notNull().default(0),
});

export const shortLinkRelations = relations(shortLinks, ({ one }) => ({
    creator: one(users, {
        fields: [shortLinks.creatorId],
        references: [users.id],
    }),
}));

export const musicIdRelations = relations(musicIds, ({ one }) => ({
    creator: one(users, {
        fields: [musicIds.createdById],
        references: [users.id],
    }),
}));

export const userRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));
