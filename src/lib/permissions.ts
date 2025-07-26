import { z } from "zod/v4";
import type { User } from "./server/auth";

export const permissions = [
	"DEFAULT",
	"CREATE_MUSIC_IDS",
	"CREATE_AUTO_VERIFIED_MUSIC_IDS",
	"MANAGE_MUSIC_IDS"
] as const;

export const Permissions = z.enum(permissions);

export type Permission = z.infer<typeof Permissions>;

export function hasPermission(user: User, permission: Permission) {
	return user.permissions.includes(permission);
}
