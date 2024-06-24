import {
  bigint,
  boolean,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./user";

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
