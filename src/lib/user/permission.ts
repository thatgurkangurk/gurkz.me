import { db } from "$lib/db/client";
import { Permission, users } from "$lib/db/schema/user";
import { eq } from "drizzle-orm";

export async function getUserPermissions(userId: string) {
	const permissionsQuery = await db
		.select({
			permissions: users.permissions
		})
		.from(users)
		.where(eq(users.id, userId));

	const { permissions } = permissionsQuery[0];

	return permissions;
}

export async function hasPermission(userId: string | undefined, permission: Permission) {
	if (!userId) return false;
	const permissions = await getUserPermissions(userId);
	if (permissions.includes(Permission.ADMIN)) return true; // if the user has "ADMIN" it should be allowed to do anything
	const hasPermission = permissions.includes(permission);

	return hasPermission;
}
