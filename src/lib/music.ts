import type { User } from "lucia";

type MusicId = {
	id: string;
	name: string;
	robloxId: number;
	created: Date;
	working: boolean;
	creator: Creator;
};

type Creator = {
	username: string;
	profilePictureUrl?: string;
};

export type { MusicId };
