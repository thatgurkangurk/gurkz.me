import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load = (async (ev) => {
	if (!ev.locals.user)
		throw error(401, {
			message: "please sign in to continue"
		});

	if (!ev.locals.user.admin)
		throw error(403, {
			message: "sorry, but you cannot access this page"
		});

	return {};
}) satisfies PageServerLoad;
