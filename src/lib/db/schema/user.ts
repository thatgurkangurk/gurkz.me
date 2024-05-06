import { z } from "zod";
import { bigint, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { musicIds } from "./music-id";

//                                    it's called standard because "DEFAULT" broke SQL
export const permissionEnum = pgEnum("permission_enum", ["STANDARD", "MUSIC_ADMIN", "ADMIN"]);
const permissionEnumSchema = z.enum(permissionEnum.enumValues);

export type Permission = z.infer<typeof permissionEnumSchema>;
export const Permission = permissionEnumSchema.enum;

export const users = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").unique(),
	email: text("email").unique(),
	discordId: bigint("discord_id", {
		mode: "number"
	}).unique(),
	permissions: permissionEnum("permissions").array().notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	musicIds: many(musicIds)
}));
