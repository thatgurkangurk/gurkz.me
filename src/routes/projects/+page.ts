import { defineMeta } from "$lib/meta";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
	return {
		meta: defineMeta({
			title: "projects"
		})
	};
};
