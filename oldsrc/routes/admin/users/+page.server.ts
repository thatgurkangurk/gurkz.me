import type { PageServerLoad } from "./$types";
import { adminGuard } from "../guard";
import { definePageMetaTags } from "svelte-meta-tags";

export const load = (async (ev) => {
	adminGuard(ev);

	return {
		...definePageMetaTags({
			title: "users - admin"
		})
	};
}) satisfies PageServerLoad;
