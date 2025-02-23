import { defineMeta } from "$lib/meta";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	return {
		subject: event.locals.session,
		meta: defineMeta({
			title: "home"
		})
	};
};
