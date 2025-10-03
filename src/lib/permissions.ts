import * as v from "valibot";
import type { User } from "./server/auth";

export const permissions = [
	"DEFAULT",
	"CREATE_MUSIC_IDS",
	"CREATE_AUTO_VERIFIED_MUSIC_IDS",
	"MANAGE_MUSIC_IDS"
] as const;

export const Permissions = v.picklist(permissions);

export type Permission = v.InferOutput<typeof Permissions>;

export function hasPermission(user: User, permission: Permission) {
	return user.permissions.includes(permission);
}
