import { z } from "zod";

export type User = {
	id: string;
	avatar: string;
	created: string;
	email: string;
	name: string;
	updated: string;
	username: string;
	verified: boolean;
};

const permissionEnumSchema = z.enum(["ADMIN", "MANAGE_MUSIC_IDS"]);

export type Permission = z.infer<typeof permissionEnumSchema>;
export const Permission = permissionEnumSchema.enum;
