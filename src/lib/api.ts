import type { GetMusicIdsResponse, MusicId } from "./music-id/type";

export const api = (customFetch = fetch) => ({
	getMusicIds: async (page: number) => {
		const response = await customFetch(`/api/music?page=${page}`);
		const data = (await response.json()) as GetMusicIdsResponse;
		return data;
	},
	getMusicId: async (id: string) => {
		const response = await customFetch(`/api/music/${id}`);
		const data = (await response.json()) as MusicId;
		return data;
	}
});
