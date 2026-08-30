import type { PageServerLoad } from "./$types";
import { adminGuard } from "../guard";
import { defineMeta } from "#lib/meta.js";

export const load = (async (ev) => {
	adminGuard(ev);

	return {
		meta: defineMeta({
			title: "users - admin"
		})
	};
}) satisfies PageServerLoad;
