import { defineMeta } from "$lib/meta";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
	return {
		meta: defineMeta({
			title: "home"
		})
	};
};
