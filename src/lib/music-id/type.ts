import type { User } from "$lib/user/types";

export type MusicId = {
	id: string;
	name: string;
	robloxId: number;
	createdById: string;
	created: Date | null;
	working: boolean;
	createdBy: User;
};

export type GetMusicIdsResponse = {
	data: MusicId[];
	page: number;
};
