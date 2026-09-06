import { musicIdsInfiniteQueryOptions } from "./query.js";
import type { PageLoad } from "./$types.js";

export const load: PageLoad = async ({ parent, data }) => {
	const { queryClient } = await parent();

	await queryClient.infiniteQuery(musicIdsInfiniteQueryOptions()).catch(() => null);

	return data;
};
