import { noop } from "@tanstack/svelte-query";

import type { PageLoad } from "./$types.js";
import { musicIdsInfiniteQueryOptions } from "./query.js";

export const load: PageLoad = async ({ parent, data }) => {
	const { queryClient } = await parent();

	await queryClient.infiniteQuery(musicIdsInfiniteQueryOptions()).catch(noop);

	return data;
};
