import { bigint, pgEnum, varchar } from "drizzle-orm/pg-core";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";
import { relations, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

const permissions = [
  "DEFAULT",
  "CREATE_MUSIC_IDS",
  "MANAGE_MUSIC_IDS",
] as const;

const roles = [
  "USER",
  "ADMIN"
] as const;

export type Permission = (typeof permissions)[number];
export const permissionsEnum = pgEnum("permission", permissions);

export type Role = (typeof roles)[number];
export const rolesEnum = pgEnum("role", roles);

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
  role: rolesEnum("role")
    .notNull()
    .default("USER")
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
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
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
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const musicIds = pgTable("music_id", {
  id: varchar("id", {
    length: 21,
  })
    .primaryKey()
    .$defaultFn(() => nanoid(21)),
  robloxId: bigint("roblox_id", {
    mode: "number",
  }).notNull(),
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

export const musicIdRelations = relations(musicIds, ({ one }) => ({
  creator: one(users, {
    fields: [musicIds.createdById],
    references: [users.id],
  }),
}));
