import PocketBase, { ClientResponseError } from "pocketbase";
import { Permission } from "./types";

export async function getUserPermissions(
	pb: PocketBase,
	id: string | undefined
): Promise<Permission[] | null> {
	if (!id) return null;
	try {
		const { permissions } = (await pb.collection("users").getOne(id, {
			fields: "permissions"
		})) as { permissions: Permission[] };

		return permissions;
	} catch (err) {
		if (err instanceof ClientResponseError && err.status === 404) {
			return null;
		}
		console.error(`error: ${err}`);
		return null;
	}
}

export async function hasPermission(
	pb: PocketBase,
	userId: string | undefined,
	permission: Permission
): Promise<boolean> {
	if (!userId) return false;

	const permissions = await getUserPermissions(pb, userId);
	if (!permissions) return false;
	if (permissions.includes(Permission.admin)) return true;

	const hasPermission = permissions.includes(permission);

	return hasPermission;
}

// export async function hasPermission(userId: string | undefined, permission: Permission) {
// 	if (!userId) return false;
// 	const permissions = await getUserPermissions(userId);
// 	if (permissions.includes(Permission.ADMIN)) return true; // if the user has "ADMIN" it should be allowed to do anything
// 	const hasPermission = permissions.includes(permission);

// 	return hasPermission;
// }
