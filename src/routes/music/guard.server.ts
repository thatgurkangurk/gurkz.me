import { getRequestEvent } from "$app/server";
import { permix } from "$lib/permix.server";
import { error, redirect } from "@sveltejs/kit";

export async function musicIdListGuard() {
	const event = getRequestEvent();
	if (!event.locals.user || !event.locals.session) {
		const to = encodeURIComponent(event.url.pathname + event.url.search);
		redirect(303, `/login?redirectTo=${to}`);
	}

	if (!permix.check("musicId", "read"))
		throw error(403, {
			message: "You do not have permission to view this page."
		});
}
