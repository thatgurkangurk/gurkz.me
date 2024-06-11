import { z } from "zod";

export type User = {
	id: string;
	username: string;
	email: string;
	profilePictureUrl: string;
	permissions: Record<string, boolean>;
};

const permissionEnumSchema = z.enum(["ADMIN", "MANAGE_MUSIC_IDS"]);

export type Permission = z.infer<typeof permissionEnumSchema>;
export const Permission = permissionEnumSchema.enum;
