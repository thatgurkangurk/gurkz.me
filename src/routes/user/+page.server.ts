import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import { defineMeta } from "$lib/meta";

export const load = (async (ev) => {
	if (!ev.locals.user)
		throw error(401, {
			message: "please sign in to continue"
		});

	return {
		meta: defineMeta({
			title: "user settings"
		})
	};
}) satisfies PageServerLoad;
