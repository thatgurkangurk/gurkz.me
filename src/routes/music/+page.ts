import { orpc } from "$lib/orpc";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
	const { queryClient } = await event.parent();

	await queryClient.prefetchInfiniteQuery(
		orpc.music.getMusicIds.infiniteOptions({
			input: (pageParam: string | undefined) => ({
				cursor: pageParam,
				limit: 10,
				verifiedOnly: true
			}),
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: undefined
		})
	);

	return {
		...event.data,
		test: "hi"
	};
};
