import { defineMeta } from "#lib/meta.js";
import type { PageServerLoad } from "./$types";
import { adminGuard } from "./guard";

export const load = (async (ev) => {
	adminGuard(ev);

	return {
		meta: defineMeta({
			title: "admin"
		})
	};
}) satisfies PageServerLoad;
