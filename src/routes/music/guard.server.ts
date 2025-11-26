import { getRequestEvent } from "$app/server";
import { hasPermission } from "$lib/permissions.js";
import { error, redirect } from "@sveltejs/kit";

export async function musicIdListGuard() {
	const event = getRequestEvent();
	if (!event.locals.user || !event.locals.session) {
		const to = encodeURIComponent(event.url.pathname + event.url.search);
		redirect(303, `/login?redirectTo=${to}`);
	}

	if (!hasPermission(event.locals.user, "VIEW_MUSIC_IDS"))
		throw error(403, {
			message: "You do not have permission to view this page."
		});
}
