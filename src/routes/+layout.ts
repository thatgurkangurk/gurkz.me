import { browser } from "$app/environment";
import { orpc } from "$lib/orpc";
import { QueryClient } from "@tanstack/svelte-query";

export async function load() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	await queryClient.ensureQueryData(orpc.session.get.queryOptions());

	return { queryClient };
}
