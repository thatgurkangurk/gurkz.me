import { definePageMetaTags } from "svelte-meta-tags";
import type { PageLoad } from "./$types";

export const ssr = false;

export const load: PageLoad = ({ params }) => {
	return {
		...definePageMetaTags({
			title: "video to html table"
		})
	};
};
