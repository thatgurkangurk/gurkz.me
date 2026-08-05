import type { PageServerLoad } from "./$types";
import { adminGuard } from "../../guard";
import { defineMeta } from "$lib/meta";

export const load = (async (ev) => {
	adminGuard(ev);

	return {
		meta: defineMeta({
			title: "user - admin"
		})
	};
}) satisfies PageServerLoad;
