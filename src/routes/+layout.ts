import { browser } from "$app/env";
import { QueryClient } from "@tanstack/svelte-query";

export async function load({ data, parent }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	// Must explicitly merge server data back into the returned object
	return {
		...data,
		queryClient
	};
}
