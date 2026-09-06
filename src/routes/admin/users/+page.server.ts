import { definePageMetaTags } from "svelte-meta-tags";

import { adminGuard } from "../guard";
import type { PageServerLoad } from "./$types";

export const load = (async (ev) => {
	adminGuard(ev);

	return {
		...definePageMetaTags({
			title: "users - admin"
		})
	};
}) satisfies PageServerLoad;
