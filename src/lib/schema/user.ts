import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

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
});
