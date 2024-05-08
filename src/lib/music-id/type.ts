import type { User } from "$lib/user/types";

export type MusicId = {
	id: string;
	created: string;
	updated: string;
	owner: User["id"];
	roblox_id: number;
	working: boolean;
	name: string;
	expand: {
		owner: User;
	};
};

export type GetMusicIdsResponse = {
	data: MusicId[];
	next: number | undefined;
};
