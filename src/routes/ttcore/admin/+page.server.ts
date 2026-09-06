import { definePageMetaTags } from "svelte-meta-tags";

import type { PageServerLoad } from "./$types";
import { adminGuard } from "./guard.js";

export const load = (async (ev) => {
	adminGuard(ev);

	return {
		...definePageMetaTags({
			title: "admin - ttcore"
		})
	};
}) satisfies PageServerLoad;
