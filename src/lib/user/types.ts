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

	// permissions
	can_manage_music_ids: boolean;
	admin: boolean;
};

const permissionEnumSchema = z.enum(["admin", "manage_music_ids"]);

export type Permission = z.infer<typeof permissionEnumSchema>;
export const Permission = permissionEnumSchema.enum;
