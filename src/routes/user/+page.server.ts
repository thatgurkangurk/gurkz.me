import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import { defineMeta } from "#lib/meta.js";

export const load = (async (ev) => {
	if (!ev.locals.user) throw error(401, "please sign in to continue");

	return {
		meta: defineMeta({
			title: "user settings"
		})
	};
}) satisfies PageServerLoad;
