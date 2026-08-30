import { defineMeta } from "#lib/meta.js";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
	return {
		meta: defineMeta({
			title: "tt core"
		})
	};
};
