import { searchParamsSchema } from "#lib/features/music/schemas.js";

import { error } from "@sveltejs/kit";
import { validateSearchParams } from "runed/kit";
import { definePageMetaTags } from "svelte-meta-tags";

import type { PageServerLoad } from "./$types";

export const load = (async (ev) => {
	if (!ev.locals.user) error(401, "please sign in to continue");

	if (!ev.locals.permix.check("musicId.list")) error(403, "sorry, but you can't view this page");

	const { searchParams } = validateSearchParams(ev.url, searchParamsSchema);

	return {
		...definePageMetaTags({ title: "music id list" }),

		searchParams: Object.fromEntries(searchParams)
	};
}) satisfies PageServerLoad;
