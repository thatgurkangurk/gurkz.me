import { orpc } from "$lib/orpc";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
	const { queryClient } = await event.parent();

	await queryClient.prefetchQuery(
		orpc.music.getMusicIds.queryOptions({
			input: { verifiedOnly: true }
		})
	);

	return {
		...event.data,
		test: "hi"
	};
};
