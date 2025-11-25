import { createAuthClient } from "better-auth/svelte";
import { error, redirect } from "@sveltejs/kit";
import { hasPermission, type Permission } from "./permissions";
import { getRequestEvent } from "$app/server";

export const authClient = createAuthClient();

/**
 * **only** use this in a remote function
 */
export async function requireAuth(shouldRedirect: boolean = true) {
	const { locals, url } = getRequestEvent();

	if (!locals.user || !locals.session) {
		if (shouldRedirect) {
			const to = encodeURIComponent(url.pathname + url.search);
			redirect(303, `/login?redirectTo=${to}`);
		}

		error(403);
	}

	return locals.user;
}

/**
 * **only** use this in a remote function
 *
 * this also calls {@link requireAuth}, so you don't need to call it
 */
export async function requireAdminAuth(shouldRedirect: boolean = true) {
	const user = await requireAuth(shouldRedirect);
	const event = getRequestEvent();

	if (user.role !== "admin") {
		if (shouldRedirect) {
			const to = encodeURIComponent(event.url.pathname + event.url.search);
			redirect(303, `/login?redirectTo=${to}`);
		}

		error(403);
	}

	return user;
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
