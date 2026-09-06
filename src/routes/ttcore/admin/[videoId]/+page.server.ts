import { definePageMetaTags } from "svelte-meta-tags";

import { adminGuard } from "../guard.js";
import type { PageServerLoad } from "./$types";

export const load = (async (ev) => {
	adminGuard(ev);

	return {
		...definePageMetaTags({
			title: "admin - ttcore"
		})
	};
}) satisfies PageServerLoad;
