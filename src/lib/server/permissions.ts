import { type Permission } from "$lib/schema/user";
import type { User } from "lucia";

function hasPermission(user: User | null, permission: Permission): boolean {
	if (!user) return false;
	if (!user.permissions.includes(permission)) return false;

	return true;
}

export { hasPermission };
