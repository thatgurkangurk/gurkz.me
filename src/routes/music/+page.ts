import { api } from "$lib/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["music_ids"],
		queryFn: ({ pageParam }) => api(fetch).getMusicIds(pageParam),
		initialPageParam: 1
	});
};
