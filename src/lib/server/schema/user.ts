import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { permissionsEnum } from "./permission";
import { relations, sql } from "drizzle-orm";
import { rolesEnum } from "./role";
import { sessions } from "./session";

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
	role: rolesEnum("role").notNull().default("USER")
});

export const userRelations = relations(users, ({ many }) => ({ sessions: many(sessions) }));
