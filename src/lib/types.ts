export type MusicId = {
	id: string;
	robloxId: string;
	approved: boolean;
	working: boolean;
	ownerId: string;
	name: string;
	ownerUsername: string;
};

export type GetMusicIdsResponse = {
	data: { robloxId: string }[];
	next: number | undefined;
};
