import { noop } from "@tanstack/svelte-query";

import type { PageLoad } from "./$types.js";
import { clipsForVideoInfiniteQueryOptions } from "./query.js";

export const load: PageLoad = async ({ parent, data, params }) => {
	const { queryClient } = await parent();

	await queryClient.infiniteQuery(clipsForVideoInfiniteQueryOptions(params.videoId)).catch(noop);

	return data;
};
