import { getRequestEvent, query } from "$app/server";
import { error } from "@sveltejs/kit";
import { auth } from "./server/auth";
import { hasPermission, type Permission } from "./permissions";

export const getSession = query(() => {
	return auth.api.getSession({
		headers: getRequestEvent().request.headers
	});
});

/**
 * **only** use this in a remote function
 */
export async function requireAuth() {
	return (await getSession())?.user ?? error(403);
}

/**
 * **only** use this in a remote function
 *
 * this also calls {@link requireAuth}, so you don't need to call it
 */
export async function requireUserPermission(permission: Permission) {
	const user = await requireAuth();

	if (!hasPermission(user, permission)) return error(403);

	return user;
}

/**
 * **only** use this in a remote function
 *
 * this also calls {@link requireAuth}, so you don't need to call it
 */
export async function requireUserPermissions(permissions: Permission[]) {
	const user = await requireAuth();

	for (const permission of permissions) {
		if (!hasPermission(user, permission)) return error(403);
	}

	return user;
}
