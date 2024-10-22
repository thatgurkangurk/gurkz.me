import { type Permission, type User } from "$lib/schema/user";

function hasPermission(user: User | null, permission: Permission): boolean {
	if (!user) return false;
	if (!user.permissions.includes(permission)) return false;

	return true;
}

export { hasPermission };
