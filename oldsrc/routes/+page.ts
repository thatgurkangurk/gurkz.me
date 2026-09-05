import { definePageMetaTags } from "svelte-meta-tags";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params, url }) => {
	return {
		...definePageMetaTags({ title: "home" })
	};
};
