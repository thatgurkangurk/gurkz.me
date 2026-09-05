import { defineBaseMetaTags } from "svelte-meta-tags";
import type { LayoutLoad } from "./$types";
import { browser } from "$app/env";
import { QueryClient } from "@tanstack/svelte-query";

export async function load({ data, parent, url }) {
	const queryClient = new QueryClient({ defaultOptions: { queries: { enabled: browser } } });

	return {
		...defineBaseMetaTags({
			description: "i make random stuff",
			openGraph: {
				description: "i make random stuff",
				siteName: "gurkan's website",
				title: "gurkan's website",
				type: "website",
				url: new URL(url.pathname, url.origin).href
			},
			title: "gurkan's website",
			titleTemplate: "%s - gurkan's website"
		}),
		...data,
		queryClient
	};
}
