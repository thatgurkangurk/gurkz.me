import { musicIdsInfiniteQueryOptions } from "./query.js";
import { QueryClient } from "@tanstack/svelte-query";
import type { PageLoad } from "./$types.js";

export const load: PageLoad = async ({ parent, data }) => {
	const { queryClient }: { queryClient: QueryClient } = await parent();

	await queryClient.infiniteQuery(musicIdsInfiniteQueryOptions()).catch(() => null);

	return data;
};
