import { deleteClip, moveClipVideo, setClipSelected } from "#lib/api/ttcore/clips.remote.js";
import { getClipsForVideo, getVideos } from "#lib/api/ttcore/videos.remote.js";
import type { Clip } from "#lib/types/clip.js";

import {
	type InfiniteData,
	infiniteQueryOptions,
	keepPreviousData,
	mutationOptions,
	queryOptions
} from "@tanstack/svelte-query";

const LIMIT = 20;

export function clipsForVideoInfiniteQueryOptions(videoId: string, search: string = "") {
	return infiniteQueryOptions({
		queryKey: ["ttcore", "admin", "clips", videoId, { search }] as const,
		queryFn: async ({ pageParam = 1 }) => {
			return getClipsForVideo({ videoId, page: pageParam, limit: LIMIT, search });
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === LIMIT ? allPages.length + 1 : undefined;
		},
		placeholderData: keepPreviousData
	});
}

export function getVideosQuery() {
	return queryOptions({
		queryKey: ["ttcore", "admin", "videos"] as const,
		queryFn: async () => {
			return getVideos();
		},
		placeholderData: keepPreviousData
	});
}

type ClipPage = Awaited<ReturnType<typeof getClipsForVideo>>;

type ClipCache = InfiniteData<ClipPage>;

export function deleteClipMutation() {
	return mutationOptions({
		mutationKey: ["ttcore", "admin", "clips", "delete"],
		mutationFn: async (payload: Clip) => {
			await deleteClip({ clipId: payload.id });

			return payload;
		},
		onSuccess: (deletedClip, _variables, _result, { client }) => {
			client.setQueriesData<ClipCache>(
				{ queryKey: ["ttcore", "admin", "clips", deletedClip.videoId] },
				(oldData) => {
					if (!oldData) return oldData;

					return {
						...oldData,
						pages: oldData.pages.map((page) => page.filter((item) => item.id !== deletedClip.id))
					};
				}
			);
		}
	});
}

export function moveClipMutation() {
	return mutationOptions({
		mutationKey: ["ttcore", "admin", "clips", "move"],
		mutationFn: async (payload: { clip: Clip; newVideoId: string }) => {
			await moveClipVideo({ clipId: payload.clip.id, newVideoId: payload.newVideoId });

			return payload.clip;
		},
		onSuccess: (movedClip, _variables, _result, { client }) => {
			client.setQueriesData<ClipCache>(
				{ queryKey: ["ttcore", "admin", "clips", movedClip.videoId] },
				(oldData) => {
					if (!oldData) return oldData;

					return {
						...oldData,
						pages: oldData.pages.map((page) => page.filter((item) => item.id !== movedClip.id))
					};
				}
			);
		}
	});
}

export function setClipSelectedMutation() {
	return mutationOptions({
		mutationKey: ["ttcore", "admin", "clips", "setSelected"],
		mutationFn: async (payload: { clip: Clip; selected: boolean }) => {
			await setClipSelected({ clipId: payload.clip.id, selected: payload.selected });

			return payload.clip;
		},
		onSuccess: (updatedClip, variables, _context, { client }) => {
			client.setQueriesData<ClipCache>(
				{ queryKey: ["ttcore", "admin", "clips", updatedClip.videoId] },
				(oldData) => {
					if (!oldData) return oldData;

					return {
						...oldData,
						pages: oldData.pages.map((page) =>
							page.map((item) =>
								item.id === updatedClip.id ? { ...item, selected: variables.selected } : item
							)
						)
					};
				}
			);
		}
	});
}
