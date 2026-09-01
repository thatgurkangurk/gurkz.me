import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import { defineMeta } from "#lib/meta.js";

export const load = (async (ev) => {
	if (!ev.locals.user) error(401, "please sign in to continue");

	if (!ev.locals.permix.check("musicId.list")) error(403, "sorry, but you can't view this page");

	return {
		meta: defineMeta({
			title: "music id list"
		})
	};
}) satisfies PageServerLoad;
