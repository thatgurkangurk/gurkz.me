import { deleteMusicId, getMusicIds } from "#lib/api/music.remote.js";
import type { MusicIdWithCreator } from "#lib/server/db/schema.js";

import {
	type InfiniteData,
	infiniteQueryOptions,
	keepPreviousData,
	mutationOptions
} from "@tanstack/svelte-query";

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

type MusicPage = Awaited<ReturnType<typeof getMusicIds>>;

type MusicCache = InfiniteData<MusicPage>;

export function deleteMusicIdMutation() {
	return mutationOptions({
		mutationKey: ["musicIds", "delete"],
		mutationFn: async (payload: MusicIdWithCreator) => {
			const res = await deleteMusicId({ id: payload.id });

			if (!res.success) throw new Error("failed to delete music id");

			return payload.id;
		},
		onSuccess: (deletedId, _variables, _result, { client }) => {
			client.setQueriesData<MusicCache>({ queryKey: ["musicIds"] }, (oldData) => {
				if (!oldData) return oldData;

				return {
					...oldData,
					pages: oldData.pages.map((page) => page.filter((item) => item.id !== deletedId))
				};
			});
		}
	});
}
