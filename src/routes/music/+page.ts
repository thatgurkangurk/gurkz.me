import { orpc } from "$lib/orpc";
import type { PageLoad } from "./$types";

export const load = (async ({ parent }) => {
	const { queryClient } = await parent();

	await queryClient.ensureQueryData(orpc.music.get.queryOptions());

	return {};
}) satisfies PageLoad;
