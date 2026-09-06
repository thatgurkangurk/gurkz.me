import { error } from "@sveltejs/kit";
import { definePageMetaTags } from "svelte-meta-tags";

import type { PageServerLoad } from "./$types";

export const load = (async (ev) => {
	if (!ev.locals.user) throw error(401, "please sign in to continue");

	return {
		...definePageMetaTags({
			title: "user settings"
		})
	};
}) satisfies PageServerLoad;
