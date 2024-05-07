import type { LayoutLoad } from "./$types";
import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";

export const load: LayoutLoad = async ({ data }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 60 * 1000
			}
		}
	});

	return { queryClient, user: data.user };
};
