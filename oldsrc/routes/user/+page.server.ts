import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import { definePageMetaTags } from "svelte-meta-tags";

export const load = (async (ev) => {
	if (!ev.locals.user) throw error(401, "please sign in to continue");

	return {
		...definePageMetaTags({
			title: "user settings"
		})
	};
}) satisfies PageServerLoad;
