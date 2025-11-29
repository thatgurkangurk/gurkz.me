import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { relations } from "drizzle-orm";
import { ulid } from "ulid";

export const musicIds = pgTable("music_id", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  robloxId: text("roblox_id").notNull(),
  createdById: varchar("created_by_id")
    .notNull()
    .references(() => user.id),
  name: varchar("name", { length: 128 }).notNull(),
  created: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  working: boolean("working").notNull().default(true),
  tags: text("tags").array().notNull().default([]),
});

export const musicIdRelations = relations(musicIds, ({ one }) => ({
  creator: one(user, { fields: [musicIds.createdById], references: [user.id] }),
}));
