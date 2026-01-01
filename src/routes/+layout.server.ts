import { auth } from "$lib/server/auth";
import type { LayoutServerLoad } from "./$types";

export const load = (async (ev) => {
	const session = await auth.api.getSession({
		headers: ev.request.headers
	});
	return {
		session
	};
}) satisfies LayoutServerLoad;
