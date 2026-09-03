import { infiniteQueryOptions, keepPreviousData } from "@tanstack/svelte-query";
import { getMusicIds } from "#lib/api/music.remote.js";

const LIMIT = 20;

export function musicIdsInfiniteQueryOptions(search: string = "") {
	return infiniteQueryOptions({
		queryKey: ["musicIds", { search }] as const,
		queryFn: async ({ pageParam = 1 }) => {
			return getMusicIds({ page: pageParam, limit: LIMIT, search });
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === LIMIT ? allPages.length + 1 : undefined;
		},
		placeholderData: keepPreviousData
	});
}
