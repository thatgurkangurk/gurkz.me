import { defineMeta } from "#lib/meta.js";
import type { PageLoad } from "./$types";

export const ssr = false;

export const load: PageLoad = ({ params }) => {
	return {
		meta: defineMeta({
			title: "video to html table"
		})
	};
};
