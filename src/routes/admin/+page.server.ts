import { definePageMetaTags } from "svelte-meta-tags";
import type { PageServerLoad } from "./$types";
import { adminGuard } from "./guard";

export const load = (async (ev) => {
	adminGuard(ev);

	return {
		...definePageMetaTags({
			title: "admin"
		})
	};
}) satisfies PageServerLoad;
